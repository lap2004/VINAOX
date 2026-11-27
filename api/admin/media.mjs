// Auto-generated standalone ESM bundle from server/admin/*.ts via scripts/build-api.mjs

// server/lib/auth.ts
import crypto from "crypto";
var SESSION_COOKIE_NAME = "vinaxo_admin_session";
var DEV_FALLBACK_SECRET = "vinaxo-local-dev-only-session-secret-not-for-production-use-32bytes";
function isProductionRuntime() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}
function getSessionSecret() {
  const configured = (process.env.SESSION_SECRET || "").trim();
  if (configured.length >= 32) {
    return configured;
  }
  if (isProductionRuntime()) {
    throw new Error("SESSION_SECRET ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh h\u1EE3p l\u1EC7 (y\xEAu c\u1EA7u t\u1ED1i thi\u1EC3u 32 k\xFD t\u1EF1 tr\xEAn m\xF4i tr\u01B0\u1EDDng Production/Preview).");
  }
  return DEV_FALLBACK_SECRET;
}
function verifySessionToken(token) {
  if (!token || typeof token !== "string" || token.length > 512) {
    return { valid: false };
  }
  const parts = token.split(".");
  if (parts.length !== 4) return { valid: false };
  const [rawUser, issuedAtStr, expiresAtStr, signature] = parts;
  if (!rawUser || !/^[0-9]+$/.test(issuedAtStr) || !/^[0-9]+$/.test(expiresAtStr) || !/^[0-9a-f]{64}$/i.test(signature)) {
    return { valid: false };
  }
  const issuedAt = parseInt(issuedAtStr, 10);
  const expiresAt = parseInt(expiresAtStr, 10);
  const now = Math.floor(Date.now() / 1e3);
  if (isNaN(issuedAt) || isNaN(expiresAt) || now > expiresAt || issuedAt > now + 60) {
    return { valid: false };
  }
  let secret = "";
  try {
    secret = getSessionSecret();
  } catch {
    return { valid: false };
  }
  const payload = `${rawUser}.${issuedAtStr}.${expiresAtStr}`;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest("hex");
  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
    if (!isMatch) return { valid: false };
    return { valid: true, username: decodeURIComponent(rawUser) };
  } catch {
    return { valid: false };
  }
}
function createCsrfToken(sessionToken) {
  const secret = getSessionSecret();
  return crypto.createHmac("sha256", secret).update(`vinaxo-csrf:${sessionToken}`).digest("hex");
}
function verifyCsrfToken(sessionToken, providedCsrfToken) {
  if (!sessionToken || !providedCsrfToken || !/^[0-9a-f]{64}$/i.test(providedCsrfToken)) {
    return false;
  }
  try {
    const expected = createCsrfToken(sessionToken);
    return crypto.timingSafeEqual(
      Buffer.from(providedCsrfToken.toLowerCase(), "hex"),
      Buffer.from(expected.toLowerCase(), "hex")
    );
  } catch {
    return false;
  }
}
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader || typeof cookieHeader !== "string") return cookies;
  cookieHeader.split(";").forEach((cookie) => {
    const eqIndex = cookie.indexOf("=");
    if (eqIndex > 0) {
      const name = cookie.slice(0, eqIndex).trim();
      const val = cookie.slice(eqIndex + 1).trim();
      if (name) {
        try {
          cookies[name] = decodeURIComponent(val);
        } catch {
          cookies[name] = val;
        }
      }
    }
  });
  return cookies;
}
function getAuthenticatedUser(req) {
  const cookieHeader = req?.headers?.cookie;
  const cookies = parseCookies(cookieHeader);
  const sessionToken = cookies[SESSION_COOKIE_NAME];
  const { valid, username } = verifySessionToken(sessionToken);
  if (valid && username && sessionToken) {
    return { username, sessionToken };
  }
  return null;
}

