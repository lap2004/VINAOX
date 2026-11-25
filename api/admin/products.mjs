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
function sanitizeSlug(raw) {
  if (typeof raw !== "string") return null;
  const normalized = raw.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  if (!normalized || normalized.length > 120 || !/^[a-z0-9][a-z0-9-]*$/.test(normalized)) {
    return null;
  }
  return normalized;
}
function sanitizeCommitText(text, maxLen = 100) {
  if (typeof text !== "string") return "";
  return text.replace(/[\r\n\t\x00-\x1f\x7f]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLen);
}
function stripUnsafeKeys(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return {};
  }
  const clean = {};
  for (const key of Object.keys(obj)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype" || key === "sha" || key === "_sha") {
      continue;
    }
    clean[key] = obj[key];
  }
  return clean;
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
async function commitFile(filePath, contentStr, commitMessage, sha) {
  if (!validatePath(filePath)) {
    throw new Error(`\u0110\u01B0\u1EDDng d\u1EABn kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c n\u1EB1m ngo\xE0i danh m\u1EE5c \u0111\u01B0\u1EE3c ph\xE9p: ${filePath}`);
  }
  const { owner, repo, branch, token } = getRepoConfig();
  if (!token) {
    throw new Error("GITHUB_TOKEN ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh trong Vercel Environment Variables.");
  }
  const base64Content = Buffer.from(contentStr, "utf-8").toString("base64");
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  let fileSha = sha;
  if (!fileSha) {
    const existing = await getRepoFile(filePath);
    if (existing) {
      fileSha = existing.sha;
    }
  }
  const body = {
    message: commitMessage,
    content: base64Content,
    branch
  };
  if (fileSha) {
    body.sha = fileSha;
  }
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "VINAXO-CMS-Serverless"
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(mapGitHubError(response.status, "l\u01B0u d\u1EEF li\u1EC7u"));
  }
  const data = await response.json();
  return {
    sha: data.content?.sha,
    commitSha: data.commit?.sha,
    branch
  };
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

