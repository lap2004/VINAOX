// Auto-generated standalone ESM bundle from server/admin/*.ts via scripts/build-api.mjs

// server/lib/auth.ts
import crypto from "crypto";
var SESSION_COOKIE_NAME = "vinaxo_admin_session";
var DEFAULT_SESSION_DURATION_HOURS = 24;
var DEV_FALLBACK_SECRET = "vinaxo-local-dev-only-session-secret-not-for-production-use-32bytes";
function isProductionRuntime() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}
function shouldUseSecureCookie(req) {
  const proto = req?.headers?.["x-forwarded-proto"];
  if (typeof proto === "string" && proto.split(",")[0].trim() === "https") {
    return true;
  }
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
function verifyUsername(inputUsername, expectedUsername) {
  const normalizedInput = (inputUsername || "").trim().toLowerCase();
  const normalizedExpected = (expectedUsername || "").trim().toLowerCase();
  if (!normalizedInput || !normalizedExpected) {
    return false;
  }
  const inputDigest = crypto.createHash("sha256").update(normalizedInput, "utf8").digest();
  const expectedDigest = crypto.createHash("sha256").update(normalizedExpected, "utf8").digest();
  return crypto.timingSafeEqual(inputDigest, expectedDigest);
}
function verifyPassword(password, storedHash) {
  return new Promise((resolve) => {
    if (!password || !storedHash || typeof storedHash !== "string") {
      return resolve(false);
    }
    const cleanHash = storedHash.trim();
    if (!cleanHash.startsWith("scrypt:")) {
      return resolve(false);
    }
    const parts = cleanHash.split(":");
    let salt = "";
    let keyHex = "";
    let N = 16384;
    let r = 8;
    let p = 1;
    if (parts.length === 3) {
      salt = parts[1];
      keyHex = parts[2];
    } else if (parts.length === 6) {
      const parsedN = parseInt(parts[1], 10);
      const parsedR = parseInt(parts[2], 10);
      const parsedP = parseInt(parts[3], 10);
      if (isNaN(parsedN) || isNaN(parsedR) || isNaN(parsedP) || parsedN < 16384 || parsedR < 1 || parsedP < 1) {
        return resolve(false);
      }
      N = parsedN;
      r = parsedR;
      p = parsedP;
      salt = parts[4];
      keyHex = parts[5];
    } else {
      return resolve(false);
    }
    if (!salt || !keyHex || !/^[0-9a-f]+$/i.test(keyHex) || keyHex.length < 64 || keyHex.length % 2 !== 0) {
      return resolve(false);
    }
    const originalDerivedKey = Buffer.from(keyHex, "hex");
    crypto.scrypt(password, salt, originalDerivedKey.length, { N, r, p }, (err, derivedKey) => {
      if (err) return resolve(false);
      try {
        const matches = crypto.timingSafeEqual(originalDerivedKey, derivedKey);
        resolve(matches);
      } catch {
        resolve(false);
      }
    });
  });
}
function createSessionToken(username, durationHours = DEFAULT_SESSION_DURATION_HOURS) {
  const secret = getSessionSecret();
  const cleanUser = encodeURIComponent(username.trim());
  const issuedAt = Math.floor(Date.now() / 1e3);
  const expiresAt = issuedAt + durationHours * 3600;
  const payload = `${cleanUser}.${issuedAt}.${expiresAt}`;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const signature = hmac.digest("hex");
  return `${payload}.${signature}`;
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
function createSessionCookie(token, maxAgeHours = DEFAULT_SESSION_DURATION_HOURS, req) {
  const maxAgeSeconds = maxAgeHours * 3600;
  const isSecure = shouldUseSecureCookie(req);
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${isSecure ? "; Secure" : ""}`;
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

// server/lib/rateLimit.ts
import crypto2 from "crypto";
var RL_COOKIE_NAME = "vinaxo_login_rl";
var LOGIN_MAX_ATTEMPTS = 5;
var LOGIN_WINDOW_MS = 15 * 60 * 1e3;
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
function signCookieState(count, resetAt) {
  let secret = "vinaxo-dev-rl-fallback";
  try {
    secret = getSessionSecret();
  } catch {
  }
  const payload = `${count}.${resetAt}`;
  const sig = crypto2.createHmac("sha256", secret).update(`rl:${payload}`).digest("hex");
  return `${payload}.${sig}`;
}
function verifyCookieState(raw, now) {
  if (!raw || typeof raw !== "string") return null;
  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const [countStr, resetAtStr, sig] = parts;
  if (!/^[0-9]+$/.test(countStr) || !/^[0-9]+$/.test(resetAtStr) || !/^[0-9a-f]{64}$/i.test(sig)) {
    return null;
  }
  let secret = "vinaxo-dev-rl-fallback";
  try {
    secret = getSessionSecret();
  } catch {
    return null;
  }
  const expectedSig = crypto2.createHmac("sha256", secret).update(`rl:${countStr}.${resetAtStr}`).digest("hex");
  try {
    const valid = crypto2.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expectedSig, "hex"));
    if (!valid) return null;
  } catch {
    return null;
  }
  const count = parseInt(countStr, 10);
  const resetAt = parseInt(resetAtStr, 10);
  if (now > resetAt) return null;
  return { count, resetAt };
}
function checkLoginRateLimit(req, clientIp) {
  const now = Date.now();
  pruneMemoryStore(now);
  const memKey = `login:${clientIp}`;
  const memEntry = memoryStore.get(memKey);
  const activeMem = memEntry && now < memEntry.resetAt ? memEntry : null;
  const cookies = parseCookies(req?.headers?.cookie);
  const cookieEntry = verifyCookieState(cookies[RL_COOKIE_NAME], now);
  const highestCount = Math.max(activeMem?.count || 0, cookieEntry?.count || 0);
  const resetAt = Math.max(activeMem?.resetAt || 0, cookieEntry?.resetAt || now + LOGIN_WINDOW_MS);
  if (highestCount >= LOGIN_MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now) / 1e3));
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
      limit: LOGIN_MAX_ATTEMPTS
    };
  }
  return {
    allowed: true,
    remaining: Math.max(0, LOGIN_MAX_ATTEMPTS - highestCount),
    retryAfterSeconds: 0,
    limit: LOGIN_MAX_ATTEMPTS
  };
}
function recordFailedLoginAttempt(req, res, clientIp) {
  const now = Date.now();
  const memKey = `login:${clientIp}`;
  const currentMem = memoryStore.get(memKey);
  const cookies = parseCookies(req?.headers?.cookie);
  const cookieEntry = verifyCookieState(cookies[RL_COOKIE_NAME], now);
  let nextCount = 1;
  let resetAt = now + LOGIN_WINDOW_MS;
  if (currentMem && now < currentMem.resetAt) {
    nextCount = Math.max(nextCount, currentMem.count + 1);
    resetAt = currentMem.resetAt;
  }
  if (cookieEntry && now < cookieEntry.resetAt) {
    nextCount = Math.max(nextCount, cookieEntry.count + 1);
    resetAt = Math.max(resetAt, cookieEntry.resetAt);
  }
  memoryStore.set(memKey, { count: nextCount, resetAt });
  const isSecure = shouldUseSecureCookie(req);
  const maxAgeSeconds = Math.max(60, Math.ceil((resetAt - now) / 1e3));
  const cookieVal = signCookieState(nextCount, resetAt);
  res.setHeader(
    "Set-Cookie",
    `${RL_COOKIE_NAME}=${encodeURIComponent(cookieVal)}; Path=/api/admin/login; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${isSecure ? "; Secure" : ""}`
  );
  return {
    allowed: nextCount < LOGIN_MAX_ATTEMPTS,
    remaining: Math.max(0, LOGIN_MAX_ATTEMPTS - nextCount),
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1e3)),
    limit: LOGIN_MAX_ATTEMPTS
  };
}
function clearLoginRateLimit(req, clientIp) {
  memoryStore.delete(`login:${clientIp}`);
  const isSecure = shouldUseSecureCookie(req);
  return `${RL_COOKIE_NAME}=; Path=/api/admin/login; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${isSecure ? "; Secure" : ""}`;
}

// server/lib/github.ts
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
  let branch = configuredBranchEnv || gitRef || "main";
  if (vercelEnv === "preview" && gitRef) {
    branch = gitRef;
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
function getPublicRepoMeta() {
  const { owner, repo, branch, vercelEnv, configuredBranchEnv } = getRepoConfig();
  return { owner, repo, branch, vercelEnv, configuredBranchEnv };
}

// server/admin/login.ts
var login_default = wrapHandler(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const csrfCheck = validateCsrfAndOrigin(req, { requireCsrfToken: false });
  if (!csrfCheck.ok) {
    return res.status(csrfCheck.status).json({ error: csrfCheck.error });
  }
  const clientIp = getClientIp(req);
  const rateLimit = checkLoginRateLimit(req, clientIp);
  res.setHeader("X-RateLimit-Limit", String(rateLimit.limit));
  res.setHeader("X-RateLimit-Remaining", String(rateLimit.remaining));
  if (!rateLimit.allowed) {
    res.setHeader("Retry-After", String(rateLimit.retryAfterSeconds));
    const waitMinutes = Math.ceil(rateLimit.retryAfterSeconds / 60);
    return res.status(429).json({
      error: `Qu\xE1 nhi\u1EC1u l\u1EA7n \u0111\u0103ng nh\u1EADp th\u1EA5t b\u1EA1i. Vui l\xF2ng th\u1EED l\u1EA1i sau ${waitMinutes} ph\xFAt.`
    });
  }
  const body = await readJsonBody(req);
  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!username.trim() || !password) {
    return res.status(400).json({ error: "Vui l\xF2ng nh\u1EADp \u0111\u1EA7y \u0111\u1EE7 t\xEAn \u0111\u0103ng nh\u1EADp v\xE0 m\u1EADt kh\u1EA9u." });
  }
  if (username.length > 100 || password.length > 200) {
    return res.status(400).json({ error: "Th\xF4ng tin \u0111\u0103ng nh\u1EADp v\u01B0\u1EE3t qu\xE1 \u0111\u1ED9 d\xE0i cho ph\xE9p." });
  }
  const expectedUsername = (process.env.ADMIN_USERNAME || "admin").trim();
  const storedHash = (process.env.ADMIN_PASSWORD_HASH || "").trim();
  if (!storedHash) {
    return res.status(500).json({
      error: "H\u1EC7 th\u1ED1ng ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh ADMIN_PASSWORD_HASH tr\xEAn m\xE1y ch\u1EE7."
    });
  }
  const isUsernameMatch = verifyUsername(username, expectedUsername);
  const isPasswordValid = await verifyPassword(password, storedHash);
  if (!isUsernameMatch || !isPasswordValid) {
    const nextRl = recordFailedLoginAttempt(req, res, clientIp);
    res.setHeader("X-RateLimit-Remaining", String(nextRl.remaining));
    return res.status(401).json({
      error: "T\xEAn \u0111\u0103ng nh\u1EADp ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng ch\xEDnh x\xE1c."
    });
  }
  const normalizedUser = expectedUsername;
  const token = createSessionToken(normalizedUser);
  const csrfToken = createCsrfToken(token);
  const sessionCookie = createSessionCookie(token, void 0, req);
  const clearRlCookie = clearLoginRateLimit(req, clientIp);
  res.setHeader("Set-Cookie", [sessionCookie, clearRlCookie]);
  res.setHeader("X-RateLimit-Remaining", String(rateLimit.limit));
  return res.status(200).json({
    ok: true,
    message: "\u0110\u0103ng nh\u1EADp th\xE0nh c\xF4ng",
    user: {
      username: normalizedUser,
      role: "admin"
    },
    csrfToken,
    repo: getPublicRepoMeta()
  });
});
export {
  login_default as default
};
