import { getAuthenticatedUser } from '../lib/auth';
import { getRepoFile, commitFile, deleteRepoFile } from '../lib/github';
import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị.' });
  }

  // 1. GET: Fetch list of articles or single article
  if (req.method === 'GET') {
    try {
      const slug = req.query?.slug;
      if (slug) {
        const filePath = `content/news/${slug}.json`;
        const file = await getRepoFile(filePath);
        if (!file) return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
        return res.status(200).json({ ok: true, article: JSON.parse(file.content), sha: file.sha });
      }

      // If local filesystem is accessible (dev/build environment), read from disk directly
      const contentNewsDir = path.join(process.cwd(), 'content', 'news');
      if (fs.existsSync(contentNewsDir)) {
        const files = fs.readdirSync(contentNewsDir).filter(f => f.endsWith('.json'));
        const articles = files.map(file => {
          const raw = fs.readFileSync(path.join(contentNewsDir, file), 'utf-8');
          return JSON.parse(raw);
        });
        return res.status(200).json({ ok: true, articles });
      }

      return res.status(200).json({ ok: true, articles: [] });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lỗi khi tải danh sách bài viết.' });
    }
  }

  // 2. POST: Create or Update an article
  if (req.method === 'POST') {
    try {
      const article = req.body;
      if (!article || !article.slug || !article.title_vi) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tiêu đề và đường dẫn (slug) cho bài viết.' });
      }

      // Clean and sanitize slug
      const slug = article.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
      article.slug = slug;
      article.id = article.id || slug;
      article.updated_at = new Date().toISOString().split('T')[0];

      const filePath = `content/news/${slug}.json`;
      const contentStr = JSON.stringify(article, null, 2);
      const commitMessage = `cms(news): ${article.id ? 'update' : 'create'} "${article.title_vi}"`;

      // In local development or serverless with token:
      let result = null;
      if (process.env.GITHUB_TOKEN) {
        result = await commitFile(filePath, contentStr, commitMessage, req.body.sha);
      } else {
        // Fallback for local testing without GITHUB_TOKEN
        const fullLocalPath = path.join(process.cwd(), filePath);
        fs.mkdirSync(path.dirname(fullLocalPath), { recursive: true });
        fs.writeFileSync(fullLocalPath, contentStr, 'utf-8');
        result = { sha: 'local-sha', commitSha: 'local-commit' };
      }

      return res.status(200).json({
        ok: true,
        message: 'Lưu bài viết thành công!',
        slug: slug,
        result
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Không thể lưu bài viết.' });
    }
  }

  // 3. DELETE: Remove an article
  if (req.method === 'DELETE') {
    try {
      const { slug, sha } = req.body || req.query || {};
      if (!slug) {
        return res.status(400).json({ error: 'Vui lòng cung cấp slug bài viết cần xóa.' });
      }

      const filePath = `content/news/${slug}.json`;
      if (process.env.GITHUB_TOKEN) {
        let fileSha = sha;
        if (!fileSha) {
          const file = await getRepoFile(filePath);
          if (file) fileSha = file.sha;
        }
        if (!fileSha) return res.status(404).json({ error: 'Không tìm thấy bài viết để xóa.' });
        await deleteRepoFile(filePath, `cms(news): delete "${slug}"`, fileSha);
      } else {
        const fullLocalPath = path.join(process.cwd(), filePath);
        if (fs.existsSync(fullLocalPath)) {
          fs.unlinkSync(fullLocalPath);
        }
      }

      return res.status(200).json({ ok: true, message: `Đã xóa bài viết ${slug} thành công.` });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lỗi khi xóa bài viết.' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
