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
import {
  getRepoFile,
  listRepoJsonFiles,
  commitFile,
  deleteRepoFile,
  hasGitHubToken
} from '../lib/github.js';
import { validateNewsArticle, mergeNewsArticle } from '../../src/shared/schemas/newsSchema.js';
import fs from 'fs';
import path from 'path';

export default wrapHandler(async (req: any, res: any) => {

  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị.' });
  }

  const useGitHub = hasGitHubToken();

  // 1. GET: Fetch list of articles or single article
  if (req.method === 'GET') {
    try {
      const rawSlug = req.query?.slug;
      if (rawSlug !== undefined) {
        const slug = sanitizeSlug(rawSlug);
        if (!slug) {
          return res.status(400).json({ error: 'Slug bài viết không hợp lệ.' });
        }

        const filePath = `content/news/${slug}.json`;
        if (useGitHub) {
          const file = await getRepoFile(filePath);
          if (!file) return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
          return res.status(200).json({ ok: true, article: JSON.parse(file.content), sha: file.sha });
        }

        const fullLocalPath = path.join(process.cwd(), filePath);
        if (!fs.existsSync(fullLocalPath)) {
          return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
        }
        return res.status(200).json({
          ok: true,
          article: JSON.parse(fs.readFileSync(fullLocalPath, 'utf-8').replace(/^\uFEFF/, '')),
          sha: 'local-sha'
        });
      }

      if (useGitHub) {
        const entries = await listRepoJsonFiles('content/news');
        const articles = entries
          .map(e => e.data)
          .sort((a: any, b: any) => {
            const da = new Date(a?.published_at || 0).getTime() || 0;
            const db = new Date(b?.published_at || 0).getTime() || 0;
            return db - da;
          });
        return res.status(200).json({ ok: true, articles, source: 'github' });
      }

      const contentNewsDir = path.join(process.cwd(), 'content', 'news');
      if (fs.existsSync(contentNewsDir)) {
        const files = fs.readdirSync(contentNewsDir).filter(f => f.endsWith('.json'));
        const articles = files
          .map(file => JSON.parse(fs.readFileSync(path.join(contentNewsDir, file), 'utf-8').replace(/^\uFEFF/, '')))
          .sort((a: any, b: any) => {
            const da = new Date(a?.published_at || 0).getTime() || 0;
            const db = new Date(b?.published_at || 0).getTime() || 0;
            return db - da;
          });
        return res.status(200).json({ ok: true, articles, source: 'local' });
      }

      return res.status(200).json({ ok: true, articles: [], source: 'empty' });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lỗi khi tải danh sách bài viết.' });
    }
  }

  // Enforce CSRF + mutation rate limits on POST/DELETE
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
    return res.status(429).json({ error: 'Thao tác quá nhanh. Vui lòng thử lại sau ít giây.' });
  }

  // 2. POST: Create or Update an article with Safe Publishing Pipeline
  if (req.method === 'POST') {
    const rawBody = await readJsonBody(req);
    const requestSha = typeof rawBody.sha === 'string' ? rawBody.sha : undefined;
    const articleInput = stripUnsafeKeys(rawBody);

    const slug = sanitizeSlug(articleInput.slug || articleInput.id);
    if (!slug) {
      return res.status(400).json({ error: 'Slug bài viết không hợp lệ (yêu cầu từ 3-120 ký tự chữ thường, số, gạch nối).' });
    }

    const filePath = `content/news/${slug}.json`;

    // 1. Fetch existing file to protect against concurrent modifications and preserve fields
    let existingArticle: any = null;
    let targetSha = requestSha;

    if (useGitHub) {
      const existingFile = await getRepoFile(filePath);
      if (existingFile) {
        try {
          existingArticle = JSON.parse(existingFile.content);
          if (requestSha && existingFile.sha !== requestSha) {
            return res.status(409).json({
              error: 'Nội dung bài viết đã được cập nhật bởi một phiên làm việc khác trên Git. Vui lòng tải lại trang trước khi lưu.',
              currentSha: existingFile.sha
            });
          }
          targetSha = existingFile.sha;
        } catch {
          existingArticle = null;
        }
      }
    } else {
      const fullLocalPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullLocalPath)) {
        try {
          existingArticle = JSON.parse(fs.readFileSync(fullLocalPath, 'utf-8').replace(/^\uFEFF/, ''));
        } catch {
          existingArticle = null;
        }
      }
    }

    // 2. Deep merge incoming data with existing content to guarantee zero lost fields
    articleInput.slug = slug;
    articleInput.id = slug;
    const mergedArticle = mergeNewsArticle(existingArticle, articleInput);

    // 3. Pre-Commit Validation Gate: strictly validate against shared content schema
    const validation = validateNewsArticle(mergedArticle);
    if (!validation.valid) {
      return res.status(400).json({
        error: `Dữ liệu bài viết không hợp lệ: ${validation.errors.join('; ')}`,
        errors: validation.errors
      });
    }

    const validatedArticle = validation.data;
    const isDraft = validatedArticle.status === 'draft' || !validatedArticle.published;
    const contentStr = JSON.stringify(validatedArticle, null, 2);
    const safeTitle = sanitizeCommitText(validatedArticle.title_vi, 72);
    const actionLabel = existingArticle ? 'update' : 'create';
    const commitMessage = `cms(news): ${actionLabel} "${safeTitle}"`;

    let result = null;
    if (useGitHub) {
      result = await commitFile(filePath, contentStr, commitMessage, targetSha);
    } else {
      const fullLocalPath = path.join(process.cwd(), filePath);
      const existed = fs.existsSync(fullLocalPath);
      fs.mkdirSync(path.dirname(fullLocalPath), { recursive: true });
      fs.writeFileSync(fullLocalPath, contentStr, 'utf-8');
      result = { sha: 'local-sha', commitSha: 'local-commit', existed };
    }

    return res.status(200).json({
      ok: true,
      message: isDraft ? 'Đã lưu bản nháp an toàn vào Git!' : 'Đã xuất bản bài viết thành công!',
      slug,
      article: validatedArticle,
      result
    });
  }

  // 3. DELETE: Remove an article
  if (req.method === 'DELETE') {
    const rawBody = await readJsonBody(req);
    const rawSlug = rawBody.slug ?? req.query?.slug;
    const requestSha = typeof rawBody.sha === 'string' ? rawBody.sha : undefined;
    const slug = sanitizeSlug(rawSlug);
    if (!slug) {
      return res.status(400).json({ error: 'Slug bài viết cần xóa không hợp lệ.' });
    }

    const filePath = `content/news/${slug}.json`;
    if (useGitHub) {
      await deleteRepoFile(filePath, `cms(news): delete "${slug}"`, requestSha);
    } else {
      const fullLocalPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullLocalPath)) {
        fs.unlinkSync(fullLocalPath);
      } else {
        return res.status(404).json({ error: 'Không tìm thấy bài viết để xóa.' });
      }
    }

    return res.status(200).json({ ok: true, message: `Đã xóa bài viết ${slug} thành công.` });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
});
