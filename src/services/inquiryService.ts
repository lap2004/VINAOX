import type { ContactRequest } from '../components/contact/contactSchema';
import { pickLocale, type Language } from '../i18n/localize';

export type InquiryPayload = ContactRequest;

export interface InquiryResult {
  ok: boolean;
  delivered: boolean;
  code?: string;
  channel?: string;
  providerMessageId?: string;
  referenceId?: string;
  timestamp?: string;
  recipient?: string;
  error?: string;
}

export function buildInquiryPlainText(payload: ContactRequest): string {
  const fullName = payload.fullName || payload.name || '';
  const productLabel = payload.productName || payload.product || payload.productId || 'General Catalog';
  const qty = payload.quantity || payload.volume || 'N/A';
  const loc = payload.locale || payload.language || 'vi';
  return [
    'VINAXO B2B WHOLESALE & EXPORT INQUIRY',
    '----------------------------------------',
    `Request Type: ${payload.requestType}`,
    `Full Name: ${fullName}`,
    `Company: ${payload.company || 'N/A'}`,
    `Email: ${payload.email}`,
    `Phone / WhatsApp: ${payload.phone || 'N/A'}`,
    `Country / Market: ${payload.country || 'N/A'}`,
    `Inquiry Type: ${payload.inquiryType || 'N/A'}`,
    `Product ID: ${payload.productId || 'general'}`,
    `Product of Interest: ${productLabel}`,
    `Estimated Quantity / Packaging: ${qty}`,
    `Language: ${loc.toUpperCase()}`,
    `Source: ${payload.source || payload.sourcePage || '/'}`,
    '----------------------------------------',
    'Requirements / Message:',
    payload.message,
  ].join('\n');
}

export async function submitInquiry(payload: ContactRequest): Promise<InquiryResult> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 15000);
  const locale: Language = payload.locale || payload.language || 'vi';

  const requestBody: ContactRequest = {
    ...payload,
    name: payload.fullName || payload.name || '',
    fullName: payload.fullName || payload.name || '',
    formType: payload.requestType === 'quotation' ? 'quote' : 'contact',
    locale,
    language: locale,
    product: payload.productName || payload.product || payload.productId || '',
    volume: payload.quantity || payload.volume || '',
    sourcePage: payload.source || payload.sourcePage || '/',
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.ok === true && data?.delivered === true) {
      return {
        ok: true,
        delivered: true,
        channel: data.channel,
        providerMessageId: data.providerMessageId,
        referenceId: data.referenceId,
        timestamp: data.timestamp,
        recipient: data.recipient,
      };
    }

    return {
      ok: false,
      delivered: false,
      code: data?.code || `HTTP_${res.status}`,
      recipient: data?.recipient,
      error:
        data?.error ||
        pickLocale(locale, {
          vi: 'Hệ thống chưa thể gửi yêu cầu tự động lúc này. Dữ liệu bạn đã nhập vẫn được giữ nguyên — bạn có thể thử lại hoặc dùng kênh hỗ trợ trực tiếp bên dưới.',
          en: 'Automatic dispatch is unavailable right now. Your entered information is preserved — please retry or use one of the direct channels below.',
          ko: '현재 자동 전송 서비스를 이용할 수 없습니다. 입력하신 정보는 유지되오니 다시 시도하거나 아래 직통 채널을 이용해 주세요.',
          'zh-CN': '当前暂时无法自动提交，您填写的内容已保留。请点击重试或通过下方直连渠道联系我们。',
        }),
    };
  } catch (err: any) {
    const isAbort = err?.name === 'AbortError';
    return {
      ok: false,
      delivered: false,
      code: isAbort ? 'TIMEOUT' : 'NETWORK_ERROR',
      error: isAbort
        ? pickLocale(locale, {
            vi: 'Kết nối quá thời gian chờ. Dữ liệu của bạn vẫn được giữ nguyên — vui lòng bấm Thử gửi lại.',
            en: 'Request timed out. Your details are preserved — please click Retry Submission.',
            ko: '요청 시간이 초과되었습니다. 입력 내용은 유지되오니 다시 전송을 눌러 주세요.',
            'zh-CN': '请求超时。您的填写内容已保留，请点击重新提交。',
          })
        : pickLocale(locale, {
            vi: 'Lỗi kết nối mạng. Dữ liệu của bạn vẫn được giữ nguyên — vui lòng kiểm tra mạng và thử lại.',
            en: 'Network error occurred. Your details are preserved — please check your connection and retry.',
            ko: '네트워크 연결 오류가 발생했습니다. 입력 내용은 유지되오니 연결 확인 후 다시 시도해 주세요.',
            'zh-CN': '网络连接出错。您的填写内容已保留，请检查网络后重试。',
          }),
    };
  } finally {
    window.clearTimeout(timer);
  }
}
