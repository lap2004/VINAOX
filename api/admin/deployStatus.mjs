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
function applySecurityHeaders(res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
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

// server/admin/deployStatus.ts
var deployStatus_default = wrapHandler(async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: "Y\xEAu c\u1EA7u \u0111\u0103ng nh\u1EADp qu\u1EA3n tr\u1ECB." });
  }
  const commitSha = typeof req.query?.commitSha === "string" ? req.query.commitSha.trim() : "";
  if (!commitSha) {
    return res.status(400).json({ error: "Thi\u1EBFu m\xE3 commitSha \u0111\u1EC3 ki\u1EC3m tra tr\u1EA1ng th\xE1i tri\u1EC3n khai." });
  }
  const status = await getCommitDeployStatus(commitSha);
  return res.status(200).json({ ok: true, status });
});
export {
  deployStatus_default as default
};
