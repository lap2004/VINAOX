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
var ALLOWED_SCOPE_TYPES = [
  "product",
  "facility",
  "management-system",
  "registration",
  "audit"
];
function cleanStr(val) {
  return typeof val === "string" ? val.trim() : "";
}
function normalizeProductCertifications(input) {
  if (!Array.isArray(input)) return [];
  const result = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const raw = item;
    const certificateId = cleanStr(raw.certificateId || raw.id);
    const nameVi = cleanStr(raw.nameVi || raw.name_vi || raw.name);
    const nameEn = cleanStr(raw.nameEn || raw.name_en || raw.name) || nameVi;
    if (!certificateId && !nameVi && !nameEn) continue;
    const rawScopeType = cleanStr(raw.scopeType);
    const scopeType = ALLOWED_SCOPE_TYPES.includes(rawScopeType) ? rawScopeType : "product";
    result.push({
      certificateId: certificateId || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      nameVi: nameVi || nameEn,
      nameEn: nameEn || nameVi,
      ...cleanStr(raw.nameKo) ? { nameKo: cleanStr(raw.nameKo) } : {},
      ...cleanStr(raw.nameZh) ? { nameZh: cleanStr(raw.nameZh) } : {},
      scopeType,
      scopeVi: cleanStr(raw.scopeVi) || "Ch\u1EE9ng nh\u1EADn \u0111\xE3 x\xE1c minh",
      scopeEn: cleanStr(raw.scopeEn) || "Verified Certification",
      ...cleanStr(raw.scopeKo) ? { scopeKo: cleanStr(raw.scopeKo) } : {},
      ...cleanStr(raw.scopeZh) ? { scopeZh: cleanStr(raw.scopeZh) } : {},
      ...cleanStr(raw.documentUrl) && isValidUrl(cleanStr(raw.documentUrl), true) ? { documentUrl: cleanStr(raw.documentUrl) } : {}
    });
  }
  return result;
}
function normalizeProductFeatures(input) {
  if (!Array.isArray(input)) return [];
  const result = [];
  for (let i = 0; i < input.length; i++) {
    const item = input[i];
    if (typeof item === "string" && item.trim()) {
      result.push({
        id: `feature-${i + 1}`,
        label: { vi: item.trim(), en: item.trim() }
      });
      continue;
    }
    if (!item || typeof item !== "object") continue;
    const raw = item;
    const lbl = raw.label && typeof raw.label === "object" ? raw.label : raw;
    const vi = cleanStr(lbl.vi || raw.labelVi || raw.vi);
    const en = cleanStr(lbl.en || raw.labelEn || raw.en) || vi;
    const ko = cleanStr(lbl.ko || raw.labelKo || raw.ko);
    const zh = cleanStr(lbl.zh || raw.labelZh || raw.zh);
    if (!vi && !en) continue;
    result.push({
      id: cleanStr(raw.id) || `feature-${i + 1}`,
      label: {
        vi: vi || en,
        en: en || vi,
        ...ko ? { ko } : {},
        ...zh ? { zh } : {}
      }
    });
  }
  return result;
}
function validateProduct(input) {
  const errors = [];
  const raw = typeof input === "object" && input !== null ? input : {};
  const slugCheck = validateSlug(raw.slug || raw.id);
  if (!slugCheck.valid) {
    errors.push("Slug s\u1EA3n ph\u1EA9m kh\xF4ng h\u1EE3p l\u1EC7 (y\xEAu c\u1EA7u t\u1EEB 3-120 k\xFD t\u1EF1 ch\u1EEF th\u01B0\u1EDDng, s\u1ED1 v\xE0 g\u1EA1ch n\u1ED1i).");
  }
  const slug = slugCheck.slug || "san-pham-moi";
  const id = cleanStr(raw.id) || slug;
  const nameVi = cleanStr(raw.nameVi) || cleanStr(raw.name_vi) || cleanStr(raw.vi?.name);
  if (!nameVi) {
    errors.push("T\xEAn s\u1EA3n ph\u1EA9m ti\u1EBFng Vi\u1EC7t l\xE0 tr\u01B0\u1EDDng b\u1EAFt bu\u1ED9c.");
  }
  const name = cleanStr(raw.name) || cleanStr(raw.name_en) || cleanStr(raw.en?.name) || nameVi;
  const nameKo = cleanStr(raw.name_ko) || cleanStr(raw.nameKo) || cleanStr(raw.ko?.name);
  const nameZh = cleanStr(raw.name_zh) || cleanStr(raw.nameZh) || cleanStr(raw.zh?.name);
  const category = ALLOWED_CATEGORIES.includes(raw.category) ? raw.category : "soft-dried";
  let image = cleanStr(raw.image) || cleanStr(raw.imageWebp);
  if (!image || !isValidUrl(image, true)) {
    image = "/images/products/placeholder.webp";
  }
  let imageWebp = cleanStr(raw.imageWebp) || image;
  let imageJpg = cleanStr(raw.imageJpg) || image;
  if (image.endsWith(".webp")) {
    imageWebp = image;
    if (!raw.imageJpg || String(raw.imageJpg).includes("img_5608") || !String(raw.imageJpg).endsWith(".jpg")) {
      imageJpg = image.replace(/\.webp$/, ".jpg");
    }
  } else if (image.endsWith(".jpg") || image.endsWith(".jpeg")) {
    imageJpg = image;
    if (!raw.imageWebp || String(raw.imageWebp).includes("img_5608") || !String(raw.imageWebp).endsWith(".webp")) {
      imageWebp = image.replace(/\.jpe?g$/, ".webp");
    }
  }
  const descriptionVi = cleanStr(raw.descriptionVi) || cleanStr(raw.description_vi) || cleanStr(raw.vi?.desc);
  const shortDescriptionVi = cleanStr(raw.shortDescriptionVi) || cleanStr(raw.short_description_vi) || descriptionVi;
  const description = cleanStr(raw.description) || cleanStr(raw.description_en) || cleanStr(raw.en?.desc);
  const shortDescription = cleanStr(raw.shortDescription) || cleanStr(raw.short_description_en) || description;
  const descriptionKo = cleanStr(raw.description_ko) || cleanStr(raw.descriptionKo) || cleanStr(raw.ko?.desc);
  const shortDescriptionKo = cleanStr(raw.shortDescriptionKo) || descriptionKo;
  const descriptionZh = cleanStr(raw.description_zh) || cleanStr(raw.descriptionZh) || cleanStr(raw.zh?.desc);
  const shortDescriptionZh = cleanStr(raw.shortDescriptionZh) || descriptionZh;
  const originVi = cleanStr(raw.originVi) || cleanStr(raw.origin_vi) || cleanStr(raw.vi?.origin);
  const origin = cleanStr(raw.origin) || cleanStr(raw.origin_en) || cleanStr(raw.en?.origin) || originVi;
  const originKo = cleanStr(raw.origin_ko) || cleanStr(raw.originKo) || cleanStr(raw.ko?.origin);
  const originZh = cleanStr(raw.origin_zh) || cleanStr(raw.originZh) || cleanStr(raw.zh?.origin);
  const emptySpecs = {
    moisture: "",
    brix: "",
    shelfLifeEn: "",
    shelfLifeVi: "",
    storageEn: "",
    storageVi: "",
    ingredientsEn: "",
    ingredientsVi: "",
    processEn: "",
    processVi: "",
    packagingEn: "",
    packagingVi: "",
    certificationsEn: "",
    certificationsVi: ""
  };
  const rawSpecs = typeof raw.specs === "object" && raw.specs !== null ? raw.specs : {};
  const specs = {
    ...emptySpecs,
    ...rawSpecs,
    moisture: cleanStr(rawSpecs.moisture ?? raw.specs_moisture),
    brix: cleanStr(rawSpecs.brix ?? raw.specs_brix),
    ...cleanStr(rawSpecs.sizeOrWeightVi) ? { sizeOrWeightVi: cleanStr(rawSpecs.sizeOrWeightVi) } : {},
    ...cleanStr(rawSpecs.sizeOrWeightEn) ? { sizeOrWeightEn: cleanStr(rawSpecs.sizeOrWeightEn) } : {},
    ...cleanStr(rawSpecs.sizeOrWeightKo) ? { sizeOrWeightKo: cleanStr(rawSpecs.sizeOrWeightKo) } : {},
    ...cleanStr(rawSpecs.sizeOrWeightZh) ? { sizeOrWeightZh: cleanStr(rawSpecs.sizeOrWeightZh) } : {},
    shelfLifeVi: cleanStr(rawSpecs.shelfLifeVi || raw.shelf_life),
    shelfLifeEn: cleanStr(rawSpecs.shelfLifeEn),
    packagingVi: cleanStr(rawSpecs.packagingVi || raw.packaging),
    packagingEn: cleanStr(rawSpecs.packagingEn),
    ingredientsVi: cleanStr(rawSpecs.ingredientsVi || raw.specs_ingredients_vi),
    ingredientsEn: cleanStr(rawSpecs.ingredientsEn),
    processVi: cleanStr(rawSpecs.processVi || raw.specs_process_vi),
    processEn: cleanStr(rawSpecs.processEn),
    storageVi: cleanStr(rawSpecs.storageVi),
    storageEn: cleanStr(rawSpecs.storageEn),
    certificationsVi: cleanStr(rawSpecs.certificationsVi || raw.specs_cert_vi),
    certificationsEn: cleanStr(rawSpecs.certificationsEn)
  };
  const productCertifications = normalizeProductCertifications(raw.productCertifications);
  const productFeatures = normalizeProductFeatures(raw.productFeatures);
  const legacyCertStrings = Array.isArray(raw.certifications) ? raw.certifications.map((c) => cleanStr(c)).filter(Boolean) : [];
  const published = raw.published !== void 0 ? Boolean(raw.published) : raw.status !== "draft";
  const status = published ? "published" : "draft";
  const featuresEn = cleanStr(raw.en?.features);
  const featuresVi = cleanStr(raw.vi?.features);
  const featuresKo = cleanStr(raw.ko?.features);
  const featuresZh = cleanStr(raw.zh?.features);
  const product = {
    id,
    slug,
    aliases: Array.isArray(raw.aliases) ? raw.aliases : [],
    name,
    nameVi,
    ...nameKo ? { nameKo } : {},
    ...nameZh ? { nameZh } : {},
    category,
    categoryLabelEn: cleanStr(raw.categoryLabelEn) || "",
    categoryLabelVi: cleanStr(raw.categoryLabelVi) || "",
    image,
    imageWebp,
    imageJpg,
    shortDescription,
    shortDescriptionVi,
    description: description || shortDescription,
    descriptionVi: descriptionVi || shortDescriptionVi,
    ...shortDescriptionKo ? { shortDescriptionKo } : {},
    ...descriptionKo ? { descriptionKo } : {},
    ...shortDescriptionZh ? { shortDescriptionZh } : {},
    ...descriptionZh ? { descriptionZh } : {},
    origin,
    originVi,
    ...originKo ? { originKo } : {},
    ...originZh ? { originZh } : {},
    certifications: legacyCertStrings,
    productCertifications,
    productFeatures,
    verified: raw.verified !== void 0 ? Boolean(raw.verified) : true,
    ocop: cleanStr(raw.ocop),
    specs,
    en: {
      name,
      desc: shortDescription || description,
      origin,
      features: featuresEn
    },
    vi: {
      name: nameVi,
      desc: shortDescriptionVi || descriptionVi,
      origin: originVi,
      features: featuresVi
    },
    ...nameKo || descriptionKo ? {
      ko: {
        name: nameKo || name,
        desc: descriptionKo || description,
        origin: originKo || origin,
        features: featuresKo
      }
    } : {},
    ...nameZh || descriptionZh ? {
      zh: {
        name: nameZh || name,
        desc: descriptionZh || description,
        origin: originZh || origin,
        features: featuresZh
      }
    } : {},
    ...cleanStr(raw.seoTitleVi) ? { seoTitleVi: cleanStr(raw.seoTitleVi) } : {},
    ...cleanStr(raw.seoTitleEn) ? { seoTitleEn: cleanStr(raw.seoTitleEn) } : {},
    ...cleanStr(raw.seoDescriptionVi) ? { seoDescriptionVi: cleanStr(raw.seoDescriptionVi) } : {},
    ...cleanStr(raw.seoDescriptionEn) ? { seoDescriptionEn: cleanStr(raw.seoDescriptionEn) } : {},
    ...cleanStr(raw.imageAltVi) ? { imageAltVi: cleanStr(raw.imageAltVi) } : {},
    ...cleanStr(raw.imageAltEn) ? { imageAltEn: cleanStr(raw.imageAltEn) } : {},
    published,
    status,
    // Compatibility aliases
    name_vi: nameVi,
    name_en: name,
    ...nameKo ? { name_ko: nameKo } : {},
    ...nameZh ? { name_zh: nameZh } : {},
    description_vi: descriptionVi || shortDescriptionVi,
    description_en: description || shortDescription,
    ...descriptionKo ? { description_ko: descriptionKo } : {},
    ...descriptionZh ? { description_zh: descriptionZh } : {},
    origin_vi: originVi,
    origin_en: origin,
    ...originKo ? { origin_ko: originKo } : {},
    ...originZh ? { origin_zh: originZh } : {},
    shelf_life: specs.shelfLifeVi || cleanStr(raw.shelf_life),
    packaging: specs.packagingVi || cleanStr(raw.packaging),
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
  const mergeLocalized = (baseObj, patchObj) => {
    const out = { ...baseObj || {} };
    for (const [k, v] of Object.entries(patchObj || {})) {
      if (typeof v === "string" && v.trim() === "" && out[k]) continue;
      if (v !== void 0 && v !== null) out[k] = v;
    }
    return out;
  };
  const mergedSpecs = { ...base.specs || {} };
  for (const [k, v] of Object.entries(update.specs || {})) {
    if (v !== void 0 && v !== null) {
      if (typeof v === "string" && v.trim() === "" && mergedSpecs[k] && k !== "brix") continue;
      mergedSpecs[k] = v;
    }
  }
  const merged = {
    ...base,
    specs: mergedSpecs,
    en: mergeLocalized(base.en, update.en),
    vi: mergeLocalized(base.vi, update.vi),
    ...base.ko || update.ko ? { ko: mergeLocalized(base.ko, update.ko) } : {},
    ...base.zh || update.zh ? { zh: mergeLocalized(base.zh, update.zh) } : {}
  };
  const explicitArrayFields = /* @__PURE__ */ new Set(["productCertifications", "productFeatures", "certifications", "aliases"]);
  for (const [key, value] of Object.entries(update)) {
    if (key === "specs" || key === "en" || key === "vi" || key === "ko" || key === "zh") continue;
    if (value !== void 0 && value !== null) {
      if (explicitArrayFields.has(key) && Array.isArray(value)) {
        merged[key] = value;
        continue;
      }
      if (typeof value === "string" && value.trim() === "" && base[key] && key !== "ocop") {
        continue;
      }
      merged[key] = value;
    }
  }
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
        const nameKo = raw.name_ko || raw.nameKo || raw.ko?.name || "";
        const nameZh = raw.name_zh || raw.nameZh || raw.zh?.name || "";
        const slug = raw.slug || raw.id || `product-${idx}`;
        const published = raw.published !== void 0 ? Boolean(raw.published) : raw.status !== "draft";
        return {
          ...raw,
          id: raw.id || slug,
          slug,
          name_vi: nameVi,
          name_en: nameEn,
          name_ko: nameKo,
          name_zh: nameZh,
          nameVi,
          name: nameEn,
          category: raw.category || "soft-dried",
          image: raw.image || raw.imageWebp || raw.imageJpg || "/assets/images/products/placeholder.webp",
          shortDescriptionVi: raw.shortDescriptionVi || raw.vi?.desc || "",
          shortDescription: raw.shortDescription || raw.en?.desc || "",
          shortDescriptionKo: raw.shortDescriptionKo || raw.ko?.desc || "",
          shortDescriptionZh: raw.shortDescriptionZh || raw.zh?.desc || "",
          description_vi: raw.description_vi || raw.descriptionVi || raw.shortDescriptionVi || raw.vi?.desc || "",
          description_en: raw.description_en || raw.description || raw.shortDescription || raw.en?.desc || "",
          description_ko: raw.description_ko || raw.descriptionKo || raw.shortDescriptionKo || raw.ko?.desc || "",
          description_zh: raw.description_zh || raw.descriptionZh || raw.shortDescriptionZh || raw.zh?.desc || "",
          origin_vi: raw.origin_vi || raw.originVi || raw.vi?.origin || raw.origin || "",
          origin_en: raw.origin_en || raw.originEn || raw.en?.origin || raw.origin || "",
          origin_ko: raw.origin_ko || raw.originKo || raw.ko?.origin || "",
          origin_zh: raw.origin_zh || raw.originZh || raw.zh?.origin || "",
          shelf_life: raw.shelf_life || raw.specs?.shelfLifeVi || raw.specs?.shelfLifeEn || "",
          packaging: raw.packaging || raw.specs?.packagingVi || raw.specs?.packagingEn || "",
          specs: raw.specs || {},
          productCertifications: Array.isArray(raw.productCertifications) ? raw.productCertifications : [],
          productFeatures: Array.isArray(raw.productFeatures) ? raw.productFeatures : [],
          certifications: Array.isArray(raw.certifications) ? raw.certifications : [],
          published,
          status: published ? "published" : "draft",
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
