import { getAuthenticatedUser } from '../lib/auth.js';
import {
  applySecurityHeaders,
  getClientIp,
  sanitizeCommitText,
  sanitizeSafeUrl,
  sanitizeSlug,
  stripUnsafeKeys,
  validateCsrfAndOrigin
} from '../lib/security.js';
import { checkApiMutationRateLimit } from '../lib/rateLimit.js';
import { commitFile, hasGitHubToken, listRepoJsonFiles } from '../lib/github.js';
import fs from 'fs';
import path from 'path';

const ALLOWED_CATEGORIES = ['soft-dried', 'chips', 'nuts-seeds', 'mixed'];

export default async function handler(req: any, res: any) {
  applySecurityHeaders(res);

  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị.' });
  }

  const useGitHub = hasGitHubToken();

  // GET: List all products
  if (req.method === 'GET') {
    try {
      if (useGitHub) {
        const entries = await listRepoJsonFiles('content/products');
        const products = entries
          .map(e => e.data)
          .sort((a: any, b: any) => (Number(a?.order) || 999) - (Number(b?.order) || 999));
        return res.status(200).json({ ok: true, products, source: 'github' });
      }

      const contentProductsDir = path.join(process.cwd(), 'content', 'products');
      if (fs.existsSync(contentProductsDir)) {
        const files = fs.readdirSync(contentProductsDir).filter(f => f.endsWith('.json'));
        const products = files
          .map(file => JSON.parse(fs.readFileSync(path.join(contentProductsDir, file), 'utf-8').replace(/^\uFEFF/, '')))
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

  // POST: Update product info
  if (req.method === 'POST') {
    try {
      const rawBody = req.body || {};
      const requestSha = typeof rawBody.sha === 'string' ? rawBody.sha : undefined;
      const product = stripUnsafeKeys(rawBody);

      const slug = sanitizeSlug(product.slug);
      if (!slug || typeof product.name_vi !== 'string' || !product.name_vi.trim()) {
        return res.status(400).json({ error: 'Thiếu slug hợp lệ hoặc tên sản phẩm tiếng Việt.' });
      }

      product.slug = slug;
      product.id = typeof product.id === 'string' && product.id.trim() ? sanitizeSlug(product.id) || slug : slug;
      if (typeof product.category !== 'string' || !ALLOWED_CATEGORIES.includes(product.category)) {
        product.category = 'soft-dried';
      }
      product.image = sanitizeSafeUrl(product.image, true) || `/images/products/${slug}.webp`;

      const filePath = `content/products/${slug}.json`;
      const contentStr = JSON.stringify(product, null, 2);
      const commitMessage = `cms(product): update "${sanitizeCommitText(product.name_vi, 72)}"`;

      let result = null;
      if (useGitHub) {
        result = await commitFile(filePath, contentStr, commitMessage, requestSha);
      } else {
        const fullLocalPath = path.join(process.cwd(), filePath);
        fs.mkdirSync(path.dirname(fullLocalPath), { recursive: true });
        fs.writeFileSync(fullLocalPath, contentStr, 'utf-8');
        result = { sha: 'local-sha', commitSha: 'local-commit' };
      }

      return res.status(200).json({
        ok: true,
        message: 'Cập nhật sản phẩm thành công!',
        product,
        result
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lỗi khi cập nhật sản phẩm.' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
