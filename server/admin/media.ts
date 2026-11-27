import { getAuthenticatedUser } from '../lib/auth.js';
import {
  getClientIp,
  readJsonBody,
  sanitizeCommitText,
  validateCsrfAndOrigin,
  wrapHandler
} from '../lib/security.js';
import { checkApiMutationRateLimit } from '../lib/rateLimit.js';
import {
  commitMediaFile,
  deleteRepoFile,
  getRepoBinaryFile,
  hasGitHubToken,
  listRepoDirectory,
  listRepoJsonFiles,
  validatePath
} from '../lib/github.js';
import fs from 'fs';
import path from 'path';

const ALLOWED_CATEGORIES = ['about', 'news', 'products', 'certificates', 'banners'];
const MAX_BINARY_BYTES = 3 * 1024 * 1024; // 3 MB raw binary (~4 MB base64, safely under Vercel 4.5 MB body cap)

function detectImageFormat(base64Data: string): { ext: string; cleanBase64: string } | null {
  const headerMatch = base64Data.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/i);
  let declaredType = '';
  let rawBase64 = base64Data;

  if (headerMatch) {
    declaredType = headerMatch[1].toLowerCase();
    rawBase64 = headerMatch[2];
  }

  // Decode first 16 bytes to verify actual magic bytes regardless of declared extension
  const headBuf = Buffer.from(rawBase64.slice(0, 32), 'base64');
  if (headBuf.length < 12) return null;

  const isJpeg = headBuf[0] === 0xff && headBuf[1] === 0xd8 && headBuf[2] === 0xff;
  const isPng = headBuf[0] === 0x89 && headBuf[1] === 0x50 && headBuf[2] === 0x4e && headBuf[3] === 0x47;
  const isWebp =
    headBuf.subarray(0, 4).toString('ascii') === 'RIFF' &&
    headBuf.subarray(8, 12).toString('ascii') === 'WEBP';

  if (isWebp) return { ext: '.webp', cleanBase64: rawBase64 };
  if (isPng) return { ext: '.png', cleanBase64: rawBase64 };
  if (isJpeg) return { ext: '.jpg', cleanBase64: rawBase64 };

  if (declaredType === 'webp' && rawBase64.startsWith('UklGR')) return { ext: '.webp', cleanBase64: rawBase64 };
  return null;
}

/**
 * Searches all content JSON files (news, products, settings, certificates) for references to a given image URL or filename.
 */
async function findMediaReferences(mediaPathOrUrl: string, useGitHub: boolean): Promise<Array<{ type: string; title: string; file: string }>> {
  const references: Array<{ type: string; title: string; file: string }> = [];
  const filename = path.basename(mediaPathOrUrl);
  const normalizedUrl = mediaPathOrUrl.startsWith('/') ? mediaPathOrUrl : `/${mediaPathOrUrl}`;

  const checkDirs = [
    { dir: 'content/news', type: 'Bài viết tin tức', titleField: 'title_vi' },
    { dir: 'content/products', type: 'Sản phẩm', titleField: 'name_vi' },
    { dir: 'content/settings', type: 'Cài đặt hệ thống', titleField: 'title_vi' },
    { dir: 'content/certificates', type: 'Chứng nhận', titleField: 'nameVi' }
  ];

  for (const item of checkDirs) {
    if (useGitHub) {
      try {
        const entries = await listRepoJsonFiles(item.dir);
        for (const entry of entries) {
          const contentStr = JSON.stringify(entry.data);
          if (contentStr.includes(mediaPathOrUrl) || contentStr.includes(filename) || contentStr.includes(normalizedUrl)) {
            references.push({
              type: item.type,
              title: entry.data[item.titleField] || entry.data.nameVi || entry.data.name || entry.name,
              file: `${item.dir}/${entry.name}`
            });
          }
        }
      } catch {}
    } else {
      const fullDir = path.join(process.cwd(), item.dir);
      if (fs.existsSync(fullDir)) {
        const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.json'));
        for (const f of files) {
          try {
            const content = fs.readFileSync(path.join(fullDir, f), 'utf-8');
            if (content.includes(mediaPathOrUrl) || content.includes(filename) || content.includes(normalizedUrl)) {
              const parsed = JSON.parse(content.replace(/^\uFEFF/, ''));
              references.push({
                type: item.type,
                title: parsed[item.titleField] || parsed.nameVi || parsed.name || f,
                file: `${item.dir}/${f}`
              });
            }
          } catch {}
        }
      }
    }
  }

  return references;
}

