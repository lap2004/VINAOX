import { getAuthenticatedUser } from '../lib/auth.js';
import { wrapHandler } from '../lib/security.js';
import { getCommitDeployStatus } from '../lib/github.js';

export default wrapHandler(async (req: any, res: any) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị.' });
  }

  const commitSha = typeof req.query?.commitSha === 'string' ? req.query.commitSha.trim() : '';
  if (!commitSha) {
    return res.status(400).json({ error: 'Thiếu mã commitSha để kiểm tra trạng thái triển khai.' });
  }

  const status = await getCommitDeployStatus(commitSha);
  return res.status(200).json({ ok: true, status });
});
