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
async function getCommitDeployStatus(commitSha) {
  const { owner, repo, branch, token } = getRepoConfig();
  if (!token || !commitSha || commitSha === "local-commit") {
    return {
      state: "success",
      description: "M\xF4i tr\u01B0\u1EDDng ph\xE1t tri\u1EC3n n\u1ED9i b\u1ED9 (Local / kh\xF4ng k\u1EBFt n\u1ED1i GitHub)",
      branch
    };
  }
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits/${commitSha}/status`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "VINAXO-CMS-Serverless"
      }
    });
    if (!response.ok) {
      return {
        state: "unknown",
        description: `Kh\xF4ng th\u1EC3 ki\u1EC3m tra tr\u1EA1ng th\xE1i Git (HTTP ${response.status})`,
        branch
      };
    }
    const data = await response.json();
    const vercelStatus = Array.isArray(data.statuses) ? data.statuses.find((s) => (s.context || "").toLowerCase().includes("vercel")) || data.statuses[0] : null;
    if (vercelStatus) {
      const state = vercelStatus.state;
      return {
        state: state === "error" ? "failure" : state,
        description: vercelStatus.description || (state === "success" ? "Website \u0111\xE3 c\u1EADp nh\u1EADt th\xE0nh c\xF4ng!" : "\u0110ang tri\u1EC3n khai l\xEAn m\xE1y ch\u1EE7..."),
        targetUrl: vercelStatus.target_url,
        branch
      };
    }
    return {
      state: "queued",
      description: "\u0110\xE3 ghi nh\u1EADn commit v\xE0o Git. \u0110ang x\u1EBFp h\xE0ng ch\u1EDD Vercel kh\u1EDFi t\u1EA1o b\u1EA3n build...",
      branch
    };
  } catch (err) {
    return {
      state: "unknown",
      description: err?.message || "L\u1ED7i k\u1EBFt n\u1ED1i ki\u1EC3m tra ti\u1EBFn \u0111\u1ED9 tri\u1EC3n khai",
      branch
    };
  }
}

// server/admin/publish.ts
import fs from "fs";
import path from "path";
var ALLOWED_MODULES = ["news", "products", "about", "certificates", "media", "brochure", "company", "all"];
var MODULE_LABELS = {
  news: "Tin t\u1EE9c & B\xE1o ch\xED",
  products: "S\u1EA3n ph\u1EA9m nhi\u1EC7t \u0111\u1EDBi",
  about: "Trang V\u1EC1 ch\xFAng t\xF4i",
  certificates: "Ch\u1EE9ng nh\u1EADn & Ti\xEAu chu\u1EA9n",
  media: "Th\u01B0 vi\u1EC7n h\xECnh \u1EA3nh",
  brochure: "H\u1ED3 s\u01A1 n\u0103ng l\u1EF1c (Brochure)",
  company: "Th\xF4ng tin Doanh nghi\u1EC7p",
  all: "To\xE0n b\u1ED9 website"
};
var HISTORY_PATH = "content/settings/publish_history.json";
var publish_default = wrapHandler(async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Y\xEAu c\u1EA7u \u0111\u0103ng nh\u1EADp qu\u1EA3n tr\u1ECB." });
  }
  const useGitHub = hasGitHubToken();
  if (req.method === "GET") {
    let history = [];
    let historySha = void 0;
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
          history = JSON.parse(fs.readFileSync(localHistoryFile, "utf-8").replace(/^\uFEFF/, ""));
        }
      }
    } catch {
      history = [];
    }
    let newsCount = 0;
    let newsDrafts = 0;
    let productsCount = 0;
    let certsCount = 0;
    let mediaCount = 0;
    let aboutGalleryTotal = 0;
    let aboutGalleryVisible = 0;
    try {
      const aboutFile = path.join(process.cwd(), "content/settings/about.json");
      if (fs.existsSync(aboutFile)) {
        const rawAbout = JSON.parse(fs.readFileSync(aboutFile, "utf-8").replace(/^\uFEFF/, ""));
        if (Array.isArray(rawAbout?.gallery)) {
          aboutGalleryTotal = rawAbout.gallery.length;
          aboutGalleryVisible = rawAbout.gallery.filter((g) => g && g.visible !== false).length;
        }
      }
    } catch {
    }
    try {
      const newsDir = path.join(process.cwd(), "content/news");
      if (fs.existsSync(newsDir)) {
        const files = fs.readdirSync(newsDir).filter((f) => f.endsWith(".json"));
        newsCount = files.length;
        for (const f of files) {
          try {
            const raw = JSON.parse(fs.readFileSync(path.join(newsDir, f), "utf-8").replace(/^\uFEFF/, ""));
            if (raw.published === false || raw.status === "draft") newsDrafts++;
          } catch {
          }
        }
      }
    } catch {
    }
    try {
      const prodDir = path.join(process.cwd(), "content/products");
      if (fs.existsSync(prodDir)) {
        productsCount = fs.readdirSync(prodDir).filter((f) => f.endsWith(".json")).length;
      }
    } catch {
    }
    try {
      const certFile = path.join(process.cwd(), "content/settings/certificates.json");
      if (fs.existsSync(certFile)) {
        const raw = JSON.parse(fs.readFileSync(certFile, "utf-8").replace(/^\uFEFF/, ""));
        certsCount = Array.isArray(raw) ? raw.length : 0;
      }
    } catch {
    }
    try {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (fs.existsSync(uploadDir)) {
        const walk = (d) => {
          for (const item of fs.readdirSync(d, { withFileTypes: true })) {
            const sub = path.join(d, item.name);
            if (item.isDirectory()) walk(sub);
            else if (!item.name.startsWith(".")) mediaCount++;
          }
        };
        walk(uploadDir);
      }
    } catch {
    }
    let latestDeployStatus = null;
    const latestCommit = history.find((h) => h.commitSha && h.commitSha.length >= 7);
    if (latestCommit?.commitSha && useGitHub) {
      try {
        latestDeployStatus = await getCommitDeployStatus(latestCommit.commitSha);
      } catch {
      }
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
  if (req.method === "POST") {
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
      return res.status(429).json({ error: "Thao t\xE1c xu\u1EA5t b\u1EA3n qu\xE1 nhanh. Vui l\xF2ng th\u1EED l\u1EA1i sau." });
    }
    const body = await readJsonBody(req);
    const incomingData = stripUnsafeKeys(body);
    const targetModule = ALLOWED_MODULES.includes(incomingData.module) ? incomingData.module : "all";
    const label = MODULE_LABELS[targetModule];
    let history = [];
    let currentSha = void 0;
    if (useGitHub) {
      const file = await getRepoFile(HISTORY_PATH);
      if (file) {
        try {
          history = JSON.parse(file.content);
        } catch {
        }
        currentSha = file.sha;
      }
    } else {
      const localHistoryFile = path.join(process.cwd(), HISTORY_PATH);
      if (fs.existsSync(localHistoryFile)) {
        try {
          history = JSON.parse(fs.readFileSync(localHistoryFile, "utf-8").replace(/^\uFEFF/, ""));
        } catch {
        }
      }
    }
    const newRecord = {
      id: `pub-${Date.now()}`,
      module: targetModule,
      moduleLabel: label,
      requestedBy: user.username,
      requestedAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "QUEUED",
      message: `C\u1EADp nh\u1EADt nh\xF3m [${label}] l\xEAn website vinaxo.net`
    };
    const updatedHistory = [newRecord, ...history].slice(0, 50);
    const contentStr = JSON.stringify(updatedHistory, null, 2);
    const commitMessage = `cms(publish): update ${targetModule.toUpperCase()} on website`;
    let commitResult = null;
    if (useGitHub) {
      commitResult = await commitFile(HISTORY_PATH, contentStr, commitMessage, currentSha);
      newRecord.commitSha = commitResult.commitSha || commitResult.sha;
    } else {
      const localPath = path.join(process.cwd(), HISTORY_PATH);
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      fs.writeFileSync(localPath, contentStr, "utf-8");
      commitResult = { sha: "local-test-sha", commitSha: "local-commit-sha" };
      newRecord.commitSha = "local-commit-sha";
    }
    return res.status(200).json({
      ok: true,
      module: targetModule,
      moduleLabel: label,
      commitSha: newRecord.commitSha,
      requestedAt: newRecord.requestedAt,
      message: `\u0110\xE3 k\xEDch ho\u1EA1t quy tr\xECnh c\u1EADp nh\u1EADt [${label}] l\xEAn website! Vercel \u0111ang t\u1EF1 \u0111\u1ED9ng x\xE2y d\u1EF1ng v\xE0 tri\u1EC3n khai.`
    });
  }
  return res.status(405).json({ error: "Method Not Allowed" });
});
export {
  publish_default as default
};
