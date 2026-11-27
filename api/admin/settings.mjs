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
function validateCompanySettings(input) {
  const errors = [];
  const raw = typeof input === "object" && input !== null ? input : {};
  const company_name_vi = typeof raw.company_name_vi === "string" && raw.company_name_vi.trim() ? raw.company_name_vi.trim() : "C\xD4NG TY TNHH VINAXO";
  const company_name_en = typeof raw.company_name_en === "string" && raw.company_name_en.trim() ? sanitizeEnglishCompanyName(raw.company_name_en) : "VINAXO COMPANY LIMITED";
  const tax_id = typeof raw.tax_id === "string" && raw.tax_id.trim() ? raw.tax_id.trim() : "1201611681";
  const address_vi = typeof raw.address_vi === "string" && raw.address_vi.trim() ? raw.address_vi.trim() : "Khu ph\u1ED1 5, X\xE3 V\u0129nh B\xECnh, T\u1EC9nh \u0110\u1ED3ng Th\xE1p, Vi\u1EC7t Nam";
  const address_en = typeof raw.address_en === "string" && raw.address_en.trim() ? raw.address_en.trim() : "Quarter 5, Vinh Binh Commune, Dong Thap Province, Vietnam";
  const hotline = typeof raw.hotline === "string" && raw.hotline.trim() ? raw.hotline.trim() : "(+84) 984 815 016";
  const email = typeof raw.email === "string" && raw.email.trim() ? raw.email.trim() : "cuonghoang0710@gmail.com";
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

// server/admin/settings.ts
import fs from "fs";
import path from "path";
var settings_default = wrapHandler(async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Y\xEAu c\u1EA7u \u0111\u0103ng nh\u1EADp qu\u1EA3n tr\u1ECB." });
  }
  const rawSection = req.query?.section;
  const section = rawSection === "brochure" ? "brochure" : rawSection === "about" ? "about" : "company";
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
