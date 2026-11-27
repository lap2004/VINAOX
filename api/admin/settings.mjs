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

// src/shared/schemas/newsSchema.ts
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

// src/config/siteConfig.ts
var SITE_CONFIG = {
  name: "VINAXO",
  legalNameVi: "C\xD4NG TY TNHH VINAXO",
  legalNameEn: "VINAXO COMPANY LIMITED",
  siteUrl: "https://www.vinaxo.net",
  apexUrl: "https://vinaxo.net",
  defaultOgImage: "https://www.vinaxo.net/assets/images/hero_fruits.jpg",
  brochureOgImage: "https://www.vinaxo.net/assets/images/brochure-2026-cover.jpg",
  logoUrl: "https://www.vinaxo.net/assets/logo/vinaxo-logo.svg",
  twitterCard: "summary_large_image"
};
function normalizeSiteUrl(pathOrUrl) {
  const base = SITE_CONFIG.siteUrl.replace(/\/+$/, "");
  if (!pathOrUrl || typeof pathOrUrl !== "string") return `${base}/`;
  const trimmed = pathOrUrl.trim();
  if (!trimmed) return `${base}/`;
  if (/^(mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    if (/^\/(www\.)?vinaxo\.(net|vn)(\/|$)/i.test(trimmed)) {
      const rest = trimmed.replace(/^\/(www\.)?vinaxo\.(net|vn)/i, "") || "/";
      return `${base}${rest.startsWith("/") ? rest : `/${rest}`}`;
    }
    return `${base}${trimmed}`;
  }
  const candidate = /^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i.test(trimmed) ? `https://${trimmed}` : trimmed;
  try {
    const parsed = new URL(candidate);
    const host = parsed.hostname.toLowerCase();
    if (host === "vinaxo.vn" || host === "www.vinaxo.vn" || host === "vinaxo.net" || host === "www.vinaxo.net") {
      return `${base}${parsed.pathname || "/"}${parsed.search}${parsed.hash}`;
    }
    return parsed.href;
  } catch {
    return `${base}/`;
  }
}
function normalizeExternalWebsiteUrl(url, fallback = `${SITE_CONFIG.siteUrl}/`) {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  if (/^(mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (trimmed === "/") return "/";
  return normalizeSiteUrl(trimmed);
}

// src/shared/schemas/settingsSchema.ts
function sanitizeEnglishCompanyName(raw) {
  const trimmed = raw.trim();
  if (!trimmed || /VINAXO\s+COMPANY\s+LIMITED\s*\(.*Vinaxo/i.test(trimmed)) {
    return "VINAXO COMPANY LIMITED";
  }
  return trimmed;
}
var EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var FORBIDDEN_SECRET_KEYS = ["password", "smtp_pass", "smtp_password", "api_key", "resend_api_key", "brevo_api_key", "secret"];
function validateCompanySettings(input) {
  const errors = [];
  const raw = typeof input === "object" && input !== null ? input : {};
  for (const forbidden of FORBIDDEN_SECRET_KEYS) {
    if (Object.prototype.hasOwnProperty.call(raw, forbidden)) {
      errors.push(`Kh\xF4ng \u0111\u01B0\u1EE3c ph\xE9p l\u01B0u tr\u01B0\u1EDDng nh\u1EA1y c\u1EA3m (${forbidden}) trong c\u1EA5u h\xECnh c\xF4ng khai.`);
    }
  }
  const company_name_vi = typeof raw.company_name_vi === "string" && raw.company_name_vi.trim() ? raw.company_name_vi.trim() : "C\xD4NG TY TNHH VINAXO";
  const company_name_en = typeof raw.company_name_en === "string" && raw.company_name_en.trim() ? sanitizeEnglishCompanyName(raw.company_name_en) : "VINAXO COMPANY LIMITED";
  const tax_id = typeof raw.tax_id === "string" && raw.tax_id.trim() ? raw.tax_id.trim() : "1201611681";
  const address_vi = typeof raw.address_vi === "string" && raw.address_vi.trim() ? raw.address_vi.trim() : "Khu ph\u1ED1 5, X\xE3 V\u0129nh B\xECnh, T\u1EC9nh \u0110\u1ED3ng Th\xE1p, Vi\u1EC7t Nam";
  const address_en = typeof raw.address_en === "string" && raw.address_en.trim() ? raw.address_en.trim() : "Quarter 5, Vinh Binh Commune, Dong Thap Province, Vietnam";
  const hotline = typeof raw.hotline === "string" && raw.hotline.trim() ? raw.hotline.trim() : "(+84) 984 815 016";
  let email = "cuonghoang0710@gmail.com";
  if (raw.email !== void 0 && raw.email !== null) {
    const trimmedEmail = typeof raw.email === "string" ? raw.email.trim() : "";
    if (!trimmedEmail || !EMAIL_FORMAT_REGEX.test(trimmedEmail)) {
      errors.push("Email li\xEAn h\u1EC7 c\xF4ng khai kh\xF4ng \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng (v\xED d\u1EE5: sales@vinaxo.net).");
    } else {
      email = trimmedEmail;
    }
  }
  let sales_email = void 0;
  if (typeof raw.sales_email === "string" && raw.sales_email.trim()) {
    const trimmedSales = raw.sales_email.trim();
    if (!EMAIL_FORMAT_REGEX.test(trimmedSales)) {
      errors.push("Email b\u1ED9 ph\u1EADn kinh doanh (sales_email) kh\xF4ng \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng.");
    } else {
      sales_email = trimmedSales;
    }
  }
  const website = normalizeExternalWebsiteUrl(
    typeof raw.website === "string" ? raw.website : "https://www.vinaxo.net/"
  );
  let latitude = 10.380295;
  if (raw.latitude !== void 0 && raw.latitude !== null && String(raw.latitude).trim() !== "") {
    const parsedLat = Number(raw.latitude);
    if (!Number.isFinite(parsedLat) || parsedLat < -90 || parsedLat > 90) {
      errors.push("V\u0129 \u0111\u1ED9 (latitude) kh\xF4ng h\u1EE3p l\u1EC7 (y\xEAu c\u1EA7u s\u1ED1 t\u1EEB -90 \u0111\u1EBFn 90).");
    } else {
      latitude = Number(parsedLat.toFixed(6));
    }
  }
  let longitude = 106.516139;
  if (raw.longitude !== void 0 && raw.longitude !== null && String(raw.longitude).trim() !== "") {
    const parsedLng = Number(raw.longitude);
    if (!Number.isFinite(parsedLng) || parsedLng < -180 || parsedLng > 180) {
      errors.push("Kinh \u0111\u1ED9 (longitude) kh\xF4ng h\u1EE3p l\u1EC7 (y\xEAu c\u1EA7u s\u1ED1 t\u1EEB -180 \u0111\u1EBFn 180).");
    } else {
      longitude = Number(parsedLng.toFixed(6));
    }
  }
  const factory_name_vi = typeof raw.factory_name_vi === "string" && raw.factory_name_vi.trim() ? raw.factory_name_vi.trim() : "Nh\xE0 M\xE1y Ch\u1EBF Bi\u1EBFn VINAXO";
  const factory_name_en = typeof raw.factory_name_en === "string" && raw.factory_name_en.trim() ? raw.factory_name_en.trim() : "VINAXO Processing Plant";
  const google_place_id = typeof raw.google_place_id === "string" ? raw.google_place_id.trim() : "";
  const whatsapp = typeof raw.whatsapp === "string" && isValidUrl(raw.whatsapp, false) ? raw.whatsapp.trim() : "https://wa.me/84984815016";
  const zalo = typeof raw.zalo === "string" && isValidUrl(raw.zalo, false) ? raw.zalo.trim() : "https://zalo.me/0984815016";
  return {
    valid: errors.length === 0,
    errors,
    data: {
      company_name_vi,
      company_name_en,
      tax_id,
      address_vi,
      address_en,
      ...typeof raw.address_ko === "string" && raw.address_ko.trim() ? { address_ko: raw.address_ko.trim() } : {},
      ...typeof raw.address_zh === "string" && raw.address_zh.trim() ? { address_zh: raw.address_zh.trim() } : {},
      ...typeof raw.legal_rep_vi === "string" && raw.legal_rep_vi.trim() ? { legal_rep_vi: raw.legal_rep_vi.trim() } : {},
      factory_name_vi,
      factory_name_en,
      latitude,
      longitude,
      google_place_id,
      ...typeof raw.intro_vi === "string" && raw.intro_vi.trim() ? { intro_vi: raw.intro_vi.trim() } : {},
      ...typeof raw.intro_en === "string" && raw.intro_en.trim() ? { intro_en: raw.intro_en.trim() } : {},
      ...typeof raw.intro_ko === "string" && raw.intro_ko.trim() ? { intro_ko: raw.intro_ko.trim() } : {},
      ...typeof raw.intro_zh === "string" && raw.intro_zh.trim() ? { intro_zh: raw.intro_zh.trim() } : {},
      hotline,
      email,
      ...sales_email ? { sales_email } : {},
      website,
      whatsapp,
      zalo
    }
  };
}
function sanitizePdfField(val) {
  if (typeof val !== "string") return void 0;
  const trimmed = val.trim();
  if (!trimmed || !isValidUrl(trimmed, true) || !trimmed.toLowerCase().endsWith(".pdf")) return void 0;
  return trimmed;
}
function validateBrochureSettings(input) {
  const errors = [];
  const raw = typeof input === "object" && input !== null ? input : {};
  const pdf_file = sanitizePdfField(raw.pdf_file) || "/brochures/vinaxo-company-brochure-2026.pdf";
  const pdf_file_vi = sanitizePdfField(raw.pdf_file_vi);
  const pdf_file_en = sanitizePdfField(raw.pdf_file_en) || pdf_file;
  const pdf_file_ko = sanitizePdfField(raw.pdf_file_ko);
  const pdf_file_zh = sanitizePdfField(raw.pdf_file_zh);
  const year = typeof raw.year === "string" && /^\d{4}$/.test(raw.year.trim()) ? raw.year.trim() : "2026";
  const title_vi = typeof raw.title_vi === "string" && raw.title_vi.trim() ? raw.title_vi.trim() : "H\u1ED3 S\u01A1 N\u0103ng L\u1EF1c & Brochure VINAXO 2026";
  const title_en = typeof raw.title_en === "string" && raw.title_en.trim() ? raw.title_en.trim() : "VINAXO Company Profile & Brochure 2026";
  const title_ko = typeof raw.title_ko === "string" && raw.title_ko.trim() ? raw.title_ko.trim() : void 0;
  const title_zh = typeof raw.title_zh === "string" && raw.title_zh.trim() ? raw.title_zh.trim() : void 0;
  return {
    valid: errors.length === 0,
    errors,
    data: {
      pdf_file,
      ...pdf_file_vi ? { pdf_file_vi } : {},
      pdf_file_en,
      ...pdf_file_ko ? { pdf_file_ko } : {},
      ...pdf_file_zh ? { pdf_file_zh } : {},
      year,
      title_vi,
      title_en,
      ...title_ko ? { title_ko } : {},
      ...title_zh ? { title_zh } : {},
      download_enabled: raw.download_enabled !== void 0 ? Boolean(raw.download_enabled) : true
    }
  };
}

// src/shared/schemas/aboutSchema.ts
var ABOUT_GALLERY_CATEGORIES = [
  "raw-material",
  "harvest",
  "factory",
  "preparation",
  "processing",
  "quality",
  "packaging",
  "warehouse",
  "team",
  "export"
];
var EMPTY_LOCALIZED_TEXT = {
  vi: "",
  en: "",
  ko: "",
  zh: ""
};
var SAFE_RELATIVE_IMAGE_PREFIXES = ["/assets/", "/uploads/", "/images/"];
function isSafeAboutImageUrl(url) {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("vbscript:")) {
    return false;
  }
  if (trimmed.includes("..") || /[<>"'\\|?*]/.test(trimmed)) {
    return false;
  }
  if (trimmed.startsWith("/")) {
    if (trimmed.startsWith("//")) return false;
    return SAFE_RELATIVE_IMAGE_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}
function sanitizeId(raw, fallback) {
  if (typeof raw !== "string") return fallback;
  const cleaned = raw.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}
function mergeLocalized(existing, incoming) {
  const base = existing || EMPTY_LOCALIZED_TEXT;
  if (typeof incoming === "string") {
    const trimmed = incoming.trim();
    return {
      vi: trimmed,
      en: base.en,
      ko: base.ko,
      zh: base.zh
    };
  }
  if (!incoming || typeof incoming !== "object") {
    return { ...base };
  }
  const src = incoming;
  return {
    vi: typeof src.vi === "string" ? src.vi.trim() : base.vi,
    en: typeof src.en === "string" ? src.en.trim() : base.en,
    ko: typeof src.ko === "string" ? src.ko.trim() : base.ko,
    zh: typeof src.zh === "string" ? src.zh.trim() : base.zh
  };
}
function sanitizeCategory(raw, fallback = "factory") {
  if (typeof raw === "string" && ABOUT_GALLERY_CATEGORIES.includes(raw.trim())) {
    return raw.trim();
  }
  return fallback;
}
function inferImageFallback(image, explicitFallback) {
  if (typeof explicitFallback === "string" && isSafeAboutImageUrl(explicitFallback)) {
    return explicitFallback.trim();
  }
  if (image.startsWith("/assets/") && image.toLowerCase().endsWith(".webp")) {
    return image.slice(0, -5) + ".jpg";
  }
  return void 0;
}
function mergeAboutContent(base, incoming) {
  const raw = incoming && typeof incoming === "object" ? incoming : {};
  const heroRaw = raw.hero && typeof raw.hero === "object" ? raw.hero : {};
  const hero = {
    badge: mergeLocalized(base.hero.badge, heroRaw.badge),
    title: mergeLocalized(base.hero.title, heroRaw.title),
    subtitle: mergeLocalized(base.hero.subtitle, heroRaw.subtitle)
  };
  const storyRaw = raw.story && typeof raw.story === "object" ? raw.story : {};
  const story = {
    label: mergeLocalized(base.story.label, storyRaw.label),
    titleLine1: mergeLocalized(base.story.titleLine1, storyRaw.titleLine1),
    titleLine2: mergeLocalized(base.story.titleLine2, storyRaw.titleLine2),
    description: mergeLocalized(base.story.description, storyRaw.description)
  };
  const vmRaw = raw.visionMission && typeof raw.visionMission === "object" ? raw.visionMission : {};
  const visionMission = {
    enabled: typeof vmRaw.enabled === "boolean" ? vmRaw.enabled : base.visionMission.enabled,
    label: mergeLocalized(base.visionMission.label, vmRaw.label),
    visionTitle: mergeLocalized(base.visionMission.visionTitle, vmRaw.visionTitle),
    visionDesc: mergeLocalized(base.visionMission.visionDesc, vmRaw.visionDesc),
    missionTitle: mergeLocalized(base.visionMission.missionTitle, vmRaw.missionTitle),
    missionDesc: mergeLocalized(base.visionMission.missionDesc, vmRaw.missionDesc),
    coreValuesTitle: mergeLocalized(base.visionMission.coreValuesTitle, vmRaw.coreValuesTitle),
    coreValuesDesc: mergeLocalized(base.visionMission.coreValuesDesc, vmRaw.coreValuesDesc)
  };
  const hvRaw = raw.highlightVisual && typeof raw.highlightVisual === "object" ? raw.highlightVisual : {};
  const hvImg = typeof hvRaw.image === "string" && isSafeAboutImageUrl(hvRaw.image) ? hvRaw.image.trim() : base.highlightVisual.image;
  const highlightVisual = {
    image: hvImg,
    imageFallback: inferImageFallback(hvImg, hvRaw.imageFallback ?? (hvRaw.image ? void 0 : base.highlightVisual.imageFallback)),
    overlayTag: mergeLocalized(base.highlightVisual.overlayTag, hvRaw.overlayTag),
    overlayLine1: mergeLocalized(base.highlightVisual.overlayLine1, hvRaw.overlayLine1),
    overlayLine2: mergeLocalized(base.highlightVisual.overlayLine2, hvRaw.overlayLine2),
    alt: mergeLocalized(base.highlightVisual.alt, hvRaw.alt)
  };
  const metrics = Array.isArray(raw.metrics) && raw.metrics.length > 0 ? raw.metrics.map((m, idx) => {
    const prev = base.metrics.find((b) => b.id === m?.id) || base.metrics[idx];
    return {
      id: sanitizeId(m?.id, prev?.id || `metric-${idx + 1}`),
      num: mergeLocalized(prev?.num, m?.num),
      label: mergeLocalized(prev?.label, m?.label),
      note: mergeLocalized(prev?.note, m?.note),
      source: mergeLocalized(prev?.source, m?.source)
    };
  }) : base.metrics.map((m) => ({ ...m }));
  const milestones = Array.isArray(raw.milestones) && raw.milestones.length > 0 ? raw.milestones.map((ms, idx) => {
    const prev = base.milestones.find((b) => b.id === ms?.id) || base.milestones[idx];
    return {
      id: sanitizeId(ms?.id, prev?.id || `milestone-${idx + 1}`),
      badge: mergeLocalized(prev?.badge, ms?.badge),
      title: mergeLocalized(prev?.title, ms?.title),
      desc: mergeLocalized(prev?.desc, ms?.desc)
    };
  }) : base.milestones.map((ms) => ({ ...ms }));
  const infraRaw = raw.infrastructure && typeof raw.infrastructure === "object" ? raw.infrastructure : {};
  const infraImg = typeof infraRaw.image === "string" && isSafeAboutImageUrl(infraRaw.image) ? infraRaw.image.trim() : base.infrastructure.image;
  const infraFeatures = Array.isArray(infraRaw.features) && infraRaw.features.length > 0 ? infraRaw.features.map((ft, idx) => {
    const prev = base.infrastructure.features.find((b) => b.id === ft?.id) || base.infrastructure.features[idx];
    return {
      id: sanitizeId(ft?.id, prev?.id || `feature-${idx + 1}`),
      title: mergeLocalized(prev?.title, ft?.title),
      desc: mergeLocalized(prev?.desc, ft?.desc)
    };
  }) : base.infrastructure.features.map((ft) => ({ ...ft }));
  const infrastructure = {
    label: mergeLocalized(base.infrastructure.label, infraRaw.label),
    title: mergeLocalized(base.infrastructure.title, infraRaw.title),
    desc: mergeLocalized(base.infrastructure.desc, infraRaw.desc),
    image: infraImg,
    imageFallback: inferImageFallback(infraImg, infraRaw.imageFallback ?? (infraRaw.image ? void 0 : base.infrastructure.imageFallback)),
    imageAlt: mergeLocalized(base.infrastructure.imageAlt, infraRaw.imageAlt),
    features: infraFeatures
  };
  const srcRaw = raw.sourcing && typeof raw.sourcing === "object" ? raw.sourcing : {};
  const sourcingRows = Array.isArray(srcRaw.rows) ? srcRaw.rows.map((row, idx) => {
    const prev = base.sourcing.rows.find((b) => b.id === row?.id) || base.sourcing.rows[idx];
    return {
      id: sanitizeId(row?.id, prev?.id || `sourcing-${idx + 1}`),
      label: mergeLocalized(prev?.label, row?.label),
      value: mergeLocalized(prev?.value, row?.value)
    };
  }) : base.sourcing.rows.map((r) => ({ ...r }));
  const sourcing = {
    label: mergeLocalized(base.sourcing.label, srcRaw.label),
    title: mergeLocalized(base.sourcing.title, srcRaw.title),
    desc: mergeLocalized(base.sourcing.desc, srcRaw.desc),
    rows: sourcingRows
  };
  const gsRaw = raw.gallerySection && typeof raw.gallerySection === "object" ? raw.gallerySection : {};
  const gallerySection = {
    label: mergeLocalized(base.gallerySection.label, gsRaw.label),
    title: mergeLocalized(base.gallerySection.title, gsRaw.title),
    desc: mergeLocalized(base.gallerySection.desc, gsRaw.desc)
  };
  let gallery;
  if (Array.isArray(raw.gallery)) {
    const usedIds = /* @__PURE__ */ new Set();
    gallery = raw.gallery.map((item, idx) => {
      const prev = base.gallery.find((g) => g.id === item?.id);
      let id = sanitizeId(item?.id, `gallery-item-${idx + 1}`);
      while (usedIds.has(id)) {
        id = `${id}-${idx + 1}`;
      }
      usedIds.add(id);
      const rawImage = typeof item?.image === "string" ? item.image.trim() : "";
      const image = isSafeAboutImageUrl(rawImage) ? rawImage : prev?.image || "";
      const explicitFallback = item?.imageFallback;
      const imageFallback = image ? inferImageFallback(image, explicitFallback ?? (rawImage && rawImage === prev?.image ? prev?.imageFallback : void 0)) : void 0;
      const sortOrder = Number.isFinite(Number(item?.sortOrder)) ? Number(item.sortOrder) : idx + 1;
      return {
        id,
        image,
        ...imageFallback ? { imageFallback } : {},
        category: sanitizeCategory(item?.category, prev?.category || "factory"),
        label: mergeLocalized(prev?.label, item?.label),
        title: mergeLocalized(prev?.title, item?.title),
        description: mergeLocalized(prev?.description, item?.description),
        alt: mergeLocalized(prev?.alt, item?.alt),
        sortOrder,
        visible: item?.visible !== void 0 ? Boolean(item.visible) : true
      };
    }).sort((a, b) => a.sortOrder - b.sortOrder).map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
  } else {
    gallery = base.gallery.map((g, idx) => ({ ...g, sortOrder: idx + 1 }));
  }
  return {
    hero,
    story,
    visionMission,
    highlightVisual,
    metrics,
    milestones,
    infrastructure,
    sourcing,
    gallerySection,
    gallery
  };
}
function validateAboutContent(input, existing) {
  const errors = [];
  const raw = input && typeof input === "object" ? input : {};
  if (raw.highlightVisual?.image !== void 0 && !isSafeAboutImageUrl(raw.highlightVisual.image)) {
    errors.push("\u0110\u01B0\u1EDDng d\u1EABn \u1EA3nh n\u1ED5i b\u1EADt (highlightVisual.image) kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c ch\u1EE9a giao th\u1EE9c kh\xF4ng an to\xE0n.");
  }
  if (raw.infrastructure?.image !== void 0 && !isSafeAboutImageUrl(raw.infrastructure.image)) {
    errors.push("\u0110\u01B0\u1EDDng d\u1EABn \u1EA3nh nh\xE0 m\xE1y (infrastructure.image) kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c ch\u1EE9a giao th\u1EE9c kh\xF4ng an to\xE0n.");
  }
  if (Array.isArray(raw.gallery)) {
    const seenIds = /* @__PURE__ */ new Set();
    raw.gallery.forEach((item, idx) => {
      const labelIdx = `\u1EA2nh th\u01B0 vi\u1EC7n #${idx + 1}`;
      if (!item || typeof item !== "object") {
        errors.push(`${labelIdx}: \u0110\u1ECBnh d\u1EA1ng b\u1EA3n ghi kh\xF4ng h\u1EE3p l\u1EC7.`);
        return;
      }
      if (!isSafeAboutImageUrl(item.image)) {
        errors.push(`${labelIdx}: \u0110\u01B0\u1EDDng d\u1EABn \u1EA3nh (image) kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c kh\xF4ng \u0111\u01B0\u1EE3c ph\xE9p.`);
      }
      if (item.imageFallback && !isSafeAboutImageUrl(item.imageFallback)) {
        errors.push(`${labelIdx}: \u0110\u01B0\u1EDDng d\u1EABn \u1EA3nh d\u1EF1 ph\xF2ng (imageFallback) kh\xF4ng h\u1EE3p l\u1EC7.`);
      }
      if (typeof item.category === "string" && !ABOUT_GALLERY_CATEGORIES.includes(item.category.trim())) {
        errors.push(`${labelIdx}: Danh m\u1EE5c "${item.category}" kh\xF4ng n\u1EB1m trong danh s\xE1ch cho ph\xE9p.`);
      }
      const id = sanitizeId(item.id, "");
      if (!id) {
        errors.push(`${labelIdx}: Thi\u1EBFu m\xE3 \u0111\u1ECBnh danh (id).`);
      } else if (seenIds.has(id)) {
        errors.push(`${labelIdx}: Tr\xF9ng m\xE3 \u0111\u1ECBnh danh "${id}".`);
      } else {
        seenIds.add(id);
      }
      const titleVi = typeof item.title?.vi === "string" ? item.title.vi.trim() : "";
      const titleEn = typeof item.title?.en === "string" ? item.title.en.trim() : "";
      if (!titleVi && !titleEn) {
        errors.push(`${labelIdx}: C\u1EA7n nh\u1EADp \xEDt nh\u1EA5t ti\xEAu \u0111\u1EC1 ti\u1EBFng Vi\u1EC7t ho\u1EB7c ti\u1EBFng Anh.`);
      }
      const labelVi = typeof item.label?.vi === "string" ? item.label.vi.trim() : "";
      const labelEn = typeof item.label?.en === "string" ? item.label.en.trim() : "";
      if (!labelVi && !labelEn) {
        errors.push(`${labelIdx}: C\u1EA7n nh\u1EADp \xEDt nh\u1EA5t nh\xE3n hi\u1EC3n th\u1ECB ti\u1EBFng Vi\u1EC7t ho\u1EB7c ti\u1EBFng Anh.`);
      }
    });
  }
  const base = existing || {
    hero: { badge: EMPTY_LOCALIZED_TEXT, title: EMPTY_LOCALIZED_TEXT, subtitle: EMPTY_LOCALIZED_TEXT },
    story: { label: EMPTY_LOCALIZED_TEXT, titleLine1: EMPTY_LOCALIZED_TEXT, titleLine2: EMPTY_LOCALIZED_TEXT, description: EMPTY_LOCALIZED_TEXT },
    visionMission: {
      enabled: false,
      label: EMPTY_LOCALIZED_TEXT,
      visionTitle: EMPTY_LOCALIZED_TEXT,
      visionDesc: EMPTY_LOCALIZED_TEXT,
      missionTitle: EMPTY_LOCALIZED_TEXT,
      missionDesc: EMPTY_LOCALIZED_TEXT,
      coreValuesTitle: EMPTY_LOCALIZED_TEXT,
      coreValuesDesc: EMPTY_LOCALIZED_TEXT
    },
    highlightVisual: {
      image: "/assets/images/factory/factory-quality-sorting.webp",
      imageFallback: "/assets/images/factory/factory-quality-sorting.jpg",
      overlayTag: EMPTY_LOCALIZED_TEXT,
      overlayLine1: EMPTY_LOCALIZED_TEXT,
      overlayLine2: EMPTY_LOCALIZED_TEXT,
      alt: EMPTY_LOCALIZED_TEXT
    },
    metrics: [],
    milestones: [],
    infrastructure: {
      label: EMPTY_LOCALIZED_TEXT,
      title: EMPTY_LOCALIZED_TEXT,
      desc: EMPTY_LOCALIZED_TEXT,
      image: "/assets/images/factory/factory-fresh-prep.webp",
      imageFallback: "/assets/images/factory/factory-fresh-prep.jpg",
      imageAlt: EMPTY_LOCALIZED_TEXT,
      features: []
    },
    sourcing: { label: EMPTY_LOCALIZED_TEXT, title: EMPTY_LOCALIZED_TEXT, desc: EMPTY_LOCALIZED_TEXT, rows: [] },
    gallerySection: { label: EMPTY_LOCALIZED_TEXT, title: EMPTY_LOCALIZED_TEXT, desc: EMPTY_LOCALIZED_TEXT },
    gallery: []
  };
  const merged = mergeAboutContent(base, raw);
  return {
    valid: errors.length === 0,
    errors,
    data: merged
  };
}

// src/shared/catalogCategories.ts
var CATALOG_CATEGORIES = [
  {
    id: "soft-dried",
    slug: "soft-dried",
    name: {
      vi: "Tr\xE1i c\xE2y s\u1EA5y d\u1EBBo",
      en: "Soft-Dried Fruits",
      ko: "\uC18C\uD504\uD2B8 \uAC74\uC870 \uACFC\uC77C",
      zh: "\u8F6F\u70D8\u5E72\u679C"
    },
    description: {
      vi: "Ch\u1EBF bi\u1EBFn b\u1EB1ng c\xF4ng ngh\u1EC7 s\u1EA5y b\u01A1m nhi\u1EC7t nhi\u1EC7t \u0111\u1ED9 th\u1EA5p gi\xFAp gi\u1EEF k\u1EBFt c\u1EA5u d\u1EBBo m\u1EC1m v\xE0 h\u01B0\u01A1ng v\u1ECB \u0111\u1EB7c tr\u01B0ng c\u1EE7a t\u1EEBng lo\u1EA1i tr\xE1i c\xE2y.",
      en: "Processed via low-temperature heat-pump dehydration to preserve soft, chewy fruit texture and tropical aroma by SKU.",
      ko: "\uC800\uC628 \uD788\uD2B8\uD38C\uD504 \uAC74\uC870\uB85C \uD488\uBAA9\uBCC4 \uBD80\uB4DC\uB7FD\uACE0 \uCAC4\uAE43\uD55C \uC2DD\uAC10\uACFC \uC5F4\uB300 \uACFC\uC77C \uD48D\uBBF8\uB97C \uC720\uC9C0\uD569\uB2C8\uB2E4.",
      zh: "\u91C7\u7528\u4F4E\u6E29\u70ED\u6CF5\u5FAA\u73AF\u70D8\u5E72\u5DE5\u827A\uFF0C\u4F9D\u636E\u5404\u679C\u54C1\u7279\u70B9\u4FDD\u7559\u67D4\u97E7\u53E3\u611F\u4E0E\u6D53\u90C1\u679C\u9999\u3002"
    },
    image: "/assets/images/hero_fruits.webp",
    imageFallback: "/assets/images/hero_fruits.jpg",
    visible: true,
    sortOrder: 1
  },
  {
    id: "chips",
    slug: "chips",
    name: {
      vi: "Tr\xE1i c\xE2y s\u1EA5y gi\xF2n",
      en: "Crispy Dried Fruits",
      ko: "\uD06C\uB9AC\uC2A4\uD53C \uACFC\uC77C \uCE69",
      zh: "\u9999\u8106\u679C\u5E72\u7247"
    },
    description: {
      vi: "C\xE1c d\xF2ng l\xE1t tr\xE1i c\xE2y s\u1EA5y gi\xF2n v\xE0 chi\xEAn s\u1EA5y ch\xE2n kh\xF4ng nhi\u1EC7t \u0111\u1ED9 th\u1EA5p k\u1EBFt h\u1EE3p ly t\xE2m t\xE1ch d\u1EA7u, \u0111\u1ED9 \u1EA9m th\u1EA5p d\u01B0\u1EDBi 5%.",
      en: "Crispy fruit chips processed via low-temperature vacuum crisping and centrifugal de-oiling with moisture below 5%.",
      ko: "\uC800\uC628 \uC9C4\uACF5 \uAC74\uC870 \uBC0F \uC6D0\uC2EC \uD0C8\uC720 \uACF5\uC815\uC744 \uC801\uC6A9\uD574 \uC218\uBD84 5% \uBBF8\uB9CC\uC758 \uBC14\uC0AD\uD55C \uC2DD\uAC10\uC744 \uAD6C\uD604\uD55C \uACFC\uC77C \uCE69 \uC81C\uD488\uAD70\uC785\uB2C8\uB2E4.",
      zh: "\u91C7\u7528\u4F4E\u6E29\u771F\u7A7A\u8106\u5316\u4E0E\u79BB\u5FC3\u8131\u6CB9\u5DE5\u827A\u5236\u6210\u7684\u6C34\u679C\u8106\u7247\u7CFB\u5217\uFF0C\u6210\u54C1\u6C34\u5206\u542B\u91CF\u4F4E\u4E8E 5%\u3002"
    },
    image: "/images/products/banana-chips.webp",
    imageFallback: "/images/products/banana-chips.jpg",
    visible: true,
    sortOrder: 2
  },
  {
    id: "nuts-seeds",
    slug: "nuts-seeds",
    name: {
      vi: "H\u1EA1t dinh d\u01B0\u1EE1ng",
      en: "Nuts & Seeds",
      ko: "\uACAC\uACFC\uB958 \uBC0F \uC5F0\uC790\uC721",
      zh: "\u575A\u679C\u4E0E\u83B2\u5B50"
    },
    description: {
      vi: "H\u1EA1t \u0111i\u1EC1u, m\u1EAFc ca, \xF3c ch\xF3 v\xE0 h\u1EA1t sen \u0111\u01B0\u1EE3c tuy\u1EC3n ch\u1ECDn theo v\xF9ng nguy\xEAn li\u1EC7u v\xE0 rang/s\u1EA5y ph\xF9 h\u1EE3p t\u1EEBng lo\u1EA1i h\u1EA1t.",
      en: "Cashew, macadamia, walnuts, and lotus seeds sourced by regional origin with roasting or drying tailored to each kernel.",
      ko: "\uC0B0\uC9C0\uBCC4\uB85C \uC5C4\uC120\uD55C \uCE90\uC288\uB11B\xB7\uB9C8\uCE74\uB2E4\uBBF8\uC544\xB7\uD638\uB450\xB7\uC5F0\uC790\uC721\uC744 \uC6D0\uBB3C \uD2B9\uC131\uC5D0 \uB9DE\uAC8C \uB85C\uC2A4\uD305\xB7\uAC74\uC870\uD558\uC5EC \uACF5\uAE09\uD569\uB2C8\uB2E4.",
      zh: "\u4E25\u9009\u4F18\u8D28\u4EA7\u533A\u8170\u679C\u3001\u590F\u5A01\u5937\u679C\u3001\u6838\u6843\u4E0E\u83B2\u5B50\uFF0C\u6309\u4E0D\u540C\u575A\u679C\u7279\u6027\u5339\u914D\u70D8\u7119\u6216\u5E72\u71E5\u5DE5\u827A\u3002"
    },
    image: "/images/products/cashew.webp",
    imageFallback: "/images/products/cashew.jpg",
    visible: true,
    sortOrder: 3
  },
  {
    id: "mixed",
    slug: "mixed",
    name: {
      vi: "S\u1EA3n ph\u1EA9m th\u1EADp c\u1EA9m",
      en: "Mixed Products",
      ko: "\uBAA8\uB4EC \uC81C\uD488",
      zh: "\u7EFC\u5408\u4EA7\u54C1"
    },
    description: {
      vi: "Ph\u1ED1i tr\u1ED9n \u0111a d\u1EA1ng tr\xE1i c\xE2y v\xE0 rau c\u1EE7 Vi\u1EC7t Nam s\u1EA5y gi\xF2n ch\xE2n kh\xF4ng ph\u1EE5c v\u1EE5 k\xEAnh b\xE1n l\u1EBB, food-service v\xE0 OEM.",
      en: "Vacuum-dried blends of Vietnamese tropical fruits and vegetables tailored for retail, food-service, and OEM.",
      ko: "\uB2E4\uC591\uD55C \uBCA0\uD2B8\uB0A8 \uC5F4\uB300 \uACFC\uC77C\uACFC \uBFCC\uB9AC\uCC44\uC18C\uB97C \uC800\uC628 \uC9C4\uACF5 \uAC74\uC870\uB85C \uBE14\uB80C\uB529\uD55C \uBAA8\uB4EC \uC81C\uD488\uAD70\uC785\uB2C8\uB2E4.",
      zh: "\u7CBE\u9009\u591A\u79CD\u8D8A\u5357\u70ED\u5E26\u6C34\u679C\u4E0E\u6839\u830E\u852C\u83DC\u7ECF\u771F\u7A7A\u8106\u5316\u62FC\u914D\uFF0C\u5E7F\u6CDB\u9002\u914D\u5546\u8D85\u53CA OEM \u6E20\u9053\u3002"
    },
    image: "/images/products/mix-fruits-and-vegetables.webp",
    imageFallback: "/images/products/mix-fruits-and-vegetables.jpg",
    visible: true,
    sortOrder: 4
  }
];
var VALID_CATALOG_CATEGORY_IDS = CATALOG_CATEGORIES.map((c) => c.id);

// src/shared/schemas/homepageSchema.ts
var ALLOWED_HOMEPAGE_LINK_TYPES = [
  "category",
  "product",
  "page",
  "contact",
  "quote"
];
var DEFAULT_SECTION_ORDER = [
  "hero",
  "about",
  "categories",
  "featuredProducts",
  "productionOem",
  "qualityCerts",
  "exportMarkets",
  "news",
  "closingCta"
];
function mergeLoc(base, incoming) {
  const prev = base || EMPTY_LOCALIZED_TEXT;
  if (typeof incoming === "string") {
    return { ...prev, vi: incoming.trim() };
  }
  if (!incoming || typeof incoming !== "object") {
    return { ...prev };
  }
  const src = incoming;
  return {
    vi: typeof src.vi === "string" ? src.vi.trim() : prev.vi,
    en: typeof src.en === "string" ? src.en.trim() : prev.en,
    ko: typeof src.ko === "string" ? src.ko.trim() : prev.ko,
    zh: typeof src.zh === "string" ? src.zh.trim() : prev.zh
  };
}
function sanitizeInternalPath(raw, fallback) {
  if (typeof raw !== "string") return fallback;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("..")) {
    return fallback;
  }
  return trimmed;
}
function sanitizeCardId(raw, fallback) {
  if (typeof raw !== "string") return fallback;
  const cleaned = raw.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || fallback;
}
function inferAssetsFallback(img, explicit) {
  if (typeof explicit === "string" && isSafeAboutImageUrl(explicit)) {
    return explicit.trim();
  }
  if ((img.startsWith("/assets/") || img.startsWith("/images/")) && img.toLowerCase().endsWith(".webp")) {
    return img.slice(0, -5) + ".jpg";
  }
  return void 0;
}
function sanitizeCategoryCardList(rawList, fallbackList, defaultLinkType) {
  if (!Array.isArray(rawList)) {
    return fallbackList.map((c, idx) => ({ ...c, sortOrder: idx + 1 }));
  }
  const usedIds = /* @__PURE__ */ new Set();
  return rawList.map((item, idx) => {
    const prev = fallbackList.find((f) => f.id === item?.id) || fallbackList[idx];
    let id = sanitizeCardId(item?.id, prev?.id || `cat-${idx + 1}`);
    while (usedIds.has(id)) {
      id = `${id}-${idx + 1}`;
    }
    usedIds.add(id);
    const rawImg = typeof item?.image === "string" ? item.image.trim() : "";
    const image = isSafeAboutImageUrl(rawImg) ? rawImg : prev?.image || "";
    const imageFallback = image ? inferAssetsFallback(image, item?.imageFallback ?? (rawImg === prev?.image ? prev?.imageFallback : void 0)) : void 0;
    const rawLinkType = typeof item?.linkType === "string" ? item.linkType.trim() : "";
    const linkType = ALLOWED_HOMEPAGE_LINK_TYPES.includes(rawLinkType) ? rawLinkType : prev?.linkType || defaultLinkType;
    const targetValue = typeof item?.targetValue === "string" ? item.targetValue.trim() : prev?.targetValue || id;
    const sortOrder = Number.isFinite(Number(item?.sortOrder)) ? Number(item.sortOrder) : idx + 1;
    return {
      id,
      linkType,
      targetValue,
      name: mergeLoc(prev?.name, item?.name),
      description: mergeLoc(prev?.description, item?.description),
      ...prev?.badge || item?.badge ? { badge: mergeLoc(prev?.badge, item?.badge) } : {},
      ...prev?.ctaLabel || item?.ctaLabel ? { ctaLabel: mergeLoc(prev?.ctaLabel, item?.ctaLabel) } : {},
      image,
      ...imageFallback ? { imageFallback } : {},
      visible: item?.visible !== void 0 ? Boolean(item.visible) : prev?.visible ?? true,
      sortOrder
    };
  }).sort((a, b) => a.sortOrder - b.sortOrder).map((c, idx) => ({ ...c, sortOrder: idx + 1 }));
}
var EMPTY_HOMEPAGE_BASE = {
  sections: {
    hero: true,
    about: true,
    categories: true,
    featuredProducts: true,
    productionOem: true,
    qualityCerts: true,
    exportMarkets: true,
    news: true,
    closingCta: true
  },
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  hero: {
    eyebrow: { ...EMPTY_LOCALIZED_TEXT },
    headlineLine1: { ...EMPTY_LOCALIZED_TEXT },
    headlineLine2: { ...EMPTY_LOCALIZED_TEXT },
    headlineHighlight: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    primaryCtaLabel: { ...EMPTY_LOCALIZED_TEXT },
    primaryCtaLink: "/products",
    secondaryCtaLabel: { ...EMPTY_LOCALIZED_TEXT },
    primaryImage: "/assets/images/hero-brochure-mango.webp",
    primaryImageFallback: "/assets/images/hero-brochure-mango.jpg",
    primaryImageAlt: { ...EMPTY_LOCALIZED_TEXT },
    secondaryImage: "/assets/images/hero-brochure-dragonfruit.webp",
    secondaryImageFallback: "/assets/images/hero-brochure-dragonfruit.jpg",
    secondaryImageAlt: { ...EMPTY_LOCALIZED_TEXT }
  },
  about: {
    label: { ...EMPTY_LOCALIZED_TEXT },
    titleLine1: { ...EMPTY_LOCALIZED_TEXT },
    titleLine2: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    ctaLabel: { ...EMPTY_LOCALIZED_TEXT },
    ctaLink: "/about",
    image: "/assets/images/factory/factory-quality-sorting.webp",
    imageFallback: "/assets/images/factory/factory-quality-sorting.jpg",
    imageAlt: { ...EMPTY_LOCALIZED_TEXT }
  },
  categoriesSection: {
    label: { ...EMPTY_LOCALIZED_TEXT },
    title: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    oemLinesHeading: { ...EMPTY_LOCALIZED_TEXT },
    oemLinesDesc: { ...EMPTY_LOCALIZED_TEXT }
  },
  catalogCategoryCards: [],
  oemProductLines: [],
  featuredProductsSection: {
    label: { ...EMPTY_LOCALIZED_TEXT },
    title: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    viewAllLabel: { ...EMPTY_LOCALIZED_TEXT },
    maxItems: 4
  },
  featuredProductSlugs: [],
  productionOem: {
    label: { ...EMPTY_LOCALIZED_TEXT },
    title: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    bullets: [],
    image: "/assets/images/factory-2026/factory-featured.webp",
    imageFallback: "/assets/images/factory-2026/factory-featured.jpg",
    imageAlt: { ...EMPTY_LOCALIZED_TEXT },
    primaryCtaLabel: { ...EMPTY_LOCALIZED_TEXT },
    secondaryCtaLabel: { ...EMPTY_LOCALIZED_TEXT },
    secondaryCtaLink: "/about#factory-gallery"
  },
  qualityCerts: {
    label: { ...EMPTY_LOCALIZED_TEXT },
    title: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    scopeNote: { ...EMPTY_LOCALIZED_TEXT },
    ctaLabel: { ...EMPTY_LOCALIZED_TEXT },
    ctaLink: "/quality#certificates"
  },
  exportMarkets: {
    label: { ...EMPTY_LOCALIZED_TEXT },
    titleLine1: { ...EMPTY_LOCALIZED_TEXT },
    titleLine2: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    ctaLabel: { ...EMPTY_LOCALIZED_TEXT },
    ctaLink: "/markets"
  },
  newsSection: {
    label: { ...EMPTY_LOCALIZED_TEXT },
    titleLine1: { ...EMPTY_LOCALIZED_TEXT },
    titleLine2: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    viewAllLabel: { ...EMPTY_LOCALIZED_TEXT },
    maxItems: 3
  },
  closingCta: {
    eyebrow: { ...EMPTY_LOCALIZED_TEXT },
    title: { ...EMPTY_LOCALIZED_TEXT },
    description: { ...EMPTY_LOCALIZED_TEXT },
    primaryLabel: { ...EMPTY_LOCALIZED_TEXT },
    secondaryLabel: { ...EMPTY_LOCALIZED_TEXT },
    secondaryLink: "/contact",
    brochureLabel: { ...EMPTY_LOCALIZED_TEXT },
    brochureLink: "/brochure"
  }
};
function mergeHomepageContent(baseInput, incoming) {
  const base = baseInput || EMPTY_HOMEPAGE_BASE;
  const raw = incoming && typeof incoming === "object" ? incoming : {};
  const rawSec = raw.sections && typeof raw.sections === "object" ? raw.sections : {};
  const sections = {
    hero: typeof rawSec.hero === "boolean" ? rawSec.hero : base.sections.hero,
    about: typeof rawSec.about === "boolean" ? rawSec.about : base.sections.about,
    categories: typeof rawSec.categories === "boolean" ? rawSec.categories : base.sections.categories,
    featuredProducts: typeof rawSec.featuredProducts === "boolean" ? rawSec.featuredProducts : base.sections.featuredProducts,
    productionOem: typeof rawSec.productionOem === "boolean" ? rawSec.productionOem : base.sections.productionOem,
    qualityCerts: typeof rawSec.qualityCerts === "boolean" ? rawSec.qualityCerts : base.sections.qualityCerts,
    exportMarkets: typeof rawSec.exportMarkets === "boolean" ? rawSec.exportMarkets : base.sections.exportMarkets,
    news: typeof rawSec.news === "boolean" ? rawSec.news : base.sections.news,
    closingCta: typeof rawSec.closingCta === "boolean" ? rawSec.closingCta : base.sections.closingCta
  };
  let sectionOrder = [...base.sectionOrder];
  if (Array.isArray(raw.sectionOrder) && raw.sectionOrder.length > 0) {
    const validSet = /* @__PURE__ */ new Set();
    for (const k of raw.sectionOrder) {
      if (typeof k === "string" && DEFAULT_SECTION_ORDER.includes(k)) {
        validSet.add(k);
      }
    }
    for (const defKey of DEFAULT_SECTION_ORDER) {
      validSet.add(defKey);
    }
    sectionOrder = Array.from(validSet);
  }
  const hRaw = raw.hero && typeof raw.hero === "object" ? raw.hero : {};
  const hPrimImg = typeof hRaw.primaryImage === "string" && isSafeAboutImageUrl(hRaw.primaryImage) ? hRaw.primaryImage.trim() : base.hero.primaryImage;
  const hSecImg = typeof hRaw.secondaryImage === "string" && isSafeAboutImageUrl(hRaw.secondaryImage) ? hRaw.secondaryImage.trim() : base.hero.secondaryImage;
  const hero = {
    eyebrow: mergeLoc(base.hero.eyebrow, hRaw.eyebrow),
    headlineLine1: mergeLoc(base.hero.headlineLine1, hRaw.headlineLine1),
    headlineLine2: mergeLoc(base.hero.headlineLine2, hRaw.headlineLine2),
    headlineHighlight: mergeLoc(base.hero.headlineHighlight, hRaw.headlineHighlight),
    description: mergeLoc(base.hero.description, hRaw.description),
    primaryCtaLabel: mergeLoc(base.hero.primaryCtaLabel, hRaw.primaryCtaLabel),
    primaryCtaLink: sanitizeInternalPath(hRaw.primaryCtaLink, base.hero.primaryCtaLink),
    secondaryCtaLabel: mergeLoc(base.hero.secondaryCtaLabel, hRaw.secondaryCtaLabel),
    primaryImage: hPrimImg,
    primaryImageFallback: inferAssetsFallback(hPrimImg, hRaw.primaryImageFallback ?? base.hero.primaryImageFallback),
    primaryImageAlt: mergeLoc(base.hero.primaryImageAlt, hRaw.primaryImageAlt),
    secondaryImage: hSecImg,
    secondaryImageFallback: inferAssetsFallback(hSecImg, hRaw.secondaryImageFallback ?? base.hero.secondaryImageFallback),
    secondaryImageAlt: mergeLoc(base.hero.secondaryImageAlt, hRaw.secondaryImageAlt)
  };
  const aRaw = raw.about && typeof raw.about === "object" ? raw.about : {};
  const aImg = typeof aRaw.image === "string" && isSafeAboutImageUrl(aRaw.image) ? aRaw.image.trim() : base.about.image;
  const about = {
    label: mergeLoc(base.about.label, aRaw.label),
    titleLine1: mergeLoc(base.about.titleLine1, aRaw.titleLine1),
    titleLine2: mergeLoc(base.about.titleLine2, aRaw.titleLine2),
    description: mergeLoc(base.about.description, aRaw.description),
    ctaLabel: mergeLoc(base.about.ctaLabel, aRaw.ctaLabel),
    ctaLink: sanitizeInternalPath(aRaw.ctaLink, base.about.ctaLink),
    image: aImg,
    imageFallback: inferAssetsFallback(aImg, aRaw.imageFallback ?? base.about.imageFallback),
    imageAlt: mergeLoc(base.about.imageAlt, aRaw.imageAlt)
  };
  const csRaw = raw.categoriesSection && typeof raw.categoriesSection === "object" ? raw.categoriesSection : {};
  const categoriesSection = {
    label: mergeLoc(base.categoriesSection.label, csRaw.label),
    title: mergeLoc(base.categoriesSection.title, csRaw.title),
    description: mergeLoc(base.categoriesSection.description, csRaw.description),
    oemLinesHeading: mergeLoc(base.categoriesSection.oemLinesHeading, csRaw.oemLinesHeading),
    oemLinesDesc: mergeLoc(base.categoriesSection.oemLinesDesc, csRaw.oemLinesDesc)
  };
  const catalogCategoryCards = sanitizeCategoryCardList(
    raw.catalogCategoryCards,
    base.catalogCategoryCards,
    "category"
  );
  const oemProductLines = sanitizeCategoryCardList(
    raw.oemProductLines,
    base.oemProductLines,
    "quote"
  );
  const fpRaw = raw.featuredProductsSection && typeof raw.featuredProductsSection === "object" ? raw.featuredProductsSection : {};
  const rawMaxFeat = Number(fpRaw.maxItems);
  const featuredMaxItems = Number.isFinite(rawMaxFeat) ? Math.max(1, Math.min(4, Math.floor(rawMaxFeat))) : base.featuredProductsSection.maxItems;
  const featuredProductsSection = {
    label: mergeLoc(base.featuredProductsSection.label, fpRaw.label),
    title: mergeLoc(base.featuredProductsSection.title, fpRaw.title),
    description: mergeLoc(base.featuredProductsSection.description, fpRaw.description),
    viewAllLabel: mergeLoc(base.featuredProductsSection.viewAllLabel, fpRaw.viewAllLabel),
    maxItems: featuredMaxItems
  };
  let featuredProductSlugs = [...base.featuredProductSlugs].slice(0, 4);
  if (Array.isArray(raw.featuredProductSlugs)) {
    const deduped = [];
    for (const s of raw.featuredProductSlugs) {
      if (typeof s === "string" && s.trim() && !deduped.includes(s.trim())) {
        deduped.push(s.trim());
      }
      if (deduped.length >= 4) break;
    }
    featuredProductSlugs = deduped;
  }
  const pRaw = raw.productionOem && typeof raw.productionOem === "object" ? raw.productionOem : {};
  const pImg = typeof pRaw.image === "string" && isSafeAboutImageUrl(pRaw.image) ? pRaw.image.trim() : base.productionOem.image;
  const bullets = Array.isArray(pRaw.bullets) && pRaw.bullets.length > 0 ? pRaw.bullets.map((b, idx) => mergeLoc(base.productionOem.bullets[idx], b)) : base.productionOem.bullets.map((b) => ({ ...b }));
  const productionOem = {
    label: mergeLoc(base.productionOem.label, pRaw.label),
    title: mergeLoc(base.productionOem.title, pRaw.title),
    description: mergeLoc(base.productionOem.description, pRaw.description),
    bullets,
    image: pImg,
    imageFallback: inferAssetsFallback(pImg, pRaw.imageFallback ?? base.productionOem.imageFallback),
    imageAlt: mergeLoc(base.productionOem.imageAlt, pRaw.imageAlt),
    primaryCtaLabel: mergeLoc(base.productionOem.primaryCtaLabel, pRaw.primaryCtaLabel),
    secondaryCtaLabel: mergeLoc(base.productionOem.secondaryCtaLabel, pRaw.secondaryCtaLabel),
    secondaryCtaLink: sanitizeInternalPath(pRaw.secondaryCtaLink, base.productionOem.secondaryCtaLink)
  };
  const qRaw = raw.qualityCerts && typeof raw.qualityCerts === "object" ? raw.qualityCerts : {};
  const qualityCerts = {
    label: mergeLoc(base.qualityCerts.label, qRaw.label),
    title: mergeLoc(base.qualityCerts.title, qRaw.title),
    description: mergeLoc(base.qualityCerts.description, qRaw.description),
    scopeNote: mergeLoc(base.qualityCerts.scopeNote, qRaw.scopeNote),
    ctaLabel: mergeLoc(base.qualityCerts.ctaLabel, qRaw.ctaLabel),
    ctaLink: sanitizeInternalPath(qRaw.ctaLink, base.qualityCerts.ctaLink)
  };
  const eRaw = raw.exportMarkets && typeof raw.exportMarkets === "object" ? raw.exportMarkets : {};
  const exportMarkets = {
    label: mergeLoc(base.exportMarkets.label, eRaw.label),
    titleLine1: mergeLoc(base.exportMarkets.titleLine1, eRaw.titleLine1),
    titleLine2: mergeLoc(base.exportMarkets.titleLine2, eRaw.titleLine2),
    description: mergeLoc(base.exportMarkets.description, eRaw.description),
    ctaLabel: mergeLoc(base.exportMarkets.ctaLabel, eRaw.ctaLabel),
    ctaLink: sanitizeInternalPath(eRaw.ctaLink, base.exportMarkets.ctaLink)
  };
  const nRaw = raw.newsSection && typeof raw.newsSection === "object" ? raw.newsSection : {};
  const rawNewsMax = Number(nRaw.maxItems);
  const newsSection = {
    label: mergeLoc(base.newsSection.label, nRaw.label),
    titleLine1: mergeLoc(base.newsSection.titleLine1, nRaw.titleLine1),
    titleLine2: mergeLoc(base.newsSection.titleLine2, nRaw.titleLine2),
    description: mergeLoc(base.newsSection.description, nRaw.description),
    viewAllLabel: mergeLoc(base.newsSection.viewAllLabel, nRaw.viewAllLabel),
    maxItems: Number.isFinite(rawNewsMax) ? Math.max(1, Math.min(6, Math.floor(rawNewsMax))) : base.newsSection.maxItems
  };
  const cRaw = raw.closingCta && typeof raw.closingCta === "object" ? raw.closingCta : {};
  const closingCta = {
    eyebrow: mergeLoc(base.closingCta.eyebrow, cRaw.eyebrow),
    title: mergeLoc(base.closingCta.title, cRaw.title),
    description: mergeLoc(base.closingCta.description, cRaw.description),
    primaryLabel: mergeLoc(base.closingCta.primaryLabel, cRaw.primaryLabel),
    secondaryLabel: mergeLoc(base.closingCta.secondaryLabel, cRaw.secondaryLabel),
    secondaryLink: sanitizeInternalPath(cRaw.secondaryLink, base.closingCta.secondaryLink),
    brochureLabel: mergeLoc(base.closingCta.brochureLabel, cRaw.brochureLabel),
    brochureLink: sanitizeInternalPath(cRaw.brochureLink, base.closingCta.brochureLink)
  };
  return {
    sections,
    sectionOrder,
    hero,
    about,
    categoriesSection,
    catalogCategoryCards,
    oemProductLines,
    featuredProductsSection,
    featuredProductSlugs,
    productionOem,
    qualityCerts,
    exportMarkets,
    newsSection,
    closingCta
  };
}
function validateHomepageContent(input, existing, validProductSlugs) {
  const base = existing || EMPTY_HOMEPAGE_BASE;
  const errors = [];
  const raw = input && typeof input === "object" ? input : {};
  const imgFields = [
    ["hero.primaryImage", raw.hero?.primaryImage],
    ["hero.secondaryImage", raw.hero?.secondaryImage],
    ["about.image", raw.about?.image],
    ["productionOem.image", raw.productionOem?.image]
  ];
  for (const [label, val] of imgFields) {
    if (val !== void 0 && !isSafeAboutImageUrl(val)) {
      errors.push(`\u0110\u01B0\u1EDDng d\u1EABn \u1EA3nh "${label}" kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c kh\xF4ng an to\xE0n.`);
    }
  }
  const checkCardGroup = (groupLabel, list) => {
    if (!Array.isArray(list)) return;
    const seenIds = /* @__PURE__ */ new Set();
    list.forEach((item, idx) => {
      const prefix = `${groupLabel} #${idx + 1}`;
      if (!item || typeof item !== "object") {
        errors.push(`${prefix}: \u0110\u1ECBnh d\u1EA1ng kh\xF4ng h\u1EE3p l\u1EC7.`);
        return;
      }
      if (item.image !== void 0 && !isSafeAboutImageUrl(item.image)) {
        errors.push(`${prefix}: \u0110\u01B0\u1EDDng d\u1EABn \u1EA3nh kh\xF4ng h\u1EE3p l\u1EC7.`);
      }
      const id = sanitizeCardId(item.id, "");
      if (!id) {
        errors.push(`${prefix}: Thi\u1EBFu ID.`);
      } else if (seenIds.has(id)) {
        errors.push(`${prefix}: Tr\xF9ng ID "${id}".`);
      } else {
        seenIds.add(id);
      }
      const lt = item.linkType;
      const tv = typeof item.targetValue === "string" ? item.targetValue.trim() : "";
      if (lt !== void 0 && !ALLOWED_HOMEPAGE_LINK_TYPES.includes(lt)) {
        errors.push(`${prefix}: Lo\u1EA1i li\xEAn k\u1EBFt "${lt}" kh\xF4ng h\u1EE3p l\u1EC7.`);
      }
      if (lt === "category" && !VALID_CATALOG_CATEGORY_IDS.includes(tv)) {
        errors.push(`${prefix}: Danh m\u1EE5c \u0111\xEDch "${tv}" kh\xF4ng t\u1ED3n t\u1EA1i trong 4 danh m\u1EE5c chu\u1EA9n (${VALID_CATALOG_CATEGORY_IDS.join(", ")}).`);
      }
      if (lt === "product" && validProductSlugs && validProductSlugs.length > 0 && !validProductSlugs.includes(tv)) {
        errors.push(`${prefix}: S\u1EA3n ph\u1EA9m \u0111\xEDch "${tv}" kh\xF4ng t\u1ED3n t\u1EA1i ho\u1EB7c ch\u01B0a xu\u1EA5t b\u1EA3n.`);
      }
      if (lt === "page" && (!tv.startsWith("/") || tv.startsWith("//") || tv.includes(".."))) {
        errors.push(`${prefix}: \u0110\u01B0\u1EDDng d\u1EABn trang \u0111\xEDch "${tv}" ph\u1EA3i b\u1EAFt \u0111\u1EA7u b\u1EB1ng "/".`);
      }
    });
  };
  checkCardGroup("Danh m\u1EE5c s\u1EA3n ph\u1EA9m", raw.catalogCategoryCards);
  checkCardGroup("D\xF2ng OEM / T\u01B0 v\u1EA5n", raw.oemProductLines);
  if (Array.isArray(raw.featuredProductSlugs)) {
    if (raw.featuredProductSlugs.length > 4) {
      errors.push("Trang ch\u1EE7 ch\u1EC9 cho ph\xE9p ch\u1ECDn t\u1ED1i \u0111a 4 s\u1EA3n ph\u1EA9m ti\xEAu bi\u1EC3u.");
    }
    if (validProductSlugs && validProductSlugs.length > 0) {
      for (const s of raw.featuredProductSlugs) {
        if (typeof s === "string" && s.trim() && !validProductSlugs.includes(s.trim())) {
          errors.push(`S\u1EA3n ph\u1EA9m ti\xEAu bi\u1EC3u "${s}" kh\xF4ng t\u1ED3n t\u1EA1i trong danh m\u1EE5c s\u1EA3n ph\u1EA9m c\xF4ng khai.`);
        }
      }
    }
  }
  const merged = mergeHomepageContent(base, raw);
  return {
    valid: errors.length === 0,
    errors,
    data: merged
  };
}

// server/admin/settings.ts
import fs from "fs";
import path from "path";
var settings_default = wrapHandler(async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Y\xEAu c\u1EA7u \u0111\u0103ng nh\u1EADp qu\u1EA3n tr\u1ECB." });
  }
  const rawSection = req.query?.section;
  const section = rawSection === "brochure" ? "brochure" : rawSection === "about" ? "about" : rawSection === "homepage" ? "homepage" : "company";
  const filePath = `content/settings/${section}.json`;
  const useGitHub = hasGitHubToken();
  if (req.method === "GET") {
    if (useGitHub) {
      const file = await getRepoFile(filePath);
      if (file) {
        return res.status(200).json({ ok: true, data: JSON.parse(file.content), sha: file.sha, source: "github" });
      }
      return res.status(200).json({ ok: true, data: {}, source: "github" });
    }
    const localPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(localPath)) {
      const raw = fs.readFileSync(localPath, "utf-8").replace(/^\uFEFF/, "");
      return res.status(200).json({ ok: true, data: JSON.parse(raw), source: "local" });
    }
    return res.status(200).json({ ok: true, data: {}, source: "empty" });
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
    const incomingData = stripUnsafeKeys(rawBody);
    let validatedData = incomingData;
    let commitMessage = `cms(settings): update ${section} settings`;
    if (section === "brochure") {
      const v = validateBrochureSettings(incomingData);
      if (!v.valid) {
        return res.status(400).json({ error: `D\u1EEF li\u1EC7u c\u1EA5u h\xECnh Brochure kh\xF4ng h\u1EE3p l\u1EC7: ${v.errors.join("; ")}` });
      }
      validatedData = v.data;
    } else if (section === "about") {
      let existingAbout = void 0;
      try {
        if (useGitHub) {
          const existingFile = await getRepoFile(filePath);
          if (existingFile) {
            existingAbout = JSON.parse(existingFile.content);
          }
        } else {
          const localPath = path.join(process.cwd(), filePath);
          if (fs.existsSync(localPath)) {
            existingAbout = JSON.parse(fs.readFileSync(localPath, "utf-8").replace(/^\uFEFF/, ""));
          }
        }
      } catch {
        existingAbout = void 0;
      }
      const v = validateAboutContent(incomingData, existingAbout);
      if (!v.valid) {
        return res.status(400).json({ error: `D\u1EEF li\u1EC7u trang V\u1EC1 ch\xFAng t\xF4i kh\xF4ng h\u1EE3p l\u1EC7: ${v.errors.join("; ")}` });
      }
      validatedData = v.data;
      commitMessage = "cms(about): update about page content & gallery";
    } else if (section === "homepage") {
      let existingHomepage = void 0;
      try {
        if (useGitHub) {
          const existingFile = await getRepoFile(filePath);
          if (existingFile) {
            existingHomepage = JSON.parse(existingFile.content);
          }
        } else {
          const localPath = path.join(process.cwd(), filePath);
          if (fs.existsSync(localPath)) {
            existingHomepage = JSON.parse(fs.readFileSync(localPath, "utf-8").replace(/^\uFEFF/, ""));
          }
        }
      } catch {
        existingHomepage = void 0;
      }
      const validSlugs = [];
      try {
        if (useGitHub) {
          const entries = await listRepoJsonFiles("content/products");
          for (const e of entries) {
            const slug = String(e.data?.slug || e.data?.id || "").trim();
            if (slug) validSlugs.push(slug);
          }
        } else {
          const prodDir = path.join(process.cwd(), "content/products");
          if (fs.existsSync(prodDir)) {
            for (const f of fs.readdirSync(prodDir).filter((n) => n.endsWith(".json"))) {
              try {
                const raw = JSON.parse(fs.readFileSync(path.join(prodDir, f), "utf-8").replace(/^\uFEFF/, ""));
                const slug = String(raw?.slug || raw?.id || "").trim();
                if (slug) validSlugs.push(slug);
              } catch {
              }
            }
          }
        }
      } catch {
      }
      const v = validateHomepageContent(incomingData, existingHomepage, validSlugs.length > 0 ? validSlugs : void 0);
      if (!v.valid) {
        return res.status(400).json({ error: `D\u1EEF li\u1EC7u c\u1EA5u h\xECnh Trang ch\u1EE7 kh\xF4ng h\u1EE3p l\u1EC7: ${v.errors.join("; ")}` });
      }
      validatedData = v.data;
      commitMessage = "cms(homepage): update homepage content & featured configuration";
    } else {
      const v = validateCompanySettings(incomingData);
      if (!v.valid) {
        return res.status(400).json({ error: `D\u1EEF li\u1EC7u c\u1EA5u h\xECnh Doanh nghi\u1EC7p kh\xF4ng h\u1EE3p l\u1EC7: ${v.errors.join("; ")}` });
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
      fs.writeFileSync(localPath, contentStr, "utf-8");
      result = { sha: "local-sha", commitSha: "local-commit" };
    }
    return res.status(200).json({
      ok: true,
      message: "\u0110\xE3 l\u01B0u c\u1EA5u h\xECnh an to\xE0n th\xE0nh c\xF4ng!",
      data: validatedData,
      result
    });
  }
  return res.status(405).json({ error: "Method Not Allowed" });
});
export {
  settings_default as default
};