export default wrapHandler(async (req: any, res: any) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị.' });
  }

  const useGitHub = hasGitHubToken();

  // GET: Stream preview OR check usage OR list all uploaded media with reference counts
  if (req.method === 'GET') {
    try {
      // 1. Check references for a single image
      const checkUsage = req.query?.checkUsage;
      if (typeof checkUsage === 'string' && checkUsage.trim()) {
        const references = await findMediaReferences(checkUsage.trim(), useGitHub);
        return res.status(200).json({ ok: true, usageCount: references.length, references });
      }

      // 2. Stream an individual raw image
      const rawFile = req.query?.raw;
      if (typeof rawFile === 'string' && rawFile.trim()) {
        const cleanFile = rawFile.replace(/^\/+/, '');
        const fullRepoPath = cleanFile.startsWith('public/') ? cleanFile : `public/${cleanFile}`;
        if (!fullRepoPath.startsWith('public/uploads/') || !validatePath(fullRepoPath)) {
          return res.status(400).json({ error: 'Đường dẫn ảnh không hợp lệ.' });
        }

        const localCandidate = path.join(process.cwd(), fullRepoPath);
        if (fs.existsSync(localCandidate)) {
          const ext = path.extname(localCandidate).toLowerCase();
          res.setHeader('Content-Type', ext === '.png' ? 'image/png' : ext === '.jpg' ? 'image/jpeg' : 'image/webp');
          return res.status(200).send(fs.readFileSync(localCandidate));
        }

        if (useGitHub) {
          const bin = await getRepoBinaryFile(fullRepoPath);
          if (bin) {
            res.setHeader('Content-Type', bin.contentType);
            return res.status(200).send(bin.buffer);
          }
        }
        return res.status(404).json({ error: 'Không tìm thấy ảnh.' });
      }

      // 3. List all media items + verified factory images for About gallery picking
      const mediaList: Array<{ name: string; url: string; fallbackUrl?: string; size?: number; category: string; usageCount?: number }> = [];

      const factoryAssetDirs = [
        { repoDir: 'public/assets/images/factory', urlPrefix: '/assets/images/factory' },
        { repoDir: 'public/assets/images/factory-2026', urlPrefix: '/assets/images/factory-2026' }
      ];
      for (const dirInfo of factoryAssetDirs) {
        const absDir = path.join(process.cwd(), dirInfo.repoDir);
        if (fs.existsSync(absDir)) {
          const files = fs.readdirSync(absDir).filter(f => f.toLowerCase().endsWith('.webp'));
          for (const f of files) {
            const stat = fs.statSync(path.join(absDir, f));
            mediaList.push({
              name: f,
              url: `${dirInfo.urlPrefix}/${f}`,
              size: stat.size,
              category: 'about'
            });
          }
        }
      }

      if (useGitHub) {
        const catResults = await Promise.all(
          ALLOWED_CATEGORIES.map(async (cat) => {
            const entries = await listRepoDirectory(`public/uploads/${cat}`);
            return entries
              .filter(e => e.type === 'file' && !e.name.startsWith('.'))
              .map(e => ({
                name: e.name,
                url: `/uploads/${cat}/${e.name}`,
                fallbackUrl: `/api/admin/media?raw=${encodeURIComponent(`public/uploads/${cat}/${e.name}`)}`,
                size: e.size,
                category: cat
              }));
          })
        );
        catResults.forEach(items => mediaList.push(...items));
      } else {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (fs.existsSync(uploadsDir)) {
          for (const cat of ALLOWED_CATEGORIES) {
            const catDir = path.join(uploadsDir, cat);
            if (fs.existsSync(catDir)) {
              const files = fs.readdirSync(catDir).filter(f => !f.startsWith('.'));
              files.forEach(f => {
                const stat = fs.statSync(path.join(catDir, f));
                mediaList.push({
                  name: f,
                  url: `/uploads/${cat}/${f}`,
                  size: stat.size,
                  category: cat
                });
              });
            }
          }
        }
      }

      return res.status(200).json({ ok: true, media: mediaList, source: useGitHub ? 'github' : 'local' });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lỗi khi tải thư viện hình ảnh.' });
    }
  }

  // Enforce CSRF + mutation rate limit on POST / DELETE
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

  // POST: Upload an image file (Base64 data) or edited/cropped image
  if (req.method === 'POST') {
    const body = await readJsonBody(req);
    const { filename, base64Data, category = 'news' } = body;

    if (typeof filename !== 'string' || !filename.trim() || typeof base64Data !== 'string' || !base64Data) {
      return res.status(400).json({ error: 'Vui lòng cung cấp tên file và dữ liệu ảnh.' });
    }

    const detected = detectImageFormat(base64Data);
    if (!detected) {
      return res.status(400).json({ error: 'Định dạng ảnh không hợp lệ. Chỉ chấp nhận file thực tế JPG, PNG hoặc WebP.' });
    }

    const decodedBuffer = Buffer.from(detected.cleanBase64, 'base64');
    if (decodedBuffer.length === 0 || decodedBuffer.length > MAX_BINARY_BYTES) {
      return res.status(400).json({ error: 'Dung lượng ảnh vượt quá giới hạn cho phép (tối đa 3MB sau nén).' });
    }

    const cleanName = filename.toLowerCase().replace(/[^a-z0-9._-]/g, '-').replace(/-+/g, '-');
    const rawExt = path.extname(cleanName);
    const baseName = path.basename(cleanName, rawExt).replace(/[^a-z0-9_-]/g, '-').slice(0, 60) || 'vinaxo-image';
    const uniqueFilename = `${baseName}-${Date.now()}${detected.ext}`;
    const targetCategory = ALLOWED_CATEGORIES.includes(category) ? category : 'news';
    const targetFilePath = `public/uploads/${targetCategory}/${uniqueFilename}`;
    const safeCommitName = sanitizeCommitText(uniqueFilename, 80);

    if (useGitHub) {
      const result = await commitMediaFile(targetFilePath, detected.cleanBase64, `cms(media): upload ${safeCommitName}`);
      return res.status(200).json({
        ok: true,
        url: result.publicUrl,
        fallbackUrl: `/api/admin/media?raw=${encodeURIComponent(targetFilePath)}`,
        path: targetFilePath,
        size: decodedBuffer.length,
        commitSha: result.commitSha,
        branch: result.branch
      });
    } else {
      const localPath = path.join(process.cwd(), targetFilePath);
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      fs.writeFileSync(localPath, decodedBuffer);
      return res.status(200).json({
        ok: true,
        url: `/uploads/${targetCategory}/${uniqueFilename}`,
        path: targetFilePath,
        size: decodedBuffer.length
      });
    }
  }

  // DELETE: Remove an image with strict reference safety checking
  if (req.method === 'DELETE') {
    const body = await readJsonBody(req);
    const rawUrl = body?.url || body?.path || req.query?.url;
    const force = Boolean(body?.force);

    if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
      return res.status(400).json({ error: 'Vui lòng cung cấp đường dẫn ảnh cần xóa.' });
    }

    const cleanUrl = rawUrl.trim().replace(/^\/+/, '');
    const repoFilePath = cleanUrl.startsWith('public/') ? cleanUrl : `public/${cleanUrl}`;

    if (!repoFilePath.startsWith('public/uploads/') || !validatePath(repoFilePath)) {
      return res.status(400).json({ error: 'Chỉ cho phép xóa các hình ảnh thuộc thư mục public/uploads/.' });
    }

    // Reference validation gate
    const references = await findMediaReferences(cleanUrl, useGitHub);
    if (references.length > 0 && !force) {
      return res.status(409).json({
        ok: false,
        error: `Không thể xóa ảnh vì đang được sử dụng tại ${references.length} vị trí trên website. Vui lòng thay thế hoặc gỡ tham chiếu trước khi xóa.`,
        referenced: true,
        references
      });
    }

    const filename = path.basename(repoFilePath);
    if (useGitHub) {
      await deleteRepoFile(repoFilePath, `cms(media): delete "${sanitizeCommitText(filename, 70)}"`);
    } else {
      const localPath = path.join(process.cwd(), repoFilePath);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      } else {
        return res.status(404).json({ error: 'Không tìm thấy tệp ảnh trên máy chủ để xóa.' });
      }
    }

    return res.status(200).json({
      ok: true,
      message: `Đã xóa ảnh "${filename}" thành công khỏi hệ thống.`
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
});
