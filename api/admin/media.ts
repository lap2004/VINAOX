import { getAuthenticatedUser } from '../lib/auth.js';
import {
  applySecurityHeaders,
  getClientIp,
  sanitizeCommitText,
  validateCsrfAndOrigin
} from '../lib/security.js';
import { checkApiMutationRateLimit } from '../lib/rateLimit.js';
import {
  commitMediaFile,
  getRepoBinaryFile,
  hasGitHubToken,
  listRepoDirectory,
  validatePath
} from '../lib/github.js';
import fs from 'fs';
import path from 'path';

const ALLOWED_CATEGORIES = ['news', 'products', 'certificates'];
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

export default async function handler(req: any, res: any) {
  applySecurityHeaders(res);

  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị.' });
  }

  const useGitHub = hasGitHubToken();

  // GET: Stream an individual image preview from GitHub OR list all uploaded media
  if (req.method === 'GET') {
    try {
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

      const mediaList: Array<{ name: string; url: string; fallbackUrl?: string; size?: number; category: string }> = [];

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
        return res.status(200).json({ ok: true, media: mediaList, source: 'github' });
      }

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

      return res.status(200).json({ ok: true, media: mediaList, source: 'local' });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lỗi khi tải thư viện hình ảnh.' });
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
    return res.status(429).json({ error: 'Upload quá nhiều ảnh liên tiếp. Vui lòng chờ giây lát.' });
  }

  // POST: Upload an image file (Base64 data)
  if (req.method === 'POST') {
    try {
      const { filename, base64Data, category = 'news' } = req.body || {};

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

      // Sanitize filename & enforce extension matching real binary format
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
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Không thể upload hình ảnh.' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
