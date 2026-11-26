import { COMPANY_INFO } from '../data/company';
import { pickLocale, type Language } from '../i18n/localize';

export interface InquiryPayload {
  formType: 'contact' | 'quote';
  language: Language;
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
        pickLocale(payload.language, {
          vi: 'Hệ thống chưa thể gửi yêu cầu tự động lúc này. Vui lòng sử dụng kênh liên hệ thay thế bên dưới.',
          en: 'Automatic dispatch is currently unavailable. Please use one of the direct fallback options below.',
          ko: '현재 자동 이메일 전송을 이용할 수 없습니다. 아래의 직접 연락 채널을 이용해 주세요.',
          zh: '当前暂时无法自动发送请求，请使用下方直接联系方式与我们取得联系。'
        }),
    };
  } catch (err: any) {
    const isAbort = err?.name === 'AbortError';
    return {
      ok: false,
      delivered: false,
      code: isAbort ? 'TIMEOUT' : 'NETWORK_ERROR',
      recipient: COMPANY_INFO.contacts.email,
      error: isAbort
        ? pickLocale(payload.language, {
            vi: 'Kết nối quá thời gian chờ (timeout). Dữ liệu của bạn vẫn được giữ nguyên — vui lòng thử lại hoặc mở ứng dụng Email.',
            en: 'Request timed out. Your entered details are preserved — please retry or use your Email app below.',
            ko: '요청 시간이 초과되었습니다. 입력하신 정보는 그대로 유지되오니 다시 시도하거나 이메일 앱을 이용해 주세요.',
            zh: '请求超时。您填写的内容已保留，请重试或通过下方邮件客户端发送。'
          })
        : pickLocale(payload.language, {
            vi: 'Lỗi kết nối mạng. Dữ liệu của bạn vẫn được giữ nguyên — vui lòng thử lại hoặc mở ứng dụng Email.',
            en: 'Network error occurred. Your entered details are preserved — please retry or use your Email app below.',
            ko: '네트워크 연결 오류가 발생했습니다. 입력 정보는 유지되오니 다시 시도하거나 아래 이메일 앱을 이용해 주세요.',
            zh: '网络连接错误。您填写的内容已保留，请重试或使用下方邮件客户端。'
          }),
    };
  } finally {
    window.clearTimeout(timer);
  }
}
