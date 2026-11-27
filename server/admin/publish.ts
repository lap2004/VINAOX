import { getAuthenticatedUser } from '../lib/auth.js';
import {
  getClientIp,
  readJsonBody,
  stripUnsafeKeys,
  validateCsrfAndOrigin,
  wrapHandler
} from '../lib/security.js';
import { checkApiMutationRateLimit } from '../lib/rateLimit.js';
import { commitFile, getRepoFile, hasGitHubToken, getCommitDeployStatus } from '../lib/github.js';
import fs from 'fs';
import path from 'path';

const ALLOWED_MODULES = ['news', 'products', 'about', 'homepage', 'certificates', 'media', 'brochure', 'company', 'all'] as const;
type PublishModule = typeof ALLOWED_MODULES[number];

const MODULE_LABELS: Record<PublishModule, string> = {
  news: 'Tin tức & Báo chí',
  products: 'Sản phẩm nhiệt đới',
  about: 'Trang Về chúng tôi',
  homepage: 'Trang chủ & Danh mục',
  certificates: 'Chứng nhận & Tiêu chuẩn',
  media: 'Thư viện hình ảnh',
  brochure: 'Hồ sơ năng lực (Brochure)',
  company: 'Thông tin Doanh nghiệp',
  all: 'Toàn bộ website'
};

const HISTORY_PATH = 'content/settings/publish_history.json';

interface PublishHistoryRecord {
  id: string;
  module: PublishModule;
  moduleLabel: string;
  requestedBy: string;
  requestedAt: string;
  commitSha?: string;
  status: 'QUEUED' | 'BUILDING' | 'READY' | 'ERROR';
  message: string;
}

