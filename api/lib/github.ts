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

/**
 * Validates that a file path is safe and strictly inside allowed directories.
 * Prevents directory traversal (..), absolute paths, and modifications to root/config files.
 */
export function validatePath(filePath: string): boolean {
  if (!filePath || typeof filePath !== 'string') return false;

  // Normalize path separators
  const normalized = filePath.replace(/\\/g, '/').replace(/^\/+/, '');

  // Detect directory traversal
  if (normalized.includes('..') || normalized.includes('./') || normalized.startsWith('/')) {
    return false;
  }

  // Detect sensitive config files
  if (DISALLOWED_FILES.some(f => normalized === f || normalized.endsWith('/' + f))) {
    return false;
  }

  // Detect disallowed top-level folders
  if (normalized.startsWith('.github/') || normalized.startsWith('api/') || normalized.startsWith('src/')) {
    return false;
  }

  // Check against strict allowlist
  return ALLOWED_DIRECTORIES.some(prefix => normalized.startsWith(prefix));
}

function getRepoConfig() {
  return {
    owner: process.env.GITHUB_OWNER || 'lap2004',
    repo: process.env.GITHUB_REPO || 'VINAOX',
    branch: process.env.GITHUB_BRANCH || 'main',
    token: process.env.GITHUB_TOKEN || process.env.GITHUB_APP_TOKEN || ''
  };
}

/**
 * Fetches a file from GitHub repository.
 */
export async function getRepoFile(filePath: string): Promise<GitHubFileResult | null> {
  if (!validatePath(filePath)) {
    throw new Error(`Đường dẫn không hợp lệ hoặc nằm ngoài danh mục được phép: ${filePath}`);
  }

  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) {
    throw new Error('GITHUB_TOKEN chưa được cấu hình trong Vercel Environment Variables.');
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'VINAXO-CMS-Serverless'
    }
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lỗi từ GitHub API (${response.status}): ${errorText}`);
  }

  const data: any = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { content, sha: data.sha };
}

/**
 * Creates or updates a file in the GitHub repository.
 */
export async function commitFile(
  filePath: string,
  contentStr: string,
  commitMessage: string,
  sha?: string
): Promise<{ sha: string; commitSha: string }> {
  if (!validatePath(filePath)) {
    throw new Error(`Đường dẫn không hợp lệ hoặc nằm ngoài danh mục được phép: ${filePath}`);
  }

  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) {
    throw new Error('GITHUB_TOKEN chưa được cấu hình trong Vercel Environment Variables.');
  }

  const base64Content = Buffer.from(contentStr, 'utf-8').toString('base64');
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

  // If SHA was not provided, attempt to fetch existing SHA to prevent overwrite conflicts
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
    const errorText = await response.text();
    throw new Error(`Không thể ghi dữ liệu vào GitHub (${response.status}): ${errorText}`);
  }

  const data: any = await response.json();
  return {
    sha: data.content?.sha,
    commitSha: data.commit?.sha
  };
}

/**
 * Deletes a file in the GitHub repository.
 */
export async function deleteRepoFile(filePath: string, commitMessage: string, sha: string): Promise<boolean> {
  if (!validatePath(filePath)) {
    throw new Error(`Đường dẫn không hợp lệ hoặc nằm ngoài danh mục được phép: ${filePath}`);
  }

  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) {
    throw new Error('GITHUB_TOKEN chưa được cấu hình trong Vercel Environment Variables.');
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
      sha: sha,
      branch: branch
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Không thể xóa file trên GitHub (${response.status}): ${errorText}`);
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
): Promise<{ path: string; publicUrl: string }> {
  if (!validatePath(filePath)) {
    throw new Error(`Đường dẫn tải ảnh không hợp lệ: ${filePath}`);
  }

  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) {
    throw new Error('GITHUB_TOKEN chưa được cấu hình trong Vercel Environment Variables.');
  }

  // Strip data URL scheme prefix if present (e.g. data:image/png;base64,)
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
    const errorText = await response.text();
    throw new Error(`Không thể lưu ảnh lên GitHub (${response.status}): ${errorText}`);
  }

  // Convert filePath (e.g. public/uploads/news/image.webp) to public web URL (/uploads/news/image.webp)
  const publicUrl = filePath.replace(/^public\//, '/');
  return { path: filePath, publicUrl };
}
