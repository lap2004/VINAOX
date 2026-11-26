import { COMPANY_INFO } from '../data/company';

export interface InquiryPayload {
  formType: 'contact' | 'quote';
  language: 'vi' | 'en';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  inquiryType?: string;
  product?: string;
  volume?: string;
  message?: string;
  sourcePage?: string;
  hp_website?: string;
}

export interface InquiryResult {
  ok: boolean;
  delivered: boolean;
  code?: string;
  channel?: string;
  referenceId?: string;
  timestamp?: string;
  recipient?: string;
  error?: string;
}

export function buildInquirySubject(payload: InquiryPayload): string {
  const tag = payload.formType === 'quote' ? 'VINAXO B2B Quote Request' : 'VINAXO B2B Inquiry';
  const topic = payload.product || payload.inquiryType || 'Agricultural Export';
  return `[${tag}] ${topic} - ${payload.name}`;
}

export function buildInquiryPlainText(payload: InquiryPayload): string {
  return [
    'VINAXO B2B WHOLESALE & EXPORT INQUIRY',
    '----------------------------------------',
    `Full Name: ${payload.name}`,
    `Company: ${payload.company || 'N/A'}`,
    `Email: ${payload.email}`,
    `Phone / WhatsApp: ${payload.phone || 'N/A'}`,
    `Country / Market: ${payload.country || 'N/A'}`,
    `Inquiry Type: ${payload.inquiryType || 'N/A'}`,
    `Product of Interest: ${payload.product || 'General Catalog'}`,
    `Volume & Packaging: ${payload.volume || 'N/A'}`,
    `Language: ${payload.language.toUpperCase()}`,
    '----------------------------------------',
    'Requirements / Message:',
    payload.message || 'Standard export CIF/FOB quotation requested.',
  ].join('\n');
}

export function buildMailtoHref(payload: InquiryPayload, recipient?: string): string {
  const target = recipient || COMPANY_INFO.contacts.email;
  const subject = encodeURIComponent(buildInquirySubject(payload));
  const body = encodeURIComponent(buildInquiryPlainText(payload));
  return `mailto:${target}?subject=${subject}&body=${body}`;
}

export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResult> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch('/api/inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.ok === true && data?.delivered === true) {
      return {
        ok: true,
        delivered: true,
        channel: data.channel,
        referenceId: data.referenceId,
        timestamp: data.timestamp,
        recipient: data.recipient,
      };
    }

    return {
      ok: false,
      delivered: false,
      code: data?.code || `HTTP_${res.status}`,
      recipient: data?.recipient || COMPANY_INFO.contacts.email,
      error:
        data?.error ||
        (payload.language === 'vi'
          ? 'Hệ thống chưa thể gửi yêu cầu tự động lúc này. Vui lòng sử dụng kênh liên hệ thay thế bên dưới.'
          : 'Automatic dispatch is currently unavailable. Please use one of the direct fallback options below.'),
    };
  } catch (err: any) {
    const isAbort = err?.name === 'AbortError';
    return {
      ok: false,
      delivered: false,
      code: isAbort ? 'TIMEOUT' : 'NETWORK_ERROR',
      recipient: COMPANY_INFO.contacts.email,
      error: isAbort
        ? payload.language === 'vi'
          ? 'Kết nối quá thời gian chờ (timeout). Dữ liệu của bạn vẫn được giữ nguyên — vui lòng thử lại hoặc mở ứng dụng Email.'
          : 'Request timed out. Your entered details are preserved — please retry or use your Email app below.'
        : payload.language === 'vi'
        ? 'Lỗi kết nối mạng. Dữ liệu của bạn vẫn được giữ nguyên — vui lòng thử lại hoặc mở ứng dụng Email.'
        : 'Network error occurred. Your entered details are preserved — please retry or use your Email app below.',
    };
  } finally {
    window.clearTimeout(timer);
  }
}
