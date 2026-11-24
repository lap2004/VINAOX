import { getAuthenticatedUser } from '../lib/auth';
import { commitMediaFile } from '../lib/github';
import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị.' });
  }

  // GET: List uploaded images
  if (req.method === 'GET') {
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const mediaList: Array<{ name: string; url: string; size?: number; category: string }> = [];

      if (fs.existsSync(uploadsDir)) {
        const categories = ['news', 'products', 'certificates'];
        for (const cat of categories) {
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

      return res.status(200).json({ ok: true, media: mediaList });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lỗi khi tải thư viện hình ảnh.' });
    }
  }

  // POST: Upload an image file (Base64 data)
  if (req.method === 'POST') {
    try {
      const { filename, base64Data, category = 'news' } = req.body || {};

      if (!filename || !base64Data) {
        return res.status(400).json({ error: 'Vui lòng cung cấp tên file và dữ liệu ảnh.' });
      }

      // Check MIME type from data URL or header
      const match = base64Data.match(/^data:image\/(png|jpeg|jpg|webp);base64,/);
      if (!match && !base64Data.startsWith('/9j/') && !base64Data.startsWith('iVBORw') && !base64Data.startsWith('UklGR')) {
        return res.status(400).json({ error: 'Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, PNG hoặc WebP.' });
      }

      // Estimate byte size from Base64 string length
      const approximateSizeBytes = (base64Data.length * 3) / 4;
      if (approximateSizeBytes > 4.5 * 1024 * 1024) {
        return res.status(400).json({ error: 'Dung lượng ảnh vượt quá giới hạn cho phép (tối đa 4.5MB).' });
      }

      // Sanitize filename & add timestamp prefix to prevent name collisions
      const cleanName = filename.toLowerCase().replace(/[^a-z0-9._-]/g, '-').replace(/-+/g, '-');
      const ext = path.extname(cleanName) || '.webp';
      const baseName = path.basename(cleanName, ext);
      const uniqueFilename = `${baseName}-${Date.now()}${ext}`;
      const targetCategory = ['news', 'products', 'certificates'].includes(category) ? category : 'news';
      const targetFilePath = `public/uploads/${targetCategory}/${uniqueFilename}`;

      if (process.env.GITHUB_TOKEN) {
        const result = await commitMediaFile(targetFilePath, base64Data, `cms(media): upload ${uniqueFilename}`);
        return res.status(200).json({ ok: true, url: result.publicUrl, path: targetFilePath });
      } else {
        // Local file system write
        const localPath = path.join(process.cwd(), targetFilePath);
        fs.mkdirSync(path.dirname(localPath), { recursive: true });
        const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
        fs.writeFileSync(localPath, Buffer.from(cleanBase64, 'base64'));
        return res.status(200).json({ ok: true, url: `/uploads/${targetCategory}/${uniqueFilename}`, path: targetFilePath });
      }
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Không thể upload hình ảnh.' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
