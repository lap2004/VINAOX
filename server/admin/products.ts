import { getAuthenticatedUser } from '../lib/auth.js';
import {
  getClientIp,
  readJsonBody,
  sanitizeCommitText,
  sanitizeSafeUrl,
  sanitizeSlug,
  stripUnsafeKeys,
  validateCsrfAndOrigin,
  wrapHandler
} from '../lib/security.js';
import { checkApiMutationRateLimit } from '../lib/rateLimit.js';
import { commitFile, deleteRepoFile, hasGitHubToken, listRepoJsonFiles, getRepoFile } from '../lib/github.js';
import { validateProduct, mergeProduct } from '../../src/shared/schemas/productSchema.js';
import fs from 'fs';
import path from 'path';

const ALLOWED_CATEGORIES = ['soft-dried', 'chips', 'nuts-seeds', 'mixed'];

export default wrapHandler(async (req: any, res: any) => {

  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị.' });
  }

  const useGitHub = hasGitHubToken();

  // GET: List all products
  if (req.method === 'GET') {
    try {
      const normalizeRawProduct = (raw: any, idx = 0) => {
        const nameVi = raw.name_vi || raw.nameVi || raw.vi?.name || 'Sản phẩm VINAXO';
        const nameEn = raw.name_en || raw.name || raw.nameEn || raw.en?.name || nameVi;
        const slug = raw.slug || raw.id || `product-${idx}`;
        return {
          ...raw,
          id: raw.id || slug,
          slug,
          name_vi: nameVi,
          name_en: nameEn,
          nameVi,
          name: nameEn,
          category: raw.category || 'soft-dried',
          image: raw.image || raw.imageWebp || raw.imageJpg || '/assets/images/products/placeholder.webp',
          description_vi: raw.description_vi || raw.descriptionVi || raw.shortDescriptionVi || raw.vi?.desc || '',
          description_en: raw.description_en || raw.description || raw.shortDescription || raw.en?.desc || '',
          origin_vi: raw.origin_vi || raw.originVi || raw.origin || '',
          origin_en: raw.origin_en || raw.origin || '',
          shelf_life: raw.shelf_life || raw.specs?.shelfLifeVi || '12 Tháng',
          packaging: raw.packaging || raw.specs?.packagingVi || 'Túi zip / Thùng carton xuất khẩu',
          certifications: Array.isArray(raw.certifications) ? raw.certifications : [],
          order: Number(raw.order) || idx + 1
        };
      };

      if (useGitHub) {
        const entries = await listRepoJsonFiles('content/products');
        const products = entries
          .map((e, idx) => normalizeRawProduct(e.data, idx))
          .sort((a: any, b: any) => (Number(a?.order) || 999) - (Number(b?.order) || 999));
        return res.status(200).json({ ok: true, products, source: 'github' });
      }

      const contentProductsDir = path.join(process.cwd(), 'content', 'products');
      if (fs.existsSync(contentProductsDir)) {
        const files = fs.readdirSync(contentProductsDir).filter(f => f.endsWith('.json'));
        const products = files
          .map((file, idx) => {
            const raw = JSON.parse(fs.readFileSync(path.join(contentProductsDir, file), 'utf-8').replace(/^\uFEFF/, ''));
            return normalizeRawProduct(raw, idx);
          })
          .sort((a: any, b: any) => (Number(a?.order) || 999) - (Number(b?.order) || 999));
        return res.status(200).json({ ok: true, products, source: 'local' });
      }
      return res.status(200).json({ ok: true, products: [], source: 'empty' });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lỗi khi tải danh sách sản phẩm.' });
    }
  }

  // Enforce CSRF + mutation rate limit on POST
  const csrfCheck = validateCsrfAndOrigin(req, {
    sessionToken: user.sessionToken,
    requireCsrfToken: true
  });
  if (!csrfCheck.ok) {
    return res.status(csrfCheck.status).json({ error: csrfCheck.error });
  }

  const mutLimit = checkApiMutationRateLimit(`${user.username}:${getClientIp(req)}`);
  if (!mutLimit.allowed) {
    res.setHeader('Retry-After', String(mutLimit.retryAfterSeconds));
    return res.status(429).json({ error: 'Thao tác quá nhanh. Vui lòng thử lại sau.' });
  }

  // POST: Update product info with Safe Publishing Pipeline & Field Preservation
  if (req.method === 'POST') {
    const rawBody = await readJsonBody(req);
    const requestSha = typeof rawBody.sha === 'string' ? rawBody.sha : undefined;
    const productInput = stripUnsafeKeys(rawBody);

    const slug = sanitizeSlug(productInput.slug || productInput.id);
    if (!slug) {
      return res.status(400).json({ error: 'Slug sản phẩm không hợp lệ.' });
    }

    const filePath = `content/products/${slug}.json`;

    // Fetch existing product to preserve existing fields and check concurrent edits
    let existingProduct: any = null;
    let targetSha = requestSha;

    if (useGitHub) {
      const existingFile = await getRepoFile(filePath);
      if (existingFile) {
        try {
          existingProduct = JSON.parse(existingFile.content);
          if (requestSha && existingFile.sha !== requestSha) {
            return res.status(409).json({
              error: 'Sản phẩm đã được cập nhật bởi một phiên làm việc khác. Vui lòng tải lại trang.',
              currentSha: existingFile.sha
            });
          }
          targetSha = existingFile.sha;
        } catch {
          existingProduct = null;
        }
      }
    } else {
      const fullLocalPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullLocalPath)) {
        try {
          existingProduct = JSON.parse(fs.readFileSync(fullLocalPath, 'utf-8').replace(/^\uFEFF/, ''));
        } catch {
          existingProduct = null;
        }
      }
    }

    productInput.slug = slug;
    productInput.id = slug;
    const merged = mergeProduct(existingProduct, productInput);
    const validation = validateProduct(merged);
    if (!validation.valid) {
      return res.status(400).json({
        error: `Dữ liệu sản phẩm không hợp lệ: ${validation.errors.join('; ')}`,
        errors: validation.errors
      });
    }

    const validatedProduct = validation.data;
    const contentStr = JSON.stringify(validatedProduct, null, 2);
    const commitMessage = `cms(product): update "${sanitizeCommitText(validatedProduct.nameVi || validatedProduct.name, 72)}"`;

    let result = null;
    if (useGitHub) {
      result = await commitFile(filePath, contentStr, commitMessage, targetSha);
    } else {
      const fullLocalPath = path.join(process.cwd(), filePath);
      fs.mkdirSync(path.dirname(fullLocalPath), { recursive: true });
      fs.writeFileSync(fullLocalPath, contentStr, 'utf-8');
      result = { sha: 'local-sha', commitSha: 'local-commit' };
    }

    return res.status(200).json({
      ok: true,
      message: 'Cập nhật sản phẩm an toàn thành công!',
      product: validatedProduct,
      result
    });
  }

  // DELETE: Remove a product from content/products/
  if (req.method === 'DELETE') {
    const rawBody = await readJsonBody(req);
    const rawSlug = rawBody.slug ?? req.query?.slug;
    const requestSha = typeof rawBody.sha === 'string' ? rawBody.sha : undefined;
    const slug = sanitizeSlug(rawSlug);
    if (!slug) {
      return res.status(400).json({ error: 'Slug sản phẩm cần xóa không hợp lệ.' });
    }

    const filePath = `content/products/${slug}.json`;
    if (useGitHub) {
      await deleteRepoFile(filePath, `cms(product): delete "${slug}"`, requestSha);
    } else {
      const fullLocalPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullLocalPath)) {
        fs.unlinkSync(fullLocalPath);
      } else {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm để xóa.' });
      }
    }

    return res.status(200).json({ ok: true, message: `Đã xóa sản phẩm ${slug} thành công.` });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
});
