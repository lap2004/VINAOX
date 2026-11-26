// Auto-generated standalone ESM bundle from server/inquiry.ts via scripts/build-api.mjs

// server/inquiry.ts
import crypto from "crypto";

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

// server/inquiry.ts
var EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
var DEFAULT_RECIPIENT = "cuonghoang0710@gmail.com";
var INQUIRY_WINDOW_MS = 10 * 60 * 1e3;
var INQUIRY_MAX_PER_WINDOW = 5;
var DEDUP_WINDOW_MS = 60 * 1e3;
var ipRateStore = /* @__PURE__ */ new Map();
var recentSubmissionStore = /* @__PURE__ */ new Map();
function pruneStores(now) {
  if (ipRateStore.size > 500) {
    for (const [k, v] of ipRateStore.entries()) {
      if (now > v.resetAt) ipRateStore.delete(k);
    }
  }
  if (recentSubmissionStore.size > 500) {
    for (const [k, expiresAt] of recentSubmissionStore.entries()) {
      if (now > expiresAt) recentSubmissionStore.delete(k);
    }
  }
}
function checkInquiryRateLimit(ip, now) {
  const entry = ipRateStore.get(ip);
  if (!entry || now >= entry.resetAt) {
    ipRateStore.set(ip, { count: 1, resetAt: now + INQUIRY_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  entry.count += 1;
  ipRateStore.set(ip, entry);
  if (entry.count > INQUIRY_MAX_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1e3))
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}
function cleanText(val, maxLen) {
  if (typeof val !== "string") return "";
  return val.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLen);
}
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function isOriginAllowed(req) {
  const secFetchSite = String(req?.headers?.["sec-fetch-site"] || "").toLowerCase();
  if (secFetchSite === "cross-site") return false;
  const expectedHost = String(req?.headers?.["x-forwarded-host"] || req?.headers?.host || "").split(",")[0].trim().toLowerCase();
  const origin = req?.headers?.origin;
  if (!expectedHost || !origin || typeof origin !== "string") return true;
  try {
    return new URL(origin).host.toLowerCase() === expectedHost;
  } catch {
    return false;
  }
}
var inquiry_default = wrapHandler(async (req, res) => {
  const method = (req?.method || "GET").toUpperCase();
  if (method !== "POST") {
    return sendJson(res, 405, { ok: false, delivered: false, code: "METHOD_NOT_ALLOWED", error: "Method Not Allowed" });
  }
  const contentType = String(req?.headers?.["content-type"] || "").toLowerCase();
  if (!contentType.includes("application/json")) {
    return sendJson(res, 415, {
      ok: false,
      delivered: false,
      code: "UNSUPPORTED_MEDIA_TYPE",
      error: "Content-Type must be application/json."
    });
  }
  if (!isOriginAllowed(req)) {
    return sendJson(res, 403, {
      ok: false,
      delivered: false,
      code: "FORBIDDEN_ORIGIN",
      error: "Cross-origin request rejected."
    });
  }
  const rawBody = stripUnsafeKeys(await readJsonBody(req, 16384));
  const honeypot = cleanText(rawBody.hp_website || rawBody.company_website_hp || rawBody.quote_company_fax_hp, 200);
  if (honeypot) {
    return sendJson(res, 200, {
      ok: true,
      delivered: true,
      filtered: true,
      referenceId: `VNX-HP-${Date.now()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  const now = Date.now();
  pruneStores(now);
  const clientIp = getClientIp(req);
  const rate = checkInquiryRateLimit(clientIp, now);
  if (!rate.allowed) {
    res.setHeader("Retry-After", String(rate.retryAfterSeconds));
    return sendJson(res, 429, {
      ok: false,
      delivered: false,
      code: "RATE_LIMITED",
      retryAfterSeconds: rate.retryAfterSeconds,
      error: "Too many requests. Please wait a few minutes before sending another inquiry."
    });
  }
  const formType = rawBody.formType === "quote" ? "quote" : "contact";
  const language = rawBody.language === "en" ? "en" : "vi";
  const name = cleanText(rawBody.name, 100);
  const email = cleanText(rawBody.email, 120);
  const phone = cleanText(rawBody.phone, 30);
  const company = cleanText(rawBody.company, 150);
  const country = cleanText(rawBody.country, 100);
  const inquiryType = cleanText(rawBody.inquiryType, 150);
  const product = cleanText(rawBody.product, 200);
  const volume = cleanText(rawBody.volume, 200);
  const message = cleanText(rawBody.message, 3e3);
  const sourcePage = cleanText(rawBody.sourcePage, 200) || (formType === "quote" ? "QuoteModal" : "/contact");
  const errors = [];
  if (name.length < 2) errors.push(language === "vi" ? "H\u1ECD t\xEAn ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 2 k\xFD t\u1EF1." : "Full name must be at least 2 characters.");
  if (!EMAIL_REGEX.test(email)) errors.push(language === "vi" ? "Email kh\xF4ng \u0111\xFAng \u0111\u1ECBnh d\u1EA1ng." : "Invalid email address.");
  if (formType === "quote" && phone.length < 6) {
    errors.push(language === "vi" ? "Vui l\xF2ng cung c\u1EA5p s\u1ED1 \u0111i\u1EC7n tho\u1EA1i/WhatsApp h\u1EE3p l\u1EC7." : "Please provide a valid phone/WhatsApp number.");
  }
  if (formType === "contact" && (!inquiryType || message.length < 5)) {
    errors.push(
      language === "vi" ? "Vui l\xF2ng ch\u1ECDn m\u1EE5c \u0111\xEDch li\xEAn h\u1EC7 v\xE0 nh\u1EADp n\u1ED9i dung y\xEAu c\u1EA7u (t\u1ED1i thi\u1EC3u 5 k\xFD t\u1EF1)." : "Please select an inquiry purpose and provide your message (at least 5 characters)."
    );
  }
  if (errors.length > 0) {
    return sendJson(res, 400, {
      ok: false,
      delivered: false,
      code: "VALIDATION_ERROR",
      error: errors.join(" "),
      errors
    });
  }
  const dedupHash = crypto.createHash("sha256").update(`${email.toLowerCase()}|${formType}|${product}|${message}`).digest("hex");
  const existingExpiry = recentSubmissionStore.get(dedupHash);
  if (existingExpiry && now < existingExpiry) {
    return sendJson(res, 409, {
      ok: false,
      delivered: false,
      code: "DUPLICATE_SUBMISSION",
      error: language === "vi" ? "Y\xEAu c\u1EA7u gi\u1ED1ng h\u1EC7t v\u1EEBa \u0111\u01B0\u1EE3c g\u1EEDi tr\u01B0\u1EDBc \u0111\xF3. Vui l\xF2ng \u0111\u1EE3i 1 ph\xFAt tr\u01B0\u1EDBc khi g\u1EEDi l\u1EA1i." : "An identical inquiry was just submitted. Please wait 1 minute before retrying."
    });
  }
  const recipientEmail = (process.env.INQUIRY_TO_EMAIL || DEFAULT_RECIPIENT).trim();
  const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
  const webhookUrl = (process.env.INQUIRY_WEBHOOK_URL || "").trim();
  if (!resendApiKey && !webhookUrl) {
    return sendJson(res, 503, {
      ok: false,
      delivered: false,
      code: "DELIVERY_NOT_CONFIGURED",
      recipient: recipientEmail,
      error: language === "vi" ? "M\xE1y ch\u1EE7 ch\u01B0a \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh d\u1ECBch v\u1EE5 g\u1EEDi email t\u1EF1 \u0111\u1ED9ng (RESEND_API_KEY / INQUIRY_WEBHOOK_URL). Vui l\xF2ng d\xF9ng n\xFAt m\u1EDF \u1EE9ng d\u1EE5ng Email ho\u1EB7c WhatsApp/Zalo b\xEAn d\u01B0\u1EDBi." : "Server email delivery is not configured yet (RESEND_API_KEY / INQUIRY_WEBHOOK_URL). Please use the direct Email app, WhatsApp, or Zalo action below."
    });
  }
  const referenceId = `VNX-${new Date(now).toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const submittedAt = new Date(now).toISOString();
  const subjectPrefix = formType === "quote" ? "B2B Quote Request" : "B2B Contact Inquiry";
  const subject = `[VINAXO ${subjectPrefix}] ${product || inquiryType || "General"} - ${name} (${referenceId})`;
  const textSummary = [
    `VINAXO B2B INQUIRY (${referenceId})`,
    `========================================`,
    `Form Type: ${formType}`,
    `Source Page: ${sourcePage}`,
    `Language: ${language.toUpperCase()}`,
    `Submitted At: ${submittedAt}`,
    `----------------------------------------`,
    `Full Name: ${name}`,
    `Company: ${company || "N/A"}`,
    `Email: ${email}`,
    `Phone / WhatsApp: ${phone || "N/A"}`,
    `Country / Market: ${country || "N/A"}`,
    `Inquiry Type: ${inquiryType || "N/A"}`,
    `Product of Interest: ${product || "General Catalog"}`,
    `Estimated Volume / Packaging: ${volume || "N/A"}`,
    `----------------------------------------`,
    `Message:`,
    message || "Standard export CIF/FOB quotation requested."
  ].join("\n");
  const htmlSummary = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#291810;border:1px solid #eadcc8;border-radius:12px;overflow:hidden">
      <div style="background:#3A2417;color:#FFF7EC;padding:18px 24px">
        <h2 style="margin:0;font-size:18px">VINAXO B2B Export Inquiry \u2014 ${escapeHtml(referenceId)}</h2>
        <p style="margin:6px 0 0;font-size:13px;opacity:.85">Submitted via www.vinaxo.net (${escapeHtml(sourcePage)}) \u2022 ${escapeHtml(submittedAt)}</p>
      </div>
      <div style="padding:20px 24px;background:#FFFDF9">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;font-weight:bold;width:190px">Full Name:</td><td>${escapeHtml(name)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Company:</td><td>${escapeHtml(company || "N/A")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Email:</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Phone / WhatsApp:</td><td>${escapeHtml(phone || "N/A")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Country / Market:</td><td>${escapeHtml(country || "N/A")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Inquiry Type:</td><td>${escapeHtml(inquiryType || "N/A")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Product:</td><td><strong>${escapeHtml(product || "General Catalog")}</strong></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Volume / Packaging:</td><td>${escapeHtml(volume || "N/A")}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Language:</td><td>${escapeHtml(language.toUpperCase())}</td></tr>
        </table>
        <div style="margin-top:16px;padding:14px;background:#FFF7EC;border-left:4px solid #F4A83A;border-radius:6px">
          <div style="font-weight:bold;margin-bottom:6px">Message / Specifications:</div>
          <div style="white-space:pre-wrap;line-height:1.5">${escapeHtml(message || "Standard export CIF/FOB quotation requested.")}</div>
        </div>
      </div>
    </div>
  `;
  const deliveredChannels = [];
  if (resendApiKey) {
    const fromAddress = (process.env.INQUIRY_FROM_EMAIL || "VINAXO B2B Portal <onboarding@resend.dev>").trim();
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [recipientEmail],
        reply_to: email,
        subject,
        text: textSummary,
        html: htmlSummary
      })
    });
    if (!resendRes.ok) {
      const errText = await resendRes.text().catch(() => "");
      console.error("[VINAXO Inquiry Resend Error]", resendRes.status, errText.slice(0, 300));
      return sendJson(res, 502, {
        ok: false,
        delivered: false,
        code: "DELIVERY_UPSTREAM_FAILED",
        recipient: recipientEmail,
        error: language === "vi" ? "Kh\xF4ng th\u1EC3 chuy\u1EC3n email qua m\xE1y ch\u1EE7 g\u1EEDi th\u01B0. Vui l\xF2ng s\u1EED d\u1EE5ng n\xFAt m\u1EDF \u1EE9ng d\u1EE5ng Email ho\u1EB7c WhatsApp/Zalo b\xEAn d\u01B0\u1EDBi." : "Unable to dispatch via email relay right now. Please use the direct Email app, WhatsApp, or Zalo options below."
      });
    }
    deliveredChannels.push("resend");
  }
  if (webhookUrl) {
    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referenceId,
        submittedAt,
        formType,
        sourcePage,
        language,
        name,
        company,
        email,
        phone,
        country,
        inquiryType,
        product,
        volume,
        message,
        recipientEmail
      })
    });
    if (!webhookRes.ok && deliveredChannels.length === 0) {
      return sendJson(res, 502, {
        ok: false,
        delivered: false,
        code: "DELIVERY_UPSTREAM_FAILED",
        recipient: recipientEmail,
        error: language === "vi" ? "Kh\xF4ng th\u1EC3 k\u1EBFt n\u1ED1i c\u1ED5ng ti\u1EBFp nh\u1EADn y\xEAu c\u1EA7u. Vui l\xF2ng th\u1EED l\u1EA1i ho\u1EB7c d\xF9ng Email/WhatsApp tr\u1EF1c ti\u1EBFp." : "Unable to reach inquiry webhook. Please retry or use direct Email/WhatsApp below."
      });
    }
    if (webhookRes.ok) deliveredChannels.push("webhook");
  }
  recentSubmissionStore.set(dedupHash, now + DEDUP_WINDOW_MS);
  return sendJson(res, 200, {
    ok: true,
    delivered: true,
    channel: deliveredChannels.join("+"),
    referenceId,
    timestamp: submittedAt,
    recipient: recipientEmail
  });
});
export {
  inquiry_default as default
};
