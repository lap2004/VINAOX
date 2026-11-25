// Server-side GitHub API Integration with Strict Allowlist & Security Controls
const ALLOWED_DIRECTORIES = [
  'content/news/',
  'content/products/',
  'content/settings/',
  'content/certificates/',
  'public/uploads/'
];

const DISALLOWED_FILES = [
  '.env',
  '.gitignore',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vercel.json',
  'vite.config.ts'
];

export interface GitHubFileResult {
  content: string;
  sha: string;
}

export interface GitHubDirEntry {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: 'file' | 'dir';
}

export interface RepoPublicMeta {
  owner: string;
  repo: string;
  branch: string;
  vercelEnv: string;
  configuredBranchEnv: string;
}

/**
 * Validates that a file path is safe and strictly inside allowed directories.
 * Prevents directory traversal (..), absolute paths, and modifications to root/config files.
 */
export function validatePath(filePath: string): boolean {
  if (!filePath || typeof filePath !== 'string') return false;

  const normalized = filePath.replace(/\\/g, '/').replace(/^\/+/, '');

  if (normalized.includes('..') || normalized.includes('./') || normalized.startsWith('/')) {
    return false;
  }

  if (DISALLOWED_FILES.some(f => normalized === f || normalized.endsWith('/' + f))) {
    return false;
  }

  if (normalized.startsWith('.github/') || normalized.startsWith('api/') || normalized.startsWith('src/')) {
    return false;
  }

  return ALLOWED_DIRECTORIES.some(prefix => normalized === prefix.slice(0, -1) || normalized.startsWith(prefix));
}

function getRepoConfig() {
  const rawRepo = (process.env.GITHUB_REPO || 'VINAOX').trim();
  const rawOwner = (process.env.GITHUB_OWNER || 'lap2004').trim();

  let owner = rawOwner;
  let repo = rawRepo;
  if (rawRepo.includes('/')) {
    const [parsedOwner, parsedRepo] = rawRepo.split('/').map(s => s.trim());
    if (parsedOwner && parsedRepo) {
      owner = parsedOwner;
      repo = parsedRepo;
    }
  }

  const vercelEnv = (process.env.VERCEL_ENV || 'development').trim();
  const gitRef = (process.env.VERCEL_GIT_COMMIT_REF || '').trim();
  const configuredBranchEnv = (process.env.GITHUB_BRANCH || '').trim();

  // In Preview deployments, target the active preview branch (`gitRef`) so tests never pollute `main`.
  // In Production deployments, use configured `GITHUB_BRANCH` (expected to be `main`) or fallback to `main`.
  let branch = configuredBranchEnv || gitRef || 'main';
  if (vercelEnv === 'preview' && gitRef) {
    branch = gitRef;
  }

  const token = (process.env.GITHUB_TOKEN || process.env.GITHUB_APP_TOKEN || '').trim();

  return {
    owner,
    repo,
    branch,
    token,
    vercelEnv,
    configuredBranchEnv
  };
}

export function getPublicRepoMeta(): RepoPublicMeta {
  const { owner, repo, branch, vercelEnv, configuredBranchEnv } = getRepoConfig();
  return { owner, repo, branch, vercelEnv, configuredBranchEnv };
}

export function hasGitHubToken(): boolean {
  return Boolean(getRepoConfig().token);
}

function mapGitHubError(status: number, action: string): string {
  if (status === 401) {
    return `Xác thực GitHub thất bại khi ${action}. Vui lòng kiểm tra lại GITHUB_TOKEN trên Vercel.`;
  }
  if (status === 403) {
    return `Token GitHub thiếu quyền Contents (Read & Write) hoặc vượt giới hạn khi ${action}.`;
  }
  if (status === 404) {
    return `Không tìm thấy tài nguyên hoặc nhánh Git khi ${action}. Vui lòng kiểm tra GITHUB_REPO và GITHUB_BRANCH.`;
  }
  if (status === 409) {
    return `Xung đột phiên bản dữ liệu trên Git khi ${action}. Vui lòng tải lại trang và thử lại.`;
  }
  if (status === 422) {
    return `Dữ liệu gửi lên GitHub không hợp lệ khi ${action} (HTTP 422).`;
  }
  return `Lỗi kết nối GitHub API (HTTP ${status}) khi ${action}.`;
}

/**
 * Fetches a text/JSON file from GitHub repository.
 */
export async function getRepoFile(filePath: string): Promise<GitHubFileResult | null> {
  if (!validatePath(filePath)) {
    throw new Error(`Đường dẫn không hợp lệ hoặc nằm ngoài danh mục được phép: ${filePath}`);
  }

  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) {
    throw new Error('GITHUB_TOKEN chưa được cấu hình trong Vercel Environment Variables.');
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'VINAXO-CMS-Serverless'
    }
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(mapGitHubError(response.status, 'đọc tệp tin'));
  }

  const data: any = await response.json();
  const content = Buffer.from(data.content || '', 'base64').toString('utf-8').replace(/^\uFEFF/, '');
  return { content, sha: data.sha };
}

/**
 * Fetches raw binary content of a file (e.g. recently uploaded image prior to Vercel CDN rebuild).
 */