// server/lib/security.ts
var HttpRequestError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
};
function sendJson(res, statusCode, payload) {
  if (typeof res?.status === "function" && typeof res?.json === "function") {
    return res.status(statusCode).json(payload);
  }
  res.statusCode = statusCode;
  if (typeof res?.setHeader === "function") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
  }
  if (typeof res?.end === "function") {
    res.end(JSON.stringify(payload));
  }
  return res;
}
function wrapHandler(handlerFn) {
  return async (req, res) => {
    try {
      applySecurityHeaders(res);
      return await handlerFn(req, res);
    } catch (err) {
      const status = typeof err?.statusCode === "number" ? err.statusCode : 500;
      const msg = err?.message || "L\u1ED7i h\u1EC7 th\u1ED1ng n\u1ED9i b\u1ED9 t\u1EA1i m\xE1y ch\u1EE7 qu\u1EA3n tr\u1ECB.";
      console.error("[VINAXO Admin API Error]", err);
      return sendJson(res, status, { error: msg });
    }
  };
}
function parseJsonObject(rawText) {
  const trimmed = rawText.trim();
  if (!trimmed) return {};
  try {
    const parsed = JSON.parse(trimmed);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    throw new HttpRequestError(400, "D\u1EEF li\u1EC7u JSON g\u1EEDi l\xEAn kh\xF4ng h\u1EE3p l\u1EC7.");
  }
}
async function readJsonBody(req, maxBytes = 45e5) {
  const existing = req?.body;
  if (existing !== void 0 && existing !== null) {
    if (typeof existing === "string") return parseJsonObject(existing);
    if (Buffer.isBuffer(existing)) return parseJsonObject(existing.toString("utf8"));
    if (typeof existing === "object") return existing;
  }
  if (!req || typeof req[Symbol.asyncIterator] !== "function") {
    return {};
  }
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
    total += buf.length;
    if (total > maxBytes) {
      throw new HttpRequestError(413, "D\u1EEF li\u1EC7u g\u1EEDi l\xEAn v\u01B0\u1EE3t qu\xE1 gi\u1EDBi h\u1EA1n cho ph\xE9p.");
    }
    chunks.push(buf);
  }
  return chunks.length === 0 ? {} : parseJsonObject(Buffer.concat(chunks).toString("utf8"));
}
function applySecurityHeaders(res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
}
function getClientIp(req) {
  const forwarded = req?.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req?.headers?.["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }
  return req?.socket?.remoteAddress || "unknown";
}
function normalizeHost(hostHeader) {
  if (!hostHeader || typeof hostHeader !== "string") return "";
  return hostHeader.split(",")[0].trim().toLowerCase();
}
function validateCsrfAndOrigin(req, options = {}) {
  const method = (req?.method || "GET").toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return { ok: true, status: 200 };
  }
  const secFetchSite = (req?.headers?.["sec-fetch-site"] || "").toLowerCase();
  if (secFetchSite === "cross-site") {
    return { ok: false, status: 403, error: "Y\xEAu c\u1EA7u cross-site b\u1ECB t\u1EEB ch\u1ED1i v\xEC l\xFD do b\u1EA3o m\u1EADt (CSRF)." };
  }
  const contentType = (req?.headers?.["content-type"] || "").toLowerCase();
  if (!contentType.includes("application/json")) {
    return { ok: false, status: 415, error: "Content-Type ph\u1EA3i l\xE0 application/json." };
  }
  const requestedWith = (req?.headers?.["x-requested-with"] || "").trim();
  if (requestedWith !== "XMLHttpRequest") {
    return { ok: false, status: 403, error: "Thi\u1EBFu header b\u1EA3o m\u1EADt x\xE1c th\u1EF1c ngu\u1ED3n g\u1ED1c y\xEAu c\u1EA7u." };
  }
  const expectedHost = normalizeHost(req?.headers?.["x-forwarded-host"] || req?.headers?.host);
  const originHeader = req?.headers?.origin;
  const refererHeader = req?.headers?.referer;
  if (expectedHost) {
    if (originHeader && typeof originHeader === "string") {
      try {
        const parsedOrigin = new URL(originHeader);
        if (parsedOrigin.host.toLowerCase() !== expectedHost) {
          return { ok: false, status: 403, error: "Origin kh\xF4ng h\u1EE3p l\u1EC7 (CSRF protection)." };
        }
      } catch {
        return { ok: false, status: 403, error: "Header Origin kh\xF4ng h\u1EE3p l\u1EC7." };
      }
    } else if (refererHeader && typeof refererHeader === "string") {
      try {
        const parsedReferer = new URL(refererHeader);
        if (parsedReferer.host.toLowerCase() !== expectedHost) {
          return { ok: false, status: 403, error: "Referer kh\xF4ng h\u1EE3p l\u1EC7 (CSRF protection)." };
        }
      } catch {
        return { ok: false, status: 403, error: "Header Referer kh\xF4ng h\u1EE3p l\u1EC7." };
      }
    }
  }
  if (options.requireCsrfToken) {
    const providedCsrf = req?.headers?.["x-csrf-token"];
    if (!options.sessionToken || !verifyCsrfToken(options.sessionToken, providedCsrf)) {
      return { ok: false, status: 403, error: "Phi\xEAn CSRF token kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c \u0111\xE3 h\u1EBFt h\u1EA1n. Vui l\xF2ng t\u1EA3i l\u1EA1i trang." };
    }
  }
  return { ok: true, status: 200 };
}
function sanitizeCommitText(text, maxLen = 100) {
  if (typeof text !== "string") return "";
  return text.replace(/[\r\n\t\x00-\x1f\x7f]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLen);
}

