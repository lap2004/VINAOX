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
import {
  validateCompanySettings,
  validateBrochureSettings
} from '../../src/shared/schemas/settingsSchema.js';
import {
  AboutPageContent,
  validateAboutContent
} from '../../src/shared/schemas/aboutSchema.js';
import fs from 'fs';
import path from 'path';

export default wrapHandler(async (req: any, res: any) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị.' });
  }

  const rawSection = req.query?.section;
  const section =
    rawSection === 'brochure'
      ? 'brochure'
      : rawSection === 'about'
        ? 'about'
        : 'company';
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
    const incomingData = stripUnsafeKeys(rawBody);

    let validatedData: any = incomingData;
    let commitMessage = `cms(settings): update ${section} settings`;

    if (section === 'brochure') {
      const v = validateBrochureSettings(incomingData);
      if (!v.valid) {
        return res.status(400).json({ error: `Dữ liệu cấu hình Brochure không hợp lệ: ${v.errors.join('; ')}` });
      }
      validatedData = v.data;
    } else if (section === 'about') {
      let existingAbout: AboutPageContent | undefined = undefined;
      try {
        if (useGitHub) {
          const existingFile = await getRepoFile(filePath);
          if (existingFile) {
            existingAbout = JSON.parse(existingFile.content);
          }
        } else {
          const localPath = path.join(process.cwd(), filePath);
          if (fs.existsSync(localPath)) {
            existingAbout = JSON.parse(fs.readFileSync(localPath, 'utf-8').replace(/^\uFEFF/, ''));
          }
        }
      } catch {
        existingAbout = undefined;
      }

      const v = validateAboutContent(incomingData, existingAbout);
      if (!v.valid) {
        return res.status(400).json({ error: `Dữ liệu trang Về chúng tôi không hợp lệ: ${v.errors.join('; ')}` });
      }
      validatedData = v.data;
      commitMessage = 'cms(about): update about page content & gallery';
    } else {
      const v = validateCompanySettings(incomingData);
      if (!v.valid) {
        return res.status(400).json({ error: `Dữ liệu cấu hình Doanh nghiệp không hợp lệ: ${v.errors.join('; ')}` });
      }
      validatedData = v.data;
    }

    const contentStr = JSON.stringify(validatedData, null, 2);

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
      message: 'Đã lưu cấu hình an toàn thành công!',
      data: validatedData,
      result
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
});
