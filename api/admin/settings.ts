import { getAuthenticatedUser } from '../lib/auth';
import { getRepoFile, commitFile } from '../lib/github';
import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị.' });
  }

  const section = req.query?.section === 'brochure' ? 'brochure' : 'company';
  const filePath = `content/settings/${section}.json`;

  if (req.method === 'GET') {
    try {
      const localPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(localPath)) {
        const raw = fs.readFileSync(localPath, 'utf-8');
        return res.status(200).json({ ok: true, data: JSON.parse(raw) });
      }
      return res.status(200).json({ ok: true, data: {} });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lỗi khi đọc cài đặt.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;
      const contentStr = JSON.stringify(data, null, 2);
      const commitMessage = `cms(settings): update ${section} settings`;

      if (process.env.GITHUB_TOKEN) {
        await commitFile(filePath, contentStr, commitMessage, req.body.sha);
      } else {
        const localPath = path.join(process.cwd(), filePath);
        fs.writeFileSync(localPath, contentStr, 'utf-8');
      }

      return res.status(200).json({ ok: true, message: 'Đã lưu cấu hình thành công!' });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lỗi khi lưu cấu hình.' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
