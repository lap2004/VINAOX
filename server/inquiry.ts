import crypto from 'crypto';
import { getClientIp, readJsonBody, sendJson, stripUnsafeKeys, wrapHandler } from './lib/security.js';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const DEFAULT_RECIPIENT = 'cuonghoang0710@gmail.com';
const INQUIRY_WINDOW_MS = 10 * 60 * 1000;
const INQUIRY_MAX_PER_WINDOW = 5;
const DEDUP_WINDOW_MS = 60 * 1000;

interface WindowEntry {
  count: number;
  resetAt: number;
}

const ipRateStore = new Map<string, WindowEntry>();
const recentSubmissionStore = new Map<string, number>();

function pruneStores(now: number) {
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

function checkInquiryRateLimit(ip: string, now: number): { allowed: boolean; retryAfterSeconds: number } {
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
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

function cleanText(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return '';
  return val.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, maxLen);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isOriginAllowed(req: any): boolean {
  const secFetchSite = String(req?.headers?.['sec-fetch-site'] || '').toLowerCase();
  if (secFetchSite === 'cross-site') return false;

  const expectedHost = String(req?.headers?.['x-forwarded-host'] || req?.headers?.host || '')
    .split(',')[0]
    .trim()
    .toLowerCase();
  const origin = req?.headers?.origin;
  if (!expectedHost || !origin || typeof origin !== 'string') return true;
  try {
    return new URL(origin).host.toLowerCase() === expectedHost;
  } catch {
    return false;
  }
}

export default wrapHandler(async (req: any, res: any) => {
  const method = (req?.method || 'GET').toUpperCase();
  if (method !== 'POST') {
    return sendJson(res, 405, { ok: false, delivered: false, code: 'METHOD_NOT_ALLOWED', error: 'Method Not Allowed' });
  }

  const contentType = String(req?.headers?.['content-type'] || '').toLowerCase();
  if (!contentType.includes('application/json')) {
    return sendJson(res, 415, {
      ok: false,
      delivered: false,
      code: 'UNSUPPORTED_MEDIA_TYPE',
      error: 'Content-Type must be application/json.',
    });
  }

  if (!isOriginAllowed(req)) {
    return sendJson(res, 403, {
      ok: false,
      delivered: false,
      code: 'FORBIDDEN_ORIGIN',
      error: 'Cross-origin request rejected.',
    });
  }

  const rawBody = stripUnsafeKeys(await readJsonBody(req, 16_384));
  const honeypot = cleanText(rawBody.hp_website || rawBody.company_website_hp || rawBody.quote_company_fax_hp, 200);
  if (honeypot) {
    return sendJson(res, 200, {
      ok: true,
      delivered: true,
      filtered: true,
      referenceId: `VNX-HP-${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
  }

  const now = Date.now();
  pruneStores(now);

  const clientIp = getClientIp(req);
  const rate = checkInquiryRateLimit(clientIp, now);
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfterSeconds));
    return sendJson(res, 429, {
      ok: false,
      delivered: false,
      code: 'RATE_LIMITED',
      retryAfterSeconds: rate.retryAfterSeconds,
      error: 'Too many requests. Please wait a few minutes before sending another inquiry.',
    });
  }

  const formType = rawBody.formType === 'quote' ? 'quote' : 'contact';
  const language = rawBody.language === 'en' ? 'en' : 'vi';
  const name = cleanText(rawBody.name, 100);
  const email = cleanText(rawBody.email, 120);
  const phone = cleanText(rawBody.phone, 30);
  const company = cleanText(rawBody.company, 150);
  const country = cleanText(rawBody.country, 100);
  const inquiryType = cleanText(rawBody.inquiryType, 150);
  const product = cleanText(rawBody.product, 200);
  const volume = cleanText(rawBody.volume, 200);
  const message = cleanText(rawBody.message, 3000);
  const sourcePage = cleanText(rawBody.sourcePage, 200) || (formType === 'quote' ? 'QuoteModal' : '/contact');

  const errors: string[] = [];
  if (name.length < 2) errors.push(language === 'vi' ? 'Họ tên phải có ít nhất 2 ký tự.' : 'Full name must be at least 2 characters.');
  if (!EMAIL_REGEX.test(email)) errors.push(language === 'vi' ? 'Email không đúng định dạng.' : 'Invalid email address.');
  if (formType === 'quote' && phone.length < 6) {
    errors.push(language === 'vi' ? 'Vui lòng cung cấp số điện thoại/WhatsApp hợp lệ.' : 'Please provide a valid phone/WhatsApp number.');
  }
  if (formType === 'contact' && (!inquiryType || message.length < 5)) {
    errors.push(
      language === 'vi'
        ? 'Vui lòng chọn mục đích liên hệ và nhập nội dung yêu cầu (tối thiểu 5 ký tự).'
        : 'Please select an inquiry purpose and provide your message (at least 5 characters).'
    );
  }

  if (errors.length > 0) {
    return sendJson(res, 400, {
      ok: false,
      delivered: false,
      code: 'VALIDATION_ERROR',
      error: errors.join(' '),
      errors,
    });
  }

  // Deduplicate rapid repeated submissions
  const dedupHash = crypto
    .createHash('sha256')
    .update(`${email.toLowerCase()}|${formType}|${product}|${message}`)
    .digest('hex');
  const existingExpiry = recentSubmissionStore.get(dedupHash);
  if (existingExpiry && now < existingExpiry) {
    return sendJson(res, 409, {
      ok: false,
      delivered: false,
      code: 'DUPLICATE_SUBMISSION',
      error:
        language === 'vi'
          ? 'Yêu cầu giống hệt vừa được gửi trước đó. Vui lòng đợi 1 phút trước khi gửi lại.'
          : 'An identical inquiry was just submitted. Please wait 1 minute before retrying.',
    });
  }

  const recipientEmail = (process.env.INQUIRY_TO_EMAIL || DEFAULT_RECIPIENT).trim();
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  const webhookUrl = (process.env.INQUIRY_WEBHOOK_URL || '').trim();

  if (!resendApiKey && !webhookUrl) {
    return sendJson(res, 503, {
      ok: false,
      delivered: false,
      code: 'DELIVERY_NOT_CONFIGURED',
      recipient: recipientEmail,
      error:
        language === 'vi'
          ? 'Máy chủ chưa được cấu hình dịch vụ gửi email tự động (RESEND_API_KEY / INQUIRY_WEBHOOK_URL). Vui lòng dùng nút mở ứng dụng Email hoặc WhatsApp/Zalo bên dưới.'
          : 'Server email delivery is not configured yet (RESEND_API_KEY / INQUIRY_WEBHOOK_URL). Please use the direct Email app, WhatsApp, or Zalo action below.',
    });
  }

  const referenceId = `VNX-${new Date(now).toISOString().slice(0, 10).replace(/-/g, '')}-${crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase()}`;
  const submittedAt = new Date(now).toISOString();
  const subjectPrefix = formType === 'quote' ? 'B2B Quote Request' : 'B2B Contact Inquiry';
  const subject = `[VINAXO ${subjectPrefix}] ${product || inquiryType || 'General'} - ${name} (${referenceId})`;

  const textSummary = [
    `VINAXO B2B INQUIRY (${referenceId})`,
    `========================================`,
    `Form Type: ${formType}`,
    `Source Page: ${sourcePage}`,
    `Language: ${language.toUpperCase()}`,
    `Submitted At: ${submittedAt}`,
    `----------------------------------------`,
    `Full Name: ${name}`,
    `Company: ${company || 'N/A'}`,
    `Email: ${email}`,
    `Phone / WhatsApp: ${phone || 'N/A'}`,
    `Country / Market: ${country || 'N/A'}`,
    `Inquiry Type: ${inquiryType || 'N/A'}`,
    `Product of Interest: ${product || 'General Catalog'}`,
    `Estimated Volume / Packaging: ${volume || 'N/A'}`,
    `----------------------------------------`,
    `Message:`,
    message || 'Standard export CIF/FOB quotation requested.',
  ].join('\n');

  const htmlSummary = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#291810;border:1px solid #eadcc8;border-radius:12px;overflow:hidden">
      <div style="background:#3A2417;color:#FFF7EC;padding:18px 24px">
        <h2 style="margin:0;font-size:18px">VINAXO B2B Export Inquiry — ${escapeHtml(referenceId)}</h2>
        <p style="margin:6px 0 0;font-size:13px;opacity:.85">Submitted via www.vinaxo.net (${escapeHtml(sourcePage)}) • ${escapeHtml(submittedAt)}</p>
      </div>
      <div style="padding:20px 24px;background:#FFFDF9">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;font-weight:bold;width:190px">Full Name:</td><td>${escapeHtml(name)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Company:</td><td>${escapeHtml(company || 'N/A')}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Email:</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Phone / WhatsApp:</td><td>${escapeHtml(phone || 'N/A')}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Country / Market:</td><td>${escapeHtml(country || 'N/A')}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Inquiry Type:</td><td>${escapeHtml(inquiryType || 'N/A')}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Product:</td><td><strong>${escapeHtml(product || 'General Catalog')}</strong></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Volume / Packaging:</td><td>${escapeHtml(volume || 'N/A')}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Language:</td><td>${escapeHtml(language.toUpperCase())}</td></tr>
        </table>
        <div style="margin-top:16px;padding:14px;background:#FFF7EC;border-left:4px solid #F4A83A;border-radius:6px">
          <div style="font-weight:bold;margin-bottom:6px">Message / Specifications:</div>
          <div style="white-space:pre-wrap;line-height:1.5">${escapeHtml(message || 'Standard export CIF/FOB quotation requested.')}</div>
        </div>
      </div>
    </div>
  `;

  const deliveredChannels: string[] = [];

  if (resendApiKey) {
    const fromAddress = (process.env.INQUIRY_FROM_EMAIL || 'VINAXO B2B Portal <onboarding@resend.dev>').trim();
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [recipientEmail],
        reply_to: email,
        subject,
        text: textSummary,
        html: htmlSummary,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text().catch(() => '');
      console.error('[VINAXO Inquiry Resend Error]', resendRes.status, errText.slice(0, 300));
      return sendJson(res, 502, {
        ok: false,
        delivered: false,
        code: 'DELIVERY_UPSTREAM_FAILED',
        recipient: recipientEmail,
        error:
          language === 'vi'
            ? 'Không thể chuyển email qua máy chủ gửi thư. Vui lòng sử dụng nút mở ứng dụng Email hoặc WhatsApp/Zalo bên dưới.'
            : 'Unable to dispatch via email relay right now. Please use the direct Email app, WhatsApp, or Zalo options below.',
      });
    }
    deliveredChannels.push('resend');
  }

  if (webhookUrl) {
    const webhookRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
        recipientEmail,
      }),
    });
    if (!webhookRes.ok && deliveredChannels.length === 0) {
      return sendJson(res, 502, {
        ok: false,
        delivered: false,
        code: 'DELIVERY_UPSTREAM_FAILED',
        recipient: recipientEmail,
        error:
          language === 'vi'
            ? 'Không thể kết nối cổng tiếp nhận yêu cầu. Vui lòng thử lại hoặc dùng Email/WhatsApp trực tiếp.'
            : 'Unable to reach inquiry webhook. Please retry or use direct Email/WhatsApp below.',
      });
    }
    if (webhookRes.ok) deliveredChannels.push('webhook');
  }

  recentSubmissionStore.set(dedupHash, now + DEDUP_WINDOW_MS);

  return sendJson(res, 200, {
    ok: true,
    delivered: true,
    channel: deliveredChannels.join('+'),
    referenceId,
    timestamp: submittedAt,
    recipient: recipientEmail,
  });
});
