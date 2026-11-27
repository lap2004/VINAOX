import React from 'react';
import { AlertTriangle, Check, CheckCircle2, Copy, Phone, RefreshCw } from 'lucide-react';
import { COMPANY_INFO } from '../../data/company';
import { pickLocale, type Language } from '../../i18n/localize';
import type { ContactRequest } from './contactSchema';
import { buildInquiryPlainText } from '../../services/inquiryService';

export interface ContactFormStatusProps {
  locale: Language;
  isSubmitted: boolean;
  referenceId?: string;
  errorMessage?: string;
  failedPayload?: ContactRequest | null;
  onRetry?: () => void;
  isSubmitting?: boolean;
}

export const ContactFormStatus: React.FC<ContactFormStatusProps> = ({
  locale,
  isSubmitted,
  referenceId,
  errorMessage,
  failedPayload,
  onRetry,
  isSubmitting = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!failedPayload) return;
    try {
      await navigator.clipboard.writeText(buildInquiryPlainText(failedPayload));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        role="status"
        style={{
          marginTop: '14px',
          padding: '14px 16px',
          backgroundColor: '#ECFDF5',
          border: '1px solid #34D399',
          borderRadius: 'var(--radius-sm)',
          color: '#065F46',
          fontSize: '0.875rem',
          lineHeight: 1.55,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontWeight: 600 }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
          <div>
            <div>
              {pickLocale(locale, {
                vi: 'Yêu cầu của bạn đã được hệ thống tiếp nhận. Đội ngũ VINAXO sẽ liên hệ lại trong thời gian sớm nhất.',
                en: 'Your request has been received by our system. The VINAXO team will get back to you as soon as possible.',
                ko: '요청이 시스템에 정상 접수되었습니다. VINAXO 팀이 검토 후 빠른 시일 내에 연락드리겠습니다.',
                'zh-CN': '您的请求已成功提交至系统，VINAXO 团队将尽快与您联系跟进。',
              })}
            </div>
            {referenceId && (
              <div style={{ marginTop: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                {pickLocale(locale, {
                  vi: `Mã yêu cầu: ${referenceId}`,
                  en: `Reference ID: ${referenceId}`,
                  ko: `접수 번호: ${referenceId}`,
                  'zh-CN': `申请编号：${referenceId}`,
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!errorMessage) return null;

  return (
    <div
      role="alert"
      style={{
        marginTop: '14px',
        marginBottom: '14px',
        padding: '12px 16px',
        backgroundColor: '#FEF2F2',
        border: '1px solid #FCA5A5',
        borderRadius: 'var(--radius-sm)',
        color: '#991B1B',
        fontSize: '0.86rem',
        lineHeight: 1.5,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontWeight: 600 }}>
        <AlertTriangle size={17} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
        <span>{errorMessage}</span>
      </div>

      {failedPayload && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ padding: '7px 12px', fontSize: '0.78rem' }}
            >
              <RefreshCw size={13} aria-hidden="true" />
              <span>
                {pickLocale(locale, {
                  vi: 'Thử gửi lại',
                  en: 'Retry Submission',
                  ko: '다시 전송',
                  'zh-CN': '重新提交',
                })}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="btn btn-outline"
            style={{ padding: '7px 12px', fontSize: '0.78rem' }}
          >
            {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
            <span>
              {copied
                ? pickLocale(locale, { vi: 'Đã sao chép', en: 'Copied', ko: '복사됨', 'zh-CN': '已复制' })
                : pickLocale(locale, { vi: 'Sao chép nội dung', en: 'Copy Details', ko: '내용 복사', 'zh-CN': '复制询盘内容' })}
            </span>
          </button>

          <a
            href={`tel:${COMPANY_INFO.contacts.hotline}`}
            className="btn btn-outline"
            style={{ padding: '7px 12px', fontSize: '0.78rem', textDecoration: 'none' }}
          >
            <Phone size={13} aria-hidden="true" />
            <span>{COMPANY_INFO.contacts.phoneDisplay}</span>
          </a>

          <a
            href={COMPANY_INFO.contacts.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ padding: '7px 12px', fontSize: '0.78rem', textDecoration: 'none' }}
          >
            WhatsApp
          </a>

          <a
            href={COMPANY_INFO.contacts.zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ padding: '7px 12px', fontSize: '0.78rem', textDecoration: 'none' }}
          >
            Zalo
          </a>
        </div>
      )}
    </div>
  );
};
