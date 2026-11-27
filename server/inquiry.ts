import crypto from 'crypto';
import { getClientIp, readJsonBody, sendJson, stripUnsafeKeys, wrapHandler } from './lib/security.js';
import { productsData } from '../src/data/products.js';

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

function stripHeaderBreaks(val: string): string {
  return val.replace(/[\r\n]+/g, ' ').trim();
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

function verifyCanonicalProduct(rawProductId: string, rawProductName: string): {
  verifiedId: string;
  verifiedLabel: string;
  isCatalogVerified: boolean;
} {
  const candidates = [rawProductId, rawProductName].map((s) => s.trim().toLowerCase()).filter(Boolean);
  for (const needle of candidates) {
    const matched = productsData.find(
      (p) =>
        p.slug.toLowerCase() === needle ||
        p.id.toLowerCase() === needle ||
        p.name.toLowerCase() === needle ||
        p.nameVi.toLowerCase() === needle ||
        p.nameKo?.toLowerCase() === needle ||
        p.nameZh?.toLowerCase() === needle ||
        p.en?.name?.toLowerCase() === needle ||
        p.vi?.name?.toLowerCase() === needle ||
        p.ko?.name?.toLowerCase() === needle ||
        p.zh?.name?.toLowerCase() === needle ||
        p.aliases?.some((a) => a.toLowerCase() === needle)
    );
    if (matched) {
      return {
        verifiedId: matched.slug,
        verifiedLabel: `${matched.nameVi} / ${matched.name} (${matched.slug})`,
        isCatalogVerified: true,
      };
    }
    if (needle === 'value-added-lines') {
      return {
        verifiedId: 'value-added-lines',
        verifiedLabel: 'Honey-Infused / Chocolate-Dipped / Granola (OEM)',
        isCatalogVerified: true,
      };
    }
    if (needle === 'oem-private-label') {
      return {
        verifiedId: 'oem-private-label',
        verifiedLabel: 'OEM / ODM & Private Label Project',
        isCatalogVerified: true,
      };
    }
  }

  return {
    verifiedId: rawProductId || '',
    verifiedLabel: rawProductName || '',
    isCatalogVerified: false,
  };
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

  type ServerInquiryLang = 'vi' | 'en' | 'ko' | 'zh-CN';
  const rawLang = String(rawBody.locale || rawBody.language || '').trim();
  const language: ServerInquiryLang =
    rawLang === 'en' ? 'en' : rawLang === 'ko' ? 'ko' : rawLang === 'zh-CN' || rawLang === 'zh' ? 'zh-CN' : 'vi';
  const pickMsg = (m: Record<ServerInquiryLang, string>) => m[language];

  const requestType =
    rawBody.requestType === 'quotation' || rawBody.formType === 'quote' ? 'quotation' : 'contact';
  const fullName = stripHeaderBreaks(cleanText(rawBody.fullName || rawBody.name, 100));
  const rawEmailInput = String(rawBody.email || '');
  const hasEmailHeaderInjection = /[\r\n]/.test(rawEmailInput);
  const email = stripHeaderBreaks(cleanText(rawEmailInput, 120));
  const phone = stripHeaderBreaks(cleanText(rawBody.phone, 30));
  const company = cleanText(rawBody.company, 150);
  const country = cleanText(rawBody.country, 100);
  const inquiryType = cleanText(rawBody.inquiryType, 150);
  const rawProductId = cleanText(rawBody.productId, 120);
  const rawProductName = cleanText(rawBody.productName || rawBody.product, 200);
  const quantity = cleanText(rawBody.quantity || rawBody.volume, 200);
  const message = cleanText(rawBody.message, 3000);
  const sourcePage = cleanText(rawBody.source || rawBody.sourcePage, 200) || (requestType === 'quotation' ? 'QuoteModal' : '/contact');

  // Unified required validation across ALL forms: fullName (>=2), email (RFC & no CRLF), message (>=5)
  const errors: string[] = [];
  if (fullName.length < 2) {
    errors.push(pickMsg({
      vi: 'Vui lòng nhập họ tên đầy đủ (tối thiểu 2 ký tự).',
      en: 'Full name must be at least 2 characters.',
      ko: '성함은 2자 이상 입력해 주세요.',
      'zh-CN': '姓名至少需包含 2 个字符。'
    }));
  }
  if (hasEmailHeaderInjection || !EMAIL_REGEX.test(email)) {
    errors.push(pickMsg({
      vi: 'Email không đúng định dạng.',
      en: 'Invalid email address.',
      ko: '올바른 이메일 주소를 입력해 주세요.',
      'zh-CN': '电子邮箱格式无效。'
    }));
  }
  if (message.length < 5) {
    errors.push(pickMsg({
      vi: 'Vui lòng nhập nội dung yêu cầu chi tiết (tối thiểu 5 ký tự).',
      en: 'Please provide your inquiry details (at least 5 characters).',
      ko: '문의 내용을 최소 5자 이상 입력해 주세요.',
      'zh-CN': '请填写至少 5 个字符的详细需求说明。'
    }));
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

  const verifiedProduct = verifyCanonicalProduct(rawProductId, rawProductName);

  // Deduplicate rapid repeated submissions
  const dedupHash = crypto
    .createHash('sha256')
    .update(`${email.toLowerCase()}|${requestType}|${verifiedProduct.verifiedId || rawProductName}|${message}`)
    .digest('hex');
  const existingExpiry = recentSubmissionStore.get(dedupHash);
  if (existingExpiry && now < existingExpiry) {
    return sendJson(res, 409, {
      ok: false,
      delivered: false,
      code: 'DUPLICATE_SUBMISSION',
      error: pickMsg({
        vi: 'Yêu cầu giống hệt vừa được gửi trước đó. Vui lòng đợi 1 phút trước khi gửi lại.',
        en: 'An identical inquiry was just submitted. Please wait 1 minute before retrying.',
        ko: '동일한 문의가 방금 접수되었습니다. 1분 후 다시 시도해 주세요.',
        'zh-CN': '刚已提交相同的咨询内容，请等待 1 分钟后再试。'
      }),
    });
  }

  const recipientEmail = (process.env.CONTACT_TO_EMAIL || process.env.INQUIRY_TO_EMAIL || DEFAULT_RECIPIENT).trim();
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  const brevoApiKey = (process.env.BREVO_API_KEY || '').trim();
  const webhookUrl = (process.env.INQUIRY_WEBHOOK_URL || '').trim();

  if (!resendApiKey && !brevoApiKey && !webhookUrl) {
    return sendJson(res, 503, {
      ok: false,
      delivered: false,
      code: 'DELIVERY_NOT_CONFIGURED',
      recipient: recipientEmail,
      error: pickMsg({
        vi: 'Hệ thống gửi thư tự động trên máy chủ chưa được kích hoạt (chưa có RESEND_API_KEY / BREVO_API_KEY). Dữ liệu bạn nhập vẫn được giữ nguyên — vui lòng liên hệ trực tiếp qua Hotline, WhatsApp hoặc Zalo bên dưới.',
        en: 'Server email dispatch is not activated yet. Your entered information is preserved — please use Hotline, WhatsApp, or Zalo below.',
        ko: '서버 자동 이메일 발송 설정이 아직 완료되지 않았습니다. 입력 정보는 유지되오니 아래 핫라인, WhatsApp 또는 Zalo를 이용해 주세요.',
        'zh-CN': '服务器自动邮件发送尚未完成配置，您填写的信息已保留，请通过下方热线、WhatsApp 或 Zalo 直接联系我们。'
      }),
    });
  }

  const referenceId = `VNX-${new Date(now).toISOString().slice(0, 10).replace(/-/g, '')}-${crypto
    .randomBytes(3)
    .toString('hex')
    .toUpperCase()}`;
  const submittedAt = new Date(now).toISOString();

  const productDisplayForEmail = verifiedProduct.verifiedLabel || 'N/A (Liên hệ chung)';
  const cleanSubjectProduct = stripHeaderBreaks(verifiedProduct.verifiedLabel || inquiryType || '');
  const subject =
    requestType === 'quotation' && cleanSubjectProduct
      ? `[VINAXO] Yêu cầu báo giá mới – ${cleanSubjectProduct} (${referenceId})`
      : `[VINAXO] Yêu cầu liên hệ mới (${referenceId})`;

  const textSummary = [
    `VINAXO B2B REQUEST (${referenceId})`,
    `========================================`,
    `Request ID: ${referenceId}`,
    `Request Type: ${requestType}`,
    `Submitted At: ${submittedAt}`,
    `----------------------------------------`,
    `Full Name: ${fullName}`,
    `Email (Reply-To): ${email}`,
    `Phone / WhatsApp: ${phone || 'N/A'}`,
    `Company: ${company || 'N/A'}`,
    `Country / Market: ${country || 'N/A'}`,
    `Inquiry Purpose: ${inquiryType || 'N/A'}`,
    `Product ID: ${verifiedProduct.verifiedId || 'N/A'}`,
    `Product (Verified): ${productDisplayForEmail}`,
    `Catalog Verified: ${verifiedProduct.isCatalogVerified ? 'YES' : 'NO / Custom'}`,
    `Estimated Quantity: ${quantity || 'N/A'}`,
    `Customer Locale: ${language}`,
    `Source Page: ${sourcePage}`,
    `----------------------------------------`,
    `Message:`,
    message,
  ].join('\n');

  const htmlSummary = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#291810;border:1px solid #eadcc8;border-radius:12px;overflow:hidden">
      <div style="background:#3A2417;color:#FFF7EC;padding:18px 24px">
        <h2 style="margin:0;font-size:18px">${escapeHtml(subject)}</h2>
        <p style="margin:6px 0 0;font-size:13px;opacity:.85">Nguồn: ${escapeHtml(sourcePage)} • Ngôn ngữ: ${escapeHtml(language)} • ${escapeHtml(submittedAt)}</p>
      </div>
      <div style="padding:20px 24px;background:#FFFDF9">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;font-weight:bold;width:190px">Mã yêu cầu:</td><td><strong>${escapeHtml(referenceId)}</strong></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Loại yêu cầu:</td><td>${escapeHtml(requestType)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Họ tên khách hàng:</td><td>${escapeHtml(fullName)}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Email (Reply-To):</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Số điện thoại:</td><td>${escapeHtml(phone || 'N/A')}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Doanh nghiệp:</td><td>${escapeHtml(company || 'N/A')}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Quốc gia / Thị trường:</td><td>${escapeHtml(country || 'N/A')}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Sản phẩm quan tâm:</td><td><strong>${escapeHtml(productDisplayForEmail)}</strong></td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Số lượng dự kiến:</td><td>${escapeHtml(quantity || 'N/A')}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Mục đích liên hệ:</td><td>${escapeHtml(inquiryType || 'N/A')}</td></tr>
          <tr><td style="padding:6px 0;font-weight:bold">Ngôn ngữ / Nguồn:</td><td>${escapeHtml(language)} (${escapeHtml(sourcePage)})</td></tr>
        </table>
        <div style="margin-top:16px;padding:14px;background:#FFF7EC;border-left:4px solid #F4A83A;border-radius:6px">
          <div style="font-weight:bold;margin-bottom:6px">Nội dung yêu cầu:</div>
          <div style="white-space:pre-wrap;line-height:1.55">${escapeHtml(message)}</div>
        </div>
      </div>
    </div>
  `;

  const deliveredChannels: string[] = [];
  let providerMessageId: string | undefined;

  if (resendApiKey) {
    const fromAddress = stripHeaderBreaks(
      process.env.CONTACT_FROM_EMAIL || process.env.INQUIRY_FROM_EMAIL || 'VINAXO B2B Portal <onboarding@resend.dev>'
    );
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
      console.error(`[VINAXO Inquiry Resend Error] status=${resendRes.status} ref=${referenceId}`);
      return sendJson(res, 502, {
        ok: false,
        delivered: false,
        code: 'DELIVERY_UPSTREAM_FAILED',
        recipient: recipientEmail,
        error: pickMsg({
          vi: 'Không thể chuyển email qua máy chủ gửi thư lúc này. Vui lòng thử lại hoặc dùng kênh Hotline/WhatsApp/Zalo bên dưới.',
          en: 'Unable to dispatch via email relay right now. Please retry or use Hotline/WhatsApp/Zalo below.',
          ko: '현재 메일 중계 서버 전송에 실패했습니다. 다시 시도하거나 아래 핫라인/WhatsApp/Zalo를 이용해 주세요.',
          'zh-CN': '邮件中继服务暂时无法发送。请重试或通过下方热线/WhatsApp/Zalo 联系我们。'
        }),
      });
    }

    const resendText = await resendRes.text().catch(() => '');
    try {
      const resendJson = JSON.parse(resendText || '{}') as { id?: string };
      if (typeof resendJson?.id === 'string') providerMessageId = resendJson.id;
    } catch {}
    deliveredChannels.push('resend');
  } else if (brevoApiKey) {
    const rawFrom = stripHeaderBreaks(
      process.env.CONTACT_FROM_EMAIL || process.env.INQUIRY_FROM_EMAIL || 'no-reply@vinaxo.net'
    );
    const emailMatch = rawFrom.match(/^(?:(.+?)\s*)?<([^<>]+)>$/);
    const sender = emailMatch
      ? { name: (emailMatch[1] || 'VINAXO B2B Portal').trim(), email: emailMatch[2].trim() }
      : { name: 'VINAXO B2B Portal', email: rawFrom };

    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender,
        to: [{ email: recipientEmail }],
        replyTo: { email, name: fullName },
        subject,
        textContent: textSummary,
        htmlContent: htmlSummary,
      }),
    });

    if (!brevoRes.ok) {
      console.error(`[VINAXO Inquiry Brevo Error] status=${brevoRes.status} ref=${referenceId}`);
      return sendJson(res, 502, {
        ok: false,
        delivered: false,
        code: 'DELIVERY_UPSTREAM_FAILED',
        recipient: recipientEmail,
        error: pickMsg({
          vi: 'Không thể chuyển email qua máy chủ gửi thư lúc này. Vui lòng thử lại hoặc dùng kênh hỗ trợ bên dưới.',
          en: 'Unable to dispatch via email relay right now. Please retry or use the direct channels below.',
          ko: '현재 메일 발송에 실패했습니다. 다시 시도하거나 아래 연락 채널을 이용해 주세요.',
          'zh-CN': '邮件发送服务暂时异常，请重试或通过下方直接联系方式联系我们。'
        }),
      });
    }

    const brevoText = await brevoRes.text().catch(() => '');
    try {
      const brevoJson = JSON.parse(brevoText || '{}') as { messageId?: string };
      if (typeof brevoJson?.messageId === 'string') providerMessageId = brevoJson.messageId;
    } catch {}
    deliveredChannels.push('brevo');
  }

  if (webhookUrl) {
    const webhookRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referenceId,
        submittedAt,
        requestType,
        sourcePage,
        locale: language,
        verifiedProductId: verifiedProduct.verifiedId,
        verifiedProductLabel: productDisplayForEmail,
        quantity,
        inquiryType,
        company,
        country,
      }),
    });
    if (!webhookRes.ok && deliveredChannels.length === 0) {
      return sendJson(res, 502, {
        ok: false,
        delivered: false,
        code: 'DELIVERY_UPSTREAM_FAILED',
        recipient: recipientEmail,
        error: pickMsg({
          vi: 'Không thể kết nối cổng tiếp nhận yêu cầu. Vui lòng thử lại hoặc liên hệ trực tiếp.',
          en: 'Unable to reach inquiry webhook. Please retry or use direct contact channels.',
          ko: '문의 접수 서버에 연결할 수 없습니다. 다시 시도하거나 직접 연락해 주세요.',
          'zh-CN': '无法连接询盘接收接口，请重试或通过直接渠道联系。'
        }),
      });
    }
    if (webhookRes.ok) deliveredChannels.push('webhook');
  }

  recentSubmissionStore.set(dedupHash, now + DEDUP_WINDOW_MS);

  return sendJson(res, 200, {
    ok: true,
    delivered: true,
    channel: deliveredChannels.join('+'),
    ...(providerMessageId ? { providerMessageId } : {}),
    referenceId,
    timestamp: submittedAt,
    recipient: recipientEmail,
    verifiedProductId: verifiedProduct.verifiedId || undefined,
  });
});