export async function getRepoBinaryFile(filePath: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  if (!validatePath(filePath)) {
    throw new Error(`Đường dẫn không hợp lệ: ${filePath}`);
  }

  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) return null;

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.raw+json',
      'User-Agent': 'VINAXO-CMS-Serverless'
    }
  });

  if (response.status === 404) return null;
  if (!response.ok) return null;

  const arrayBuf = await response.arrayBuffer();
  const ext = filePath.toLowerCase();
  let contentType = 'application/octet-stream';
  if (ext.endsWith('.webp')) contentType = 'image/webp';
  else if (ext.endsWith('.png')) contentType = 'image/png';
  else if (ext.endsWith('.jpg') || ext.endsWith('.jpeg')) contentType = 'image/jpeg';

  return { buffer: Buffer.from(arrayBuf), contentType };
}

/**
 * Lists files inside a directory in GitHub repository.
 */
export async function listRepoDirectory(dirPath: string): Promise<GitHubDirEntry[]> {
  if (!validatePath(dirPath)) {
    throw new Error(`Thư mục không hợp lệ: ${dirPath}`);
  }

  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) {
    throw new Error('GITHUB_TOKEN chưa được cấu hình trong Vercel Environment Variables.');
  }

  const cleanDir = dirPath.replace(/\/+$/, '');
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanDir}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'VINAXO-CMS-Serverless'
    }
  });

  if (response.status === 404) return [];
  if (!response.ok) {
    throw new Error(mapGitHubError(response.status, 'liệt kê thư mục'));
  }

  const data = await response.json();
  if (!Array.isArray(data)) return [];

  return data.map((item: any) => ({
    name: item.name,
    path: item.path,
    sha: item.sha,
    size: item.size || 0,
    type: item.type === 'dir' ? 'dir' : 'file'
  }));
}

/**
 * Fetches and parses all `.json` files in a content directory directly from GitHub.
 */
export async function listRepoJsonFiles<T = any>(dirPath: string): Promise<Array<{ data: T; sha: string; name: string }>> {
  const entries = await listRepoDirectory(dirPath);
  const jsonFiles = entries.filter(e => e.type === 'file' && e.name.endsWith('.json'));

  const results = await Promise.all(
    jsonFiles.map(async (entry) => {
      const file = await getRepoFile(entry.path);
      if (!file) return null;
      try {
        return {
          data: JSON.parse(file.content) as T,
          sha: file.sha,
          name: entry.name
        };
      } catch {
        return null;
      }
    })
  );

  return results.filter((r): r is { data: T; sha: string; name: string } => r !== null);
}

/**
 * Creates or updates a text/JSON file in the GitHub repository.
 */
export async function commitFile(
  filePath: string,
  contentStr: string,
  commitMessage: string,
  sha?: string
): Promise<{ sha: string; commitSha: string; branch: string }> {
  if (!validatePath(filePath)) {
    throw new Error(`Đường dẫn không hợp lệ hoặc nằm ngoài danh mục được phép: ${filePath}`);
  }

  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) {
    throw new Error('GITHUB_TOKEN chưa được cấu hình trong Vercel Environment Variables.');
  }

  const base64Content = Buffer.from(contentStr, 'utf-8').toString('base64');
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  let fileSha = sha;
  if (!fileSha) {
    const existing = await getRepoFile(filePath);
    if (existing) {
      fileSha = existing.sha;
    }
  }

  const body: any = {
    message: commitMessage,
    content: base64Content,
    branch: branch
  };
  if (fileSha) {
    body.sha = fileSha;
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'VINAXO-CMS-Serverless'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(mapGitHubError(response.status, 'lưu dữ liệu'));
  }

  const data: any = await response.json();
  return {
    sha: data.content?.sha,
    commitSha: data.commit?.sha,
    branch
  };
}

/**
 * Deletes a file in the GitHub repository.
 */
export async function deleteRepoFile(filePath: string, commitMessage: string, sha?: string): Promise<boolean> {
  if (!validatePath(filePath)) {
    throw new Error(`Đường dẫn không hợp lệ hoặc nằm ngoài danh mục được phép: ${filePath}`);
  }

  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) {
    throw new Error('GITHUB_TOKEN chưa được cấu hình trong Vercel Environment Variables.');
  }

  let fileSha = sha;
  if (!fileSha) {
    const existing = await getRepoFile(filePath);
    if (!existing) {
      throw new Error('Không tìm thấy bài viết trên kho lưu trữ để xóa.');
    }
    fileSha = existing.sha;
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'VINAXO-CMS-Serverless'
    },
    body: JSON.stringify({
      message: commitMessage,
      sha: fileSha,
      branch: branch
    })
  });

  if (!response.ok) {
    throw new Error(mapGitHubError(response.status, 'xóa tệp tin'));
  }

  return true;
}

/**
 * Commits a binary image file (Base64) to public/uploads/
 */
export async function commitMediaFile(
  filePath: string,
  base64Data: string,
  commitMessage: string
): Promise<{ path: string; publicUrl: string; commitSha: string; branch: string }> {
  if (!validatePath(filePath)) {
    throw new Error(`Đường dẫn tải ảnh không hợp lệ: ${filePath}`);
  }

  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) {
    throw new Error('GITHUB_TOKEN chưa được cấu hình trong Vercel Environment Variables.');
  }

  const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'VINAXO-CMS-Serverless'
    },
    body: JSON.stringify({
      message: commitMessage,
      content: cleanBase64,
      branch: branch
    })
  });

  if (!response.ok) {
    throw new Error(mapGitHubError(response.status, 'tải hình ảnh'));
  }

  const data: any = await response.json();
  const publicUrl = '/' + filePath.replace(/^public\//, '');
  return {
    path: filePath,
    publicUrl,
    commitSha: data.commit?.sha,
    branch
  };
}
