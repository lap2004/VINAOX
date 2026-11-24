import { getAuthenticatedUser } from '../lib/auth';
import { getRepoFile, commitFile } from '../lib/github';
import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị.' });
  }

  // GET: List all products
  if (req.method === 'GET') {
    try {
      const contentProductsDir = path.join(process.cwd(), 'content', 'products');
      if (fs.existsSync(contentProductsDir)) {
        const files = fs.readdirSync(contentProductsDir).filter(f => f.endsWith('.json'));
        const products = files.map(file => {
          const raw = fs.readFileSync(path.join(contentProductsDir, file), 'utf-8');
          return JSON.parse(raw);
        });
        return res.status(200).json({ ok: true, products });
      }
      return res.status(200).json({ ok: true, products: [] });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lỗi khi tải danh sách sản phẩm.' });
    }
  }

  // POST: Update product info
  if (req.method === 'POST') {
    try {
      const product = req.body;
      if (!product || !product.slug || !product.name_vi) {
        return res.status(400).json({ error: 'Thiếu thông tin sản phẩm.' });
      }

      const filePath = `content/products/${product.slug}.json`;
      const contentStr = JSON.stringify(product, null, 2);
      const commitMessage = `cms(product): update "${product.name_vi}"`;

      if (process.env.GITHUB_TOKEN) {
        await commitFile(filePath, contentStr, commitMessage, req.body.sha);
      } else {
        const fullLocalPath = path.join(process.cwd(), filePath);
        fs.writeFileSync(fullLocalPath, contentStr, 'utf-8');
      }

      return res.status(200).json({ ok: true, message: 'Cập nhật sản phẩm thành công!' });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lỗi khi cập nhật sản phẩm.' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