// server/lib/rateLimit.ts
var LOGIN_WINDOW_MS = 15 * 60 * 1e3;
var API_MAX_MUTATIONS_PER_MIN = 45;
var API_WINDOW_MS = 60 * 1e3;
var memoryStore = /* @__PURE__ */ new Map();
function pruneMemoryStore(now) {
  if (memoryStore.size > 500) {
    for (const [key, entry] of memoryStore.entries()) {
      if (now > entry.resetAt) {
        memoryStore.delete(key);
      }
    }
  }
}
function checkApiMutationRateLimit(clientKey) {
  const now = Date.now();
  pruneMemoryStore(now);
  const memKey = `mut:${clientKey}`;
  const entry = memoryStore.get(memKey);
  if (!entry || now >= entry.resetAt) {
    memoryStore.set(memKey, { count: 1, resetAt: now + API_WINDOW_MS });
    return {
      allowed: true,
      remaining: API_MAX_MUTATIONS_PER_MIN - 1,
      retryAfterSeconds: 0,
      limit: API_MAX_MUTATIONS_PER_MIN
    };
  }
  entry.count += 1;
  memoryStore.set(memKey, entry);
  if (entry.count > API_MAX_MUTATIONS_PER_MIN) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1e3)),
      limit: API_MAX_MUTATIONS_PER_MIN
    };
  }
  return {
    allowed: true,
    remaining: API_MAX_MUTATIONS_PER_MIN - entry.count,
    retryAfterSeconds: 0,
    limit: API_MAX_MUTATIONS_PER_MIN
  };
}

