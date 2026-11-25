import { getAuthenticatedUser } from '../lib/auth.js';
import {
  getClientIp,
  readJsonBody,
  sanitizeCommitText,
  sanitizeSlug,
  stripUnsafeKeys,
  validateCsrfAndOrigin,
  wrapHandler
} from '../lib/security.js';
import { checkApiMutationRateLimit } from '../lib/rateLimit.js';
import {
  commitFile,
  getRepoFile,
  hasGitHubToken
} from '../lib/github.js';
import fs from 'fs';
import path from 'path';

export interface CertificateItem {
  id: string;
  code: string;
  pillLabel: string;
  name: string;
  nameVi: string;
  nameEn: string;
  kindEn: 'Certification' | 'Registration' | 'Audit';
  kindVi: 'Chứng nhận' | 'Đăng ký' | 'Kiểm toán';
  scopeEn: string;
  scopeVi: string;
  certImageWebp: string;
  certImageJpg?: string;
  order: number;
  published: boolean;
}

const CERTIFICATES_FILE = 'content/settings/certificates.json';

async function loadCertificates(useGitHub: boolean): Promise<{ list: CertificateItem[]; sha?: string }> {
  if (useGitHub) {
    const file = await getRepoFile(CERTIFICATES_FILE);
    if (file) {
      try {
        const list = JSON.parse(file.content);
        return { list: Array.isArray(list) ? list : [], sha: file.sha };
      } catch {
        return { list: [], sha: file.sha };
      }
    }
  }

  const localPath = path.join(process.cwd(), CERTIFICATES_FILE);
  if (fs.existsSync(localPath)) {
    try {
      const list = JSON.parse(fs.readFileSync(localPath, 'utf-8').replace(/^\uFEFF/, ''));
      return { list: Array.isArray(list) ? list : [], sha: 'local-sha' };
    } catch {
      return { list: [] };
    }
  }

  return { list: [] };
}

async function saveCertificates(
  list: CertificateItem[],
  commitMsg: string,
  useGitHub: boolean,
  sha?: string
): Promise<{ sha: string; commitSha: string }> {
  const contentStr = JSON.stringify(list, null, 2);
  if (useGitHub) {
    return await commitFile(CERTIFICATES_FILE, contentStr, commitMsg, sha);
  }

  const localPath = path.join(process.cwd(), CERTIFICATES_FILE);
  fs.mkdirSync(path.dirname(localPath), { recursive: true });
  fs.writeFileSync(localPath, contentStr, 'utf-8');
  return { sha: 'local-sha', commitSha: 'local-commit' };
}

export default wrapHandler(async (req: any, res: any) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị.' });
  }

  const useGitHub = hasGitHubToken();

  // GET: Fetch all certificates
  if (req.method === 'GET') {
    try {
      const { list, sha } = await loadCertificates(useGitHub);
      const sorted = list.sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
      return res.status(200).json({ ok: true, certificates: sorted, sha });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lỗi khi tải danh sách chứng nhận.' });
    }
  }

  // Enforce CSRF + mutation rate limit on mutations
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

  // POST: Add or update a certificate
  if (req.method === 'POST') {
    const rawBody = await readJsonBody(req);
    const certInput = stripUnsafeKeys(rawBody);

    const id = sanitizeSlug(certInput.id || certInput.code);
    if (!id) {
      return res.status(400).json({ error: 'Mã chứng nhận (id) không hợp lệ.' });
    }

    const { list, sha } = await loadCertificates(useGitHub);
    const existingIndex = list.findIndex(c => c.id === id);

    const item: CertificateItem = {
      id,
      code: typeof certInput.code === 'string' ? certInput.code.toUpperCase() : id.toUpperCase(),
      pillLabel: certInput.pillLabel || certInput.code || id.toUpperCase(),
      name: certInput.name || certInput.nameEn || id,
      nameVi: certInput.nameVi || certInput.name || id,
      nameEn: certInput.nameEn || certInput.name || id,
      kindEn: ['Certification', 'Registration', 'Audit'].includes(certInput.kindEn) ? certInput.kindEn : 'Certification',
      kindVi: certInput.kindEn === 'Registration' ? 'Đăng ký' : certInput.kindEn === 'Audit' ? 'Kiểm toán' : 'Chứng nhận',
      scopeEn: certInput.scopeEn || '',
      scopeVi: certInput.scopeVi || '',
      certImageWebp: certInput.certImageWebp || certInput.image || '/assets/images/certs-2026/cert-brcgs.webp',
      certImageJpg: certInput.certImageJpg || certInput.certImageWebp || certInput.image,
      order: Number(certInput.order) || (existingIndex >= 0 ? list[existingIndex].order : list.length + 1),
      published: certInput.published !== undefined ? Boolean(certInput.published) : true
    };

    let updatedList: CertificateItem[];
    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = { ...list[existingIndex], ...item };
    } else {
      updatedList = [...list, item];
    }

    const commitMsg = `cms(certificates): ${existingIndex >= 0 ? 'update' : 'add'} "${sanitizeCommitText(item.nameVi, 60)}"`;
    const result = await saveCertificates(updatedList, commitMsg, useGitHub, sha);

    return res.status(200).json({
      ok: true,
      message: 'Lưu chứng nhận thành công!',
      certificate: item,
      result
    });
  }

  // DELETE: Remove a certificate
  if (req.method === 'DELETE') {
    const rawBody = await readJsonBody(req);
    const id = sanitizeSlug(rawBody.id ?? req.query?.id);
    if (!id) {
      return res.status(400).json({ error: 'Mã chứng nhận cần xóa không hợp lệ.' });
    }

    const { list, sha } = await loadCertificates(useGitHub);
    const updatedList = list.filter(c => c.id !== id);

    if (updatedList.length === list.length) {
      return res.status(404).json({ error: 'Không tìm thấy chứng nhận để xóa.' });
    }

    const commitMsg = `cms(certificates): delete "${id}"`;
    const result = await saveCertificates(updatedList, commitMsg, useGitHub, sha);

    return res.status(200).json({
      ok: true,
      message: `Đã xóa chứng nhận ${id} thành công.`,
      result
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
});