// src/shared/schemas/newsSchema.ts
function validateSlug(slug) {
  if (typeof slug !== "string") return { valid: false, slug: "" };
  const trimmed = slug.trim().toLowerCase();
  if (!trimmed || trimmed.length < 3 || trimmed.length > 120) {
    return { valid: false, slug: "" };
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmed)) {
    return { valid: false, slug: "" };
  }
  return { valid: true, slug: trimmed };
}
function isValidUrl(url, allowRelative = true) {
  if (typeof url !== "string" || !url.trim()) return false;
  const trimmed = url.trim();
  if (allowRelative && trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return !trimmed.includes("..") && !/[<>"'\\|?*]/.test(trimmed);
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

// src/shared/schemas/productSchema.ts
var ALLOWED_CATEGORIES = ["soft-dried", "chips", "nuts-seeds", "mixed"];
function validateProduct(input) {
  const errors = [];
  const raw = typeof input === "object" && input !== null ? input : {};
  const slugCheck = validateSlug(raw.slug || raw.id);
  if (!slugCheck.valid) {
    errors.push("Slug s\u1EA3n ph\u1EA9m kh\xF4ng h\u1EE3p l\u1EC7 (y\xEAu c\u1EA7u t\u1EEB 3-120 k\xFD t\u1EF1 ch\u1EEF th\u01B0\u1EDDng, s\u1ED1 v\xE0 g\u1EA1ch n\u1ED1i).");
  }
  const slug = slugCheck.slug || "san-pham-moi";
  const id = typeof raw.id === "string" && raw.id.trim() ? raw.id.trim() : slug;
  const nameVi = typeof raw.nameVi === "string" && raw.nameVi.trim() ? raw.nameVi.trim() : typeof raw.name_vi === "string" ? raw.name_vi.trim() : "";
  if (!nameVi) {
    errors.push("T\xEAn s\u1EA3n ph\u1EA9m ti\u1EBFng Vi\u1EC7t l\xE0 tr\u01B0\u1EDDng b\u1EAFt bu\u1ED9c.");
  }
  const name = typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : typeof raw.name_en === "string" ? raw.name_en.trim() : nameVi;
  const category = ALLOWED_CATEGORIES.includes(raw.category) ? raw.category : "soft-dried";
  let image = typeof raw.image === "string" ? raw.image.trim() : typeof raw.imageWebp === "string" ? raw.imageWebp.trim() : "";
  if (!image || !isValidUrl(image, true)) {
    image = "/images/products/placeholder.webp";
  }
  let imageWebp = typeof raw.imageWebp === "string" && raw.imageWebp.trim() ? raw.imageWebp.trim() : image;
  let imageJpg = typeof raw.imageJpg === "string" && raw.imageJpg.trim() ? raw.imageJpg.trim() : image;
  if (image.endsWith(".webp")) {
    imageWebp = image;
    if (!raw.imageJpg || raw.imageJpg.includes("img_5608") || !raw.imageJpg.endsWith(".jpg")) {
      imageJpg = image.replace(/\.webp$/, ".jpg");
    }
  } else if (image.endsWith(".jpg") || image.endsWith(".jpeg")) {
    imageJpg = image;
    if (!raw.imageWebp || raw.imageWebp.includes("img_5608") || !raw.imageWebp.endsWith(".webp")) {
      imageWebp = image.replace(/\.jpe?g$/, ".webp");
    }
  }
  const shortDescriptionVi = typeof raw.shortDescriptionVi === "string" ? raw.shortDescriptionVi.trim() : typeof raw.description_vi === "string" ? raw.description_vi.trim() : "";
  const shortDescription = typeof raw.shortDescription === "string" ? raw.shortDescription.trim() : typeof raw.description_en === "string" ? raw.description_en.trim() : shortDescriptionVi;
  const descriptionVi = typeof raw.descriptionVi === "string" ? raw.descriptionVi.trim() : typeof raw.description_vi === "string" ? raw.description_vi.trim() : shortDescriptionVi;
  const description = typeof raw.description === "string" ? raw.description.trim() : typeof raw.description_en === "string" ? raw.description_en.trim() : shortDescription;
  const defaultSpecs = {
    moisture: "< 16%",
    brix: "50\xB0 - 55\xB0 Brix",
    shelfLifeEn: "12 Months",
    shelfLifeVi: "12 Th\xE1ng",
    storageEn: "Cool, dry place (20 - 25\xB0C)",
    storageVi: "N\u01A1i kh\xF4 r\xE1o, tho\xE1ng m\xE1t (20 - 25\xB0C)",
    ingredientsEn: "100% Natural Vietnamese Fruits",
    ingredientsVi: "100% Tr\xE1i c\xE2y Vi\u1EC7t Nam t\u1EF1 nhi\xEAn",
    processEn: "Low-temperature convective heat-pump drying",
    processVi: "S\u1EA5y b\u01A1m nhi\u1EC7t nhi\u1EC7t \u0111\u1ED9 th\u1EA5p tu\u1EA7n ho\xE0n",
    packagingEn: "Zip pouch / Export carton",
    packagingVi: "T\xFAi zip / Th\xF9ng carton xu\u1EA5t kh\u1EA9u",
    certificationsEn: "BRCGS Facility, Clean Label",
    certificationsVi: "Nh\xE0 m\xE1y chu\u1EA9n BRCGS, Clean Label"
  };
  const rawSpecs = typeof raw.specs === "object" && raw.specs !== null ? raw.specs : {};
  const specs = { ...defaultSpecs, ...rawSpecs };
  const product = {
    id,
    slug,
    aliases: Array.isArray(raw.aliases) ? raw.aliases : [],
    name,
    nameVi,
    category,
    categoryLabelEn: typeof raw.categoryLabelEn === "string" ? raw.categoryLabelEn : "Tropical Dried Fruits",
    categoryLabelVi: typeof raw.categoryLabelVi === "string" ? raw.categoryLabelVi : "Tr\xE1i c\xE2y s\u1EA5y nhi\u1EC7t \u0111\u1EDBi",
    image,
    imageWebp,
    imageJpg,
    shortDescription,
    shortDescriptionVi,
    description: typeof raw.description === "string" ? raw.description.trim() : shortDescription,
    descriptionVi: typeof raw.descriptionVi === "string" ? raw.descriptionVi.trim() : shortDescriptionVi,
    origin: typeof raw.origin === "string" ? raw.origin : "Mekong Delta, Vietnam",
    originVi: typeof raw.originVi === "string" ? raw.originVi : "\u0110\u1ED3ng b\u1EB1ng S\xF4ng C\u1EEDu Long, Vi\u1EC7t Nam",
    certifications: Array.isArray(raw.certifications) ? raw.certifications : ["BRCGS", "Clean Label"],
    verified: raw.verified !== void 0 ? Boolean(raw.verified) : true,
    ocop: typeof raw.ocop === "string" ? raw.ocop : "3-Star OCOP",
    specs,
    en: {
      name,
      desc: shortDescription,
      origin: typeof raw.en?.origin === "string" ? raw.en.origin : "Mekong Delta, Vietnam",
      features: typeof raw.en?.features === "string" ? raw.en.features : shortDescription
    },
    vi: {
      name: nameVi,
      desc: shortDescriptionVi,
      origin: typeof raw.vi?.origin === "string" ? raw.vi.origin : "\u0110\u1ED3ng b\u1EB1ng S\xF4ng C\u1EEDu Long, Vi\u1EC7t Nam",
      features: typeof raw.vi?.features === "string" ? raw.vi.features : shortDescriptionVi
    },
    // Compatibility fields
    name_vi: nameVi,
    name_en: name,
    description_vi: descriptionVi,
    description_en: description,
    origin_vi: typeof raw.originVi === "string" ? raw.originVi : "\u0110\u1ED3ng b\u1EB1ng S\xF4ng C\u1EEDu Long, Vi\u1EC7t Nam",
    origin_en: typeof raw.origin === "string" ? raw.origin : "Mekong Delta, Vietnam",
    shelf_life: specs.shelfLifeVi,
    packaging: specs.packagingVi,
    order: Number(raw.order) || 999
  };
  return {
    valid: errors.length === 0,
    errors,
    data: product
  };
}
function mergeProduct(existing, incoming) {
  const base = existing && typeof existing === "object" ? { ...existing } : {};
  const update = incoming && typeof incoming === "object" ? { ...incoming } : {};
  if (update.image) {
    if (!update.imageWebp) update.imageWebp = update.image;
    if (!update.imageJpg) {
      update.imageJpg = update.image.endsWith(".webp") ? update.image.replace(/\.webp$/, ".jpg") : update.image;
    }
  }
  const merged = {
    ...base,
    ...update,
    specs: { ...base.specs || {}, ...update.specs || {} },
    en: { ...base.en || {}, ...update.en || {} },
    vi: { ...base.vi || {}, ...update.vi || {} }
  };
  return validateProduct(merged).data;
}

// server/admin/products.ts
import fs from "fs";
import path from "path";
var products_default = wrapHandler(async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Y\xEAu c\u1EA7u \u0111\u0103ng nh\u1EADp qu\u1EA3n tr\u1ECB." });
  }
  const useGitHub = hasGitHubToken();
  if (req.method === "GET") {
    try {
      const normalizeRawProduct = (raw, idx = 0) => {
        const nameVi = raw.name_vi || raw.nameVi || raw.vi?.name || "S\u1EA3n ph\u1EA9m VINAXO";
        const nameEn = raw.name_en || raw.name || raw.nameEn || raw.en?.name || nameVi;
        const slug = raw.slug || raw.id || `product-${idx}`;
        return {
          ...raw,
          id: raw.id || slug,
          slug,
          name_vi: nameVi,
          name_en: nameEn,
          nameVi,
          name: nameEn,
          category: raw.category || "soft-dried",
          image: raw.image || raw.imageWebp || raw.imageJpg || "/assets/images/products/placeholder.webp",
          description_vi: raw.description_vi || raw.descriptionVi || raw.shortDescriptionVi || raw.vi?.desc || "",
          description_en: raw.description_en || raw.description || raw.shortDescription || raw.en?.desc || "",
          origin_vi: raw.origin_vi || raw.originVi || raw.origin || "",
          origin_en: raw.origin_en || raw.origin || "",
          shelf_life: raw.shelf_life || raw.specs?.shelfLifeVi || "12 Th\xE1ng",
          packaging: raw.packaging || raw.specs?.packagingVi || "T\xFAi zip / Th\xF9ng carton xu\u1EA5t kh\u1EA9u",
          certifications: Array.isArray(raw.certifications) ? raw.certifications : [],
          order: Number(raw.order) || idx + 1
        };
      };
      if (useGitHub) {
        const entries = await listRepoJsonFiles("content/products");
        const products = entries.map((e, idx) => normalizeRawProduct(e.data, idx)).sort((a, b) => (Number(a?.order) || 999) - (Number(b?.order) || 999));
        return res.status(200).json({ ok: true, products, source: "github" });
      }
      const contentProductsDir = path.join(process.cwd(), "content", "products");
      if (fs.existsSync(contentProductsDir)) {
        const files = fs.readdirSync(contentProductsDir).filter((f) => f.endsWith(".json"));
        const products = files.map((file, idx) => {
          const raw = JSON.parse(fs.readFileSync(path.join(contentProductsDir, file), "utf-8").replace(/^\uFEFF/, ""));
          return normalizeRawProduct(raw, idx);
        }).sort((a, b) => (Number(a?.order) || 999) - (Number(b?.order) || 999));
        return res.status(200).json({ ok: true, products, source: "local" });
      }
      return res.status(200).json({ ok: true, products: [], source: "empty" });
    } catch (err) {
      return res.status(500).json({ error: err?.message || "L\u1ED7i khi t\u1EA3i danh s\xE1ch s\u1EA3n ph\u1EA9m." });
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
    const rawBody = await readJsonBody(req);
    const requestSha = typeof rawBody.sha === "string" ? rawBody.sha : void 0;
    const productInput = stripUnsafeKeys(rawBody);
    const slug = sanitizeSlug(productInput.slug || productInput.id);
    if (!slug) {
      return res.status(400).json({ error: "Slug s\u1EA3n ph\u1EA9m kh\xF4ng h\u1EE3p l\u1EC7." });
    }
    const filePath = `content/products/${slug}.json`;
    let existingProduct = null;
    let targetSha = requestSha;
    if (useGitHub) {
      const existingFile = await getRepoFile(filePath);
      if (existingFile) {
        try {
          existingProduct = JSON.parse(existingFile.content);
          if (requestSha && existingFile.sha !== requestSha) {
            return res.status(409).json({
              error: "S\u1EA3n ph\u1EA9m \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt b\u1EDFi m\u1ED9t phi\xEAn l\xE0m vi\u1EC7c kh\xE1c. Vui l\xF2ng t\u1EA3i l\u1EA1i trang.",
              currentSha: existingFile.sha
            });
          }
          targetSha = existingFile.sha;
        } catch {
          existingProduct = null;
        }
      }
    } else {
      const fullLocalPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullLocalPath)) {
        try {
          existingProduct = JSON.parse(fs.readFileSync(fullLocalPath, "utf-8").replace(/^\uFEFF/, ""));
        } catch {
          existingProduct = null;
        }
      }
    }
    productInput.slug = slug;
    productInput.id = slug;
    const merged = mergeProduct(existingProduct, productInput);
    const validation = validateProduct(merged);
    if (!validation.valid) {
      return res.status(400).json({
        error: `D\u1EEF li\u1EC7u s\u1EA3n ph\u1EA9m kh\xF4ng h\u1EE3p l\u1EC7: ${validation.errors.join("; ")}`,
        errors: validation.errors
      });
    }
    const validatedProduct = validation.data;
    const contentStr = JSON.stringify(validatedProduct, null, 2);
    const commitMessage = `cms(product): update "${sanitizeCommitText(validatedProduct.nameVi || validatedProduct.name, 72)}"`;
    let result = null;
    if (useGitHub) {
      result = await commitFile(filePath, contentStr, commitMessage, targetSha);
    } else {
      const fullLocalPath = path.join(process.cwd(), filePath);
      fs.mkdirSync(path.dirname(fullLocalPath), { recursive: true });
      fs.writeFileSync(fullLocalPath, contentStr, "utf-8");
      result = { sha: "local-sha", commitSha: "local-commit" };
    }
    return res.status(200).json({
      ok: true,
      message: "C\u1EADp nh\u1EADt s\u1EA3n ph\u1EA9m an to\xE0n th\xE0nh c\xF4ng!",
      product: validatedProduct,
      result
    });
  }
  if (req.method === "DELETE") {
    const rawBody = await readJsonBody(req);
    const rawSlug = rawBody.slug ?? req.query?.slug;
    const requestSha = typeof rawBody.sha === "string" ? rawBody.sha : void 0;
    const slug = sanitizeSlug(rawSlug);
    if (!slug) {
      return res.status(400).json({ error: "Slug s\u1EA3n ph\u1EA9m c\u1EA7n x\xF3a kh\xF4ng h\u1EE3p l\u1EC7." });
    }
    const filePath = `content/products/${slug}.json`;
    if (useGitHub) {
      await deleteRepoFile(filePath, `cms(product): delete "${slug}"`, requestSha);
    } else {
      const fullLocalPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullLocalPath)) {
        fs.unlinkSync(fullLocalPath);
      } else {
        return res.status(404).json({ error: "Kh\xF4ng t\xECm th\u1EA5y s\u1EA3n ph\u1EA9m \u0111\u1EC3 x\xF3a." });
      }
    }
    return res.status(200).json({ ok: true, message: `\u0110\xE3 x\xF3a s\u1EA3n ph\u1EA9m ${slug} th\xE0nh c\xF4ng.` });
  }
  return res.status(405).json({ error: "Method Not Allowed" });
});
export {
  products_default as default
};
