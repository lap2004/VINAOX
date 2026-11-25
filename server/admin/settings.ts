import { getAuthenticatedUser } from '../lib/auth.js';
import {
  getClientIp,
  readJsonBody,
  sanitizeSafeUrl,
  stripUnsafeKeys,
  validateCsrfAndOrigin,
  wrapHandler
} from '../lib/security.js';
import { checkApiMutationRateLimit } from '../lib/rateLimit.js';
import { commitFile, getRepoFile, hasGitHubToken } from '../lib/github.js';
import fs from 'fs';
import path from 'path';

export default wrapHandler(async (req: any, res: any) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị.' });
  }

  const section = req.query?.section === 'brochure' ? 'brochure' : 'company';
  const filePath = `content/settings/${section}.json`;
  const useGitHub = hasGitHubToken();

  if (req.method === 'GET') {
    if (useGitHub) {
      const file = await getRepoFile(filePath);
      if (file) {
        return res.status(200).json({ ok: true, data: JSON.parse(file.content), sha: file.sha, source: 'github' });
      }
      return res.status(200).json({ ok: true, data: {}, source: 'github' });
    }

    const localPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(localPath)) {
      const raw = fs.readFileSync(localPath, 'utf-8').replace(/^\uFEFF/, '');
      return res.status(200).json({ ok: true, data: JSON.parse(raw), source: 'local' });
    }
    return res.status(200).json({ ok: true, data: {}, source: 'empty' });
  }

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

  if (req.method === 'POST') {
    const rawBody = await readJsonBody(req);
    const requestSha = typeof rawBody.sha === 'string' ? rawBody.sha : undefined;
    const data = stripUnsafeKeys(rawBody);

    if (section === 'brochure' && typeof data.pdf_file === 'string') {
      const safePdf = sanitizeSafeUrl(data.pdf_file, true);
      if (!safePdf) {
        return res.status(400).json({ error: 'Đường dẫn file PDF Brochure không hợp lệ.' });
      }
      data.pdf_file = safePdf;
    }

    const contentStr = JSON.stringify(data, null, 2);
    const commitMessage = `cms(settings): update ${section} settings`;

    let result = null;
    if (useGitHub) {
      result = await commitFile(filePath, contentStr, commitMessage, requestSha);
    } else {
      const localPath = path.join(process.cwd(), filePath);
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      fs.writeFileSync(localPath, contentStr, 'utf-8');
      result = { sha: 'local-sha', commitSha: 'local-commit' };
    }

    return res.status(200).json({
      ok: true,
      message: 'Đã lưu cấu hình thành công!',
      data,
      result
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
});