// server/lib/github.ts
var ALLOWED_DIRECTORIES = [
  "content/news/",
  "content/products/",
  "content/settings/",
  "content/certificates/",
  "public/uploads/"
];
var DISALLOWED_FILES = [
  ".env",
  ".gitignore",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "vercel.json",
  "vite.config.ts"
];
function validatePath(filePath) {
  if (!filePath || typeof filePath !== "string") return false;
  const normalized = filePath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (normalized.includes("..") || normalized.includes("./") || normalized.startsWith("/")) {
    return false;
  }
  if (DISALLOWED_FILES.some((f) => normalized === f || normalized.endsWith("/" + f))) {
    return false;
  }
  if (normalized.startsWith(".github/") || normalized.startsWith("api/") || normalized.startsWith("src/")) {
    return false;
  }
  return ALLOWED_DIRECTORIES.some((prefix) => normalized === prefix.slice(0, -1) || normalized.startsWith(prefix));
}
function getRepoConfig() {
  const rawRepo = (process.env.GITHUB_REPO || "VINAOX").trim();
  const rawOwner = (process.env.GITHUB_OWNER || "lap2004").trim();
  let owner = rawOwner;
  let repo = rawRepo;
  if (rawRepo.includes("/")) {
    const [parsedOwner, parsedRepo] = rawRepo.split("/").map((s) => s.trim());
    if (parsedOwner && parsedRepo) {
      owner = parsedOwner;
      repo = parsedRepo;
    }
  }
  const vercelEnv = (process.env.VERCEL_ENV || "development").trim();
  const gitRef = (process.env.VERCEL_GIT_COMMIT_REF || "").trim();
  const configuredBranchEnv = (process.env.GITHUB_BRANCH || "").trim();
  let branch = "main";
  if (vercelEnv === "production") {
    branch = "main";
  } else if (vercelEnv === "preview") {
    branch = gitRef || configuredBranchEnv || "main";
  } else {
    branch = configuredBranchEnv || gitRef || "main";
  }
  const token = (process.env.GITHUB_TOKEN || process.env.GITHUB_APP_TOKEN || "").trim();
  return {
    owner,
    repo,
    branch,
    token,
    vercelEnv,
    configuredBranchEnv
  };
}
function hasGitHubToken() {
  return Boolean(getRepoConfig().token);
}
function mapGitHubError(status, action) {
  if (status === 401) {
    return `X\xE1c th\u1EF1c GitHub th\u1EA5t b\u1EA1i khi ${action}. Vui l\xF2ng ki\u1EC3m tra l\u1EA1i GITHUB_TOKEN tr\xEAn Vercel.`;
  }
  if (status === 403) {
    return `Token GitHub thi\u1EBFu quy\u1EC1n Contents (Read & Write) ho\u1EB7c v\u01B0\u1EE3t gi\u1EDBi h\u1EA1n khi ${action}.`;
  }
  if (status === 404) {
    return `Kh\xF4ng t\xECm th\u1EA5y t\xE0i nguy\xEAn ho\u1EB7c nh\xE1nh Git khi ${action}. Vui l\xF2ng ki\u1EC3m tra GITHUB_REPO v\xE0 GITHUB_BRANCH.`;
  }
  if (status === 409) {
    return `Xung \u0111\u1ED9t phi\xEAn b\u1EA3n d\u1EEF li\u1EC7u tr\xEAn Git khi ${action}. Vui l\xF2ng t\u1EA3i l\u1EA1i trang v\xE0 th\u1EED l\u1EA1i.`;
  }
  if (status === 422) {
    return `D\u1EEF li\u1EC7u g\u1EEDi l\xEAn GitHub kh\xF4ng h\u1EE3p l\u1EC7 khi ${action} (HTTP 422).`;
  }
  return `L\u1ED7i k\u1EBFt n\u1ED1i GitHub API (HTTP ${status}) khi ${action}.`;
}
async function getRepoFile(filePath) {
  if (!validatePath(filePath)) {
    throw new Error(`\u0110\u01B0\u1EDDng d\u1EABn kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c n\u1EB1m ngo\xE0i danh m\u1EE5c \u0111\u01B0\u1EE3c ph\xE9p: ${filePath}`);
  }
  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) {
    throw new Error("GITHUB_TOKEN ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh trong Vercel Environment Variables.");
  }
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "VINAXO-CMS-Serverless"
    }
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(mapGitHubError(response.status, "\u0111\u1ECDc t\u1EC7p tin"));
  }
  const data = await response.json();
  const content = Buffer.from(data.content || "", "base64").toString("utf-8").replace(/^\uFEFF/, "");
  return { content, sha: data.sha };
}
async function getRepoBinaryFile(filePath) {
  if (!validatePath(filePath)) {
    throw new Error(`\u0110\u01B0\u1EDDng d\u1EABn kh\xF4ng h\u1EE3p l\u1EC7: ${filePath}`);
  }
  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) return null;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github.raw+json",
      "User-Agent": "VINAXO-CMS-Serverless"
    }
  });
  if (response.status === 404) return null;
  if (!response.ok) return null;
  const arrayBuf = await response.arrayBuffer();
  const ext = filePath.toLowerCase();
  let contentType = "application/octet-stream";
  if (ext.endsWith(".webp")) contentType = "image/webp";
  else if (ext.endsWith(".png")) contentType = "image/png";
  else if (ext.endsWith(".jpg") || ext.endsWith(".jpeg")) contentType = "image/jpeg";
  return { buffer: Buffer.from(arrayBuf), contentType };
}
async function listRepoDirectory(dirPath) {
  if (!validatePath(dirPath)) {
    throw new Error(`Th\u01B0 m\u1EE5c kh\xF4ng h\u1EE3p l\u1EC7: ${dirPath}`);
  }
  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) {
    throw new Error("GITHUB_TOKEN ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh trong Vercel Environment Variables.");
  }
  const cleanDir = dirPath.replace(/\/+$/, "");
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${cleanDir}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "VINAXO-CMS-Serverless"
    }
  });
  if (response.status === 404) return [];
  if (!response.ok) {
    throw new Error(mapGitHubError(response.status, "li\u1EC7t k\xEA th\u01B0 m\u1EE5c"));
  }
  const data = await response.json();
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    name: item.name,
    path: item.path,
    sha: item.sha,
    size: item.size || 0,
    type: item.type === "dir" ? "dir" : "file"
  }));
}
async function listRepoJsonFiles(dirPath) {
  const entries = await listRepoDirectory(dirPath);
  const jsonFiles = entries.filter((e) => e.type === "file" && e.name.endsWith(".json"));
  const results = await Promise.all(
    jsonFiles.map(async (entry) => {
      const file = await getRepoFile(entry.path);
      if (!file) return null;
      try {
        return {
          data: JSON.parse(file.content),
          sha: file.sha,
          name: entry.name
        };
      } catch {
        return null;
      }
    })
  );
  return results.filter((r) => r !== null);
}
async function deleteRepoFile(filePath, commitMessage, sha) {
  if (!validatePath(filePath)) {
    throw new Error(`\u0110\u01B0\u1EDDng d\u1EABn kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c n\u1EB1m ngo\xE0i danh m\u1EE5c \u0111\u01B0\u1EE3c ph\xE9p: ${filePath}`);
  }
  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) {
    throw new Error("GITHUB_TOKEN ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh trong Vercel Environment Variables.");
  }
  let fileSha = sha;
  if (!fileSha) {
    const existing = await getRepoFile(filePath);
    if (!existing) {
      throw new Error("Kh\xF4ng t\xECm th\u1EA5y b\xE0i vi\u1EBFt tr\xEAn kho l\u01B0u tr\u1EEF \u0111\u1EC3 x\xF3a.");
    }
    fileSha = existing.sha;
  }
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "VINAXO-CMS-Serverless"
    },
    body: JSON.stringify({
      message: commitMessage,
      sha: fileSha,
      branch
    })
  });
  if (!response.ok) {
    throw new Error(mapGitHubError(response.status, "x\xF3a t\u1EC7p tin"));
  }
  return true;
}
async function commitMediaFile(filePath, base64Data, commitMessage) {
  if (!validatePath(filePath)) {
    throw new Error(`\u0110\u01B0\u1EDDng d\u1EABn t\u1EA3i \u1EA3nh kh\xF4ng h\u1EE3p l\u1EC7: ${filePath}`);
  }
  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) {
    throw new Error("GITHUB_TOKEN ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh trong Vercel Environment Variables.");
  }
  const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, "");
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "VINAXO-CMS-Serverless"
    },
    body: JSON.stringify({
      message: commitMessage,
      content: cleanBase64,
      branch
    })
  });
  if (!response.ok) {
    throw new Error(mapGitHubError(response.status, "t\u1EA3i h\xECnh \u1EA3nh"));
  }
  const data = await response.json();
  const publicUrl = "/" + filePath.replace(/^public\//, "");
  return {
    path: filePath,
    publicUrl,
    commitSha: data.commit?.sha,
    branch
  };
}