export default wrapHandler(async (req: any, res: any) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập quản trị.' });
  }

  const useGitHub = hasGitHubToken();

  // GET: Retrieve module counts & recent publish history
  if (req.method === 'GET') {
    let history: PublishHistoryRecord[] = [];
    let historySha: string | undefined = undefined;

    try {
      if (useGitHub) {
        const file = await getRepoFile(HISTORY_PATH);
        if (file) {
          history = JSON.parse(file.content);
          historySha = file.sha;
        }
      } else {
        const localHistoryFile = path.join(process.cwd(), HISTORY_PATH);
        if (fs.existsSync(localHistoryFile)) {
          history = JSON.parse(fs.readFileSync(localHistoryFile, 'utf-8').replace(/^\uFEFF/, ''));
        }
      }
    } catch {
      history = [];
    }

    // Compute stats
    let newsCount = 0;
    let newsDrafts = 0;
    let productsCount = 0;
    let certsCount = 0;
    let mediaCount = 0;
    let aboutGalleryTotal = 0;
    let aboutGalleryVisible = 0;

    try {
      const aboutFile = path.join(process.cwd(), 'content/settings/about.json');
      if (fs.existsSync(aboutFile)) {
        const rawAbout = JSON.parse(fs.readFileSync(aboutFile, 'utf-8').replace(/^\uFEFF/, ''));
        if (Array.isArray(rawAbout?.gallery)) {
          aboutGalleryTotal = rawAbout.gallery.length;
          aboutGalleryVisible = rawAbout.gallery.filter((g: any) => g && g.visible !== false).length;
        }
      }
    } catch {}

    try {
      const newsDir = path.join(process.cwd(), 'content/news');
      if (fs.existsSync(newsDir)) {
        const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.json'));
        newsCount = files.length;
        for (const f of files) {
          try {
            const raw = JSON.parse(fs.readFileSync(path.join(newsDir, f), 'utf-8').replace(/^\uFEFF/, ''));
            if (raw.published === false || raw.status === 'draft') newsDrafts++;
          } catch {}
        }
      }
    } catch {}

    try {
      const prodDir = path.join(process.cwd(), 'content/products');
      if (fs.existsSync(prodDir)) {
        productsCount = fs.readdirSync(prodDir).filter(f => f.endsWith('.json')).length;
      }
    } catch {}

    try {
      const certFile = path.join(process.cwd(), 'content/settings/certificates.json');
      if (fs.existsSync(certFile)) {
        const raw = JSON.parse(fs.readFileSync(certFile, 'utf-8').replace(/^\uFEFF/, ''));
        certsCount = Array.isArray(raw) ? raw.length : 0;
      }
    } catch {}

    try {
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      if (fs.existsSync(uploadDir)) {
        const walk = (d: string) => {
          for (const item of fs.readdirSync(d, { withFileTypes: true })) {
            const sub = path.join(d, item.name);
            if (item.isDirectory()) walk(sub);
            else if (!item.name.startsWith('.')) mediaCount++;
          }
        };
        walk(uploadDir);
      }
    } catch {}

    // Check latest deployment if history has commitSha
    let latestDeployStatus: any = null;
    const latestCommit = history.find(h => h.commitSha && h.commitSha.length >= 7);
    if (latestCommit?.commitSha && useGitHub) {
      try {
        latestDeployStatus = await getCommitDeployStatus(latestCommit.commitSha);
      } catch {}
    }

    return res.status(200).json({
      ok: true,
      stats: {
        news: { total: newsCount, published: newsCount - newsDrafts, drafts: newsDrafts },
        products: { total: productsCount },
        aboutGallery: { total: aboutGalleryTotal, visible: aboutGalleryVisible },
        certificates: { total: certsCount },
        media: { total: mediaCount }
      },
      history: history.slice(0, 15),
      historySha,
      latestDeployStatus
    });
  }

  // POST: Trigger module-based publishing
  if (req.method === 'POST') {
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
      return res.status(429).json({ error: 'Thao tác xuất bản quá nhanh. Vui lòng thử lại sau.' });
    }

    const body = await readJsonBody(req);
    const incomingData = stripUnsafeKeys(body);
    const targetModule: PublishModule = ALLOWED_MODULES.includes(incomingData.module) ? incomingData.module : 'all';
    const label = MODULE_LABELS[targetModule];

    // Read current history
    let history: PublishHistoryRecord[] = [];
    let currentSha: string | undefined = undefined;

    if (useGitHub) {
      const file = await getRepoFile(HISTORY_PATH);
      if (file) {
        try {
          history = JSON.parse(file.content);
        } catch {}
        currentSha = file.sha;
      }
    } else {
      const localHistoryFile = path.join(process.cwd(), HISTORY_PATH);
      if (fs.existsSync(localHistoryFile)) {
        try {
          history = JSON.parse(fs.readFileSync(localHistoryFile, 'utf-8').replace(/^\uFEFF/, ''));
        } catch {}
      }
    }

    // Prepend new record
    const newRecord: PublishHistoryRecord = {
      id: `pub-${Date.now()}`,
      module: targetModule,
      moduleLabel: label,
      requestedBy: user.username,
      requestedAt: new Date().toISOString(),
      status: 'QUEUED',
      message: `Cập nhật nhóm [${label}] lên website vinaxo.net`
    };

    const updatedHistory = [newRecord, ...history].slice(0, 50);
    const contentStr = JSON.stringify(updatedHistory, null, 2);
    const commitMessage = `cms(publish): update ${targetModule.toUpperCase()} on website`;

    let commitResult: any = null;
    if (useGitHub) {
      commitResult = await commitFile(HISTORY_PATH, contentStr, commitMessage, currentSha);
      newRecord.commitSha = commitResult.commitSha || commitResult.sha;
    } else {
      const localPath = path.join(process.cwd(), HISTORY_PATH);
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      fs.writeFileSync(localPath, contentStr, 'utf-8');
      commitResult = { sha: 'local-test-sha', commitSha: 'local-commit-sha' };
      newRecord.commitSha = 'local-commit-sha';
    }

    return res.status(200).json({
      ok: true,
      module: targetModule,
      moduleLabel: label,
      commitSha: newRecord.commitSha,
      requestedAt: newRecord.requestedAt,
      message: `Đã kích hoạt quy trình cập nhật [${label}] lên website! Vercel đang tự động xây dựng và triển khai.`
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
});