// server/admin/media.ts
import fs from "fs";
import path from "path";
var ALLOWED_CATEGORIES = ["homepage", "about", "news", "products", "certificates", "banners"];
var MAX_BINARY_BYTES = 3 * 1024 * 1024;
function detectImageFormat(base64Data) {
  const headerMatch = base64Data.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/i);
  let declaredType = "";
  let rawBase64 = base64Data;
  if (headerMatch) {
    declaredType = headerMatch[1].toLowerCase();
    rawBase64 = headerMatch[2];
  }
  const headBuf = Buffer.from(rawBase64.slice(0, 32), "base64");
  if (headBuf.length < 12) return null;
  const isJpeg = headBuf[0] === 255 && headBuf[1] === 216 && headBuf[2] === 255;
  const isPng = headBuf[0] === 137 && headBuf[1] === 80 && headBuf[2] === 78 && headBuf[3] === 71;
  const isWebp = headBuf.subarray(0, 4).toString("ascii") === "RIFF" && headBuf.subarray(8, 12).toString("ascii") === "WEBP";
  if (isWebp) return { ext: ".webp", cleanBase64: rawBase64 };
  if (isPng) return { ext: ".png", cleanBase64: rawBase64 };
  if (isJpeg) return { ext: ".jpg", cleanBase64: rawBase64 };
  if (declaredType === "webp" && rawBase64.startsWith("UklGR")) return { ext: ".webp", cleanBase64: rawBase64 };
  return null;
}
async function findMediaReferences(mediaPathOrUrl, useGitHub) {
  const references = [];
  const filename = path.basename(mediaPathOrUrl);
  const normalizedUrl = mediaPathOrUrl.startsWith("/") ? mediaPathOrUrl : `/${mediaPathOrUrl}`;
  const checkDirs = [
    { dir: "content/news", type: "B\xE0i vi\u1EBFt tin t\u1EE9c", titleField: "title_vi" },
    { dir: "content/products", type: "S\u1EA3n ph\u1EA9m", titleField: "name_vi" },
    { dir: "content/settings", type: "C\xE0i \u0111\u1EB7t h\u1EC7 th\u1ED1ng", titleField: "title_vi" },
    { dir: "content/certificates", type: "Ch\u1EE9ng nh\u1EADn", titleField: "nameVi" }
  ];
  for (const item of checkDirs) {
    if (useGitHub) {
      try {
        const entries = await listRepoJsonFiles(item.dir);
        for (const entry of entries) {
          const contentStr = JSON.stringify(entry.data);
          if (contentStr.includes(mediaPathOrUrl) || contentStr.includes(filename) || contentStr.includes(normalizedUrl)) {
            references.push({
              type: item.type,
              title: entry.data[item.titleField] || entry.data.nameVi || entry.data.name || entry.name,
              file: `${item.dir}/${entry.name}`
            });
          }
        }
      } catch {
      }
    } else {
      const fullDir = path.join(process.cwd(), item.dir);
      if (fs.existsSync(fullDir)) {
        const files = fs.readdirSync(fullDir).filter((f) => f.endsWith(".json"));
        for (const f of files) {
          try {
            const content = fs.readFileSync(path.join(fullDir, f), "utf-8");
            if (content.includes(mediaPathOrUrl) || content.includes(filename) || content.includes(normalizedUrl)) {
              const parsed = JSON.parse(content.replace(/^\uFEFF/, ""));
              references.push({
                type: item.type,
                title: parsed[item.titleField] || parsed.nameVi || parsed.name || f,
                file: `${item.dir}/${f}`
              });
            }
          } catch {
          }
        }
      }
    }
  }
  return references;
}
var media_default = wrapHandler(async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Y\xEAu c\u1EA7u \u0111\u0103ng nh\u1EADp qu\u1EA3n tr\u1ECB." });
  }
  const useGitHub = hasGitHubToken();
  if (req.method === "GET") {
    try {
      const checkUsage = req.query?.checkUsage;
      if (typeof checkUsage === "string" && checkUsage.trim()) {
        const references = await findMediaReferences(checkUsage.trim(), useGitHub);
        return res.status(200).json({ ok: true, usageCount: references.length, references });
      }
      const rawFile = req.query?.raw;
      if (typeof rawFile === "string" && rawFile.trim()) {
        const cleanFile = rawFile.replace(/^\/+/, "");
        const fullRepoPath = cleanFile.startsWith("public/") ? cleanFile : `public/${cleanFile}`;
        if (!fullRepoPath.startsWith("public/uploads/") || !validatePath(fullRepoPath)) {
          return res.status(400).json({ error: "\u0110\u01B0\u1EDDng d\u1EABn \u1EA3nh kh\xF4ng h\u1EE3p l\u1EC7." });
        }
        const localCandidate = path.join(process.cwd(), fullRepoPath);
        if (fs.existsSync(localCandidate)) {
          const ext = path.extname(localCandidate).toLowerCase();
          res.setHeader("Content-Type", ext === ".png" ? "image/png" : ext === ".jpg" ? "image/jpeg" : "image/webp");
          return res.status(200).send(fs.readFileSync(localCandidate));
        }
        if (useGitHub) {
          const bin = await getRepoBinaryFile(fullRepoPath);
          if (bin) {
            res.setHeader("Content-Type", bin.contentType);
            return res.status(200).send(bin.buffer);
          }
        }
        return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y \u1EA3nh." });
      }
      const mediaList = [];
      const factoryAssetDirs = [
        { repoDir: "public/assets/images", urlPrefix: "/assets/images", cat: "homepage", filterFn: (f) => /^(hero|brochure-2026)/i.test(f) && f.toLowerCase().endsWith(".webp") },
        { repoDir: "public/images/categories", urlPrefix: "/images/categories", cat: "homepage", filterFn: (f) => f.toLowerCase().endsWith(".webp") },
        { repoDir: "public/images/products", urlPrefix: "/images/products", cat: "products", filterFn: (f) => f.toLowerCase().endsWith(".webp") },
        { repoDir: "public/assets/images/factory", urlPrefix: "/assets/images/factory", cat: "about", filterFn: (f) => f.toLowerCase().endsWith(".webp") },
        { repoDir: "public/assets/images/factory-2026", urlPrefix: "/assets/images/factory-2026", cat: "about", filterFn: (f) => f.toLowerCase().endsWith(".webp") }
      ];
      for (const dirInfo of factoryAssetDirs) {
        const absDir = path.join(process.cwd(), dirInfo.repoDir);
        if (fs.existsSync(absDir)) {
          const files = fs.readdirSync(absDir).filter(dirInfo.filterFn);
          for (const f of files) {
            const stat = fs.statSync(path.join(absDir, f));
            mediaList.push({
              name: f,
              url: `${dirInfo.urlPrefix}/${f}`,
              size: stat.size,
              category: dirInfo.cat
            });
          }
        }
      }
      if (useGitHub) {
        const catResults = await Promise.all(
          ALLOWED_CATEGORIES.map(async (cat) => {
            const entries = await listRepoDirectory(`public/uploads/${cat}`);
            return entries.filter((e) => e.type === "file" && !e.name.startsWith(".")).map((e) => ({
              name: e.name,
              url: `/uploads/${cat}/${e.name}`,
              fallbackUrl: `/api/admin/media?raw=${encodeURIComponent(`public/uploads/${cat}/${e.name}`)}`,
              size: e.size,
              category: cat
            }));
          })
        );
        catResults.forEach((items) => mediaList.push(...items));
      } else {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (fs.existsSync(uploadsDir)) {
          for (const cat of ALLOWED_CATEGORIES) {
            const catDir = path.join(uploadsDir, cat);
            if (fs.existsSync(catDir)) {
              const files = fs.readdirSync(catDir).filter((f) => !f.startsWith("."));
              files.forEach((f) => {
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
      }
      return res.status(200).json({ ok: true, media: mediaList, source: useGitHub ? "github" : "local" });
    } catch (err) {
      return res.status(500).json({ error: err?.message || "L\u1ED7i khi t\u1EA3i th\u01B0 vi\u1EC7n h\xECnh \u1EA3nh." });
    }
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
    res.setHeader("Retry-After", String(mutLimit.retryAfterSeconds));
    return res.status(429).json({ error: "Thao t\xE1c qu\xE1 nhanh. Vui l\xF2ng th\u1EED l\u1EA1i sau." });
  }
  if (req.method === "POST") {
    const body = await readJsonBody(req);
    const { filename, base64Data, category = "news" } = body;
    if (typeof filename !== "string" || !filename.trim() || typeof base64Data !== "string" || !base64Data) {
      return res.status(400).json({ error: "Vui l\xF2ng cung c\u1EA5p t\xEAn file v\xE0 d\u1EEF li\u1EC7u \u1EA3nh." });
    }
    const detected = detectImageFormat(base64Data);
    if (!detected) {
      return res.status(400).json({ error: "\u0110\u1ECBnh d\u1EA1ng \u1EA3nh kh\xF4ng h\u1EE3p l\u1EC7. Ch\u1EC9 ch\u1EA5p nh\u1EADn file th\u1EF1c t\u1EBF JPG, PNG ho\u1EB7c WebP." });
    }
    const decodedBuffer = Buffer.from(detected.cleanBase64, "base64");
    if (decodedBuffer.length === 0 || decodedBuffer.length > MAX_BINARY_BYTES) {
      return res.status(400).json({ error: "Dung l\u01B0\u1EE3ng \u1EA3nh v\u01B0\u1EE3t qu\xE1 gi\u1EDBi h\u1EA1n cho ph\xE9p (t\u1ED1i \u0111a 3MB sau n\xE9n)." });
    }
    const cleanName = filename.toLowerCase().replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-");
    const rawExt = path.extname(cleanName);
    const baseName = path.basename(cleanName, rawExt).replace(/[^a-z0-9_-]/g, "-").slice(0, 60) || "vinaxo-image";
    const uniqueFilename = `${baseName}-${Date.now()}${detected.ext}`;
    const targetCategory = ALLOWED_CATEGORIES.includes(category) ? category : "news";
    const targetFilePath = `public/uploads/${targetCategory}/${uniqueFilename}`;
    const safeCommitName = sanitizeCommitText(uniqueFilename, 80);
    if (useGitHub) {
      const result = await commitMediaFile(targetFilePath, detected.cleanBase64, `cms(media): upload ${safeCommitName}`);
      return res.status(200).json({
        ok: true,
        url: result.publicUrl,
        fallbackUrl: `/api/admin/media?raw=${encodeURIComponent(targetFilePath)}`,
        path: targetFilePath,
        size: decodedBuffer.length,
        commitSha: result.commitSha,
        branch: result.branch
      });
    } else {
      const localPath = path.join(process.cwd(), targetFilePath);
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      fs.writeFileSync(localPath, decodedBuffer);
      return res.status(200).json({
        ok: true,
        url: `/uploads/${targetCategory}/${uniqueFilename}`,
        path: targetFilePath,
        size: decodedBuffer.length
      });
    }
  }
  if (req.method === "DELETE") {
    const body = await readJsonBody(req);
    const rawUrl = body?.url || body?.path || req.query?.url;
    const force = Boolean(body?.force);
    if (typeof rawUrl !== "string" || !rawUrl.trim()) {
      return res.status(400).json({ error: "Vui l\xF2ng cung c\u1EA5p \u0111\u01B0\u1EDDng d\u1EABn \u1EA3nh c\u1EA7n x\xF3a." });
    }
    const cleanUrl = rawUrl.trim().replace(/^\/+/, "");
    const repoFilePath = cleanUrl.startsWith("public/") ? cleanUrl : `public/${cleanUrl}`;
    if (!repoFilePath.startsWith("public/uploads/") || !validatePath(repoFilePath)) {
      return res.status(400).json({ error: "Ch\u1EC9 cho ph\xE9p x\xF3a c\xE1c h\xECnh \u1EA3nh thu\u1ED9c th\u01B0 m\u1EE5c public/uploads/." });
    }
    const references = await findMediaReferences(cleanUrl, useGitHub);
    if (references.length > 0 && !force) {
      return res.status(409).json({
        ok: false,
        error: `Kh\xF4ng th\u1EC3 x\xF3a \u1EA3nh v\xEC \u0111ang \u0111\u01B0\u1EE3c s\u1EED d\u1EE5ng t\u1EA1i ${references.length} v\u1ECB tr\xED tr\xEAn website. Vui l\xF2ng thay th\u1EBF ho\u1EB7c g\u1EE1 tham chi\u1EBFu tr\u01B0\u1EDBc khi x\xF3a.`,
        referenced: true,
        references
      });
    }
    const filename = path.basename(repoFilePath);
    if (useGitHub) {
      await deleteRepoFile(repoFilePath, `cms(media): delete "${sanitizeCommitText(filename, 70)}"`);
    } else {
      const localPath = path.join(process.cwd(), repoFilePath);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      } else {
        return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y t\u1EC7p \u1EA3nh tr\xEAn m\xE1y ch\u1EE7 \u0111\u1EC3 x\xF3a." });
      }
    }
    return res.status(200).json({
      ok: true,
      message: `\u0110\xE3 x\xF3a \u1EA3nh "${filename}" th\xE0nh c\xF4ng kh\u1ECFi h\u1EC7 th\u1ED1ng.`
    });
  }
  return res.status(405).json({ error: "Method Not Allowed" });
});
export {
  media_default as default
};
