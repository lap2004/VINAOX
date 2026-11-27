import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { productsData, getProductLocalized } from '../../data/products';
import { pickLocale, type Language } from '../../i18n/localize';

export const ContactHoneypotField: React.FC<{
  id: string;
  name: string;
  value: string;
  onChange: (val: string) => void;
}> = ({ id, name, value, onChange }) => (
  <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
    <label htmlFor={id}>Leave this field blank</label>
    <input
      type="text"
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
    />
  </div>
);

export const ContactPrivacyNotice: React.FC<{ locale: Language; compact?: boolean }> = ({ locale, compact = false }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
      fontSize: compact ? '0.78rem' : '0.8rem',
      color: 'var(--color-muted)',
      lineHeight: 1.45,
    }}
  >
    <ShieldCheck size={16} color="var(--primary-green)" style={{ flexShrink: 0 }} aria-hidden="true" />
    <span>
      {pickLocale(locale, {
        vi: 'Thông tin của bạn chỉ được sử dụng để bộ phận xuất khẩu VINAXO phản hồi yêu cầu này.',
        en: 'Your information is used strictly by VINAXO Export Desk to respond to this inquiry.',
        ko: '입력하신 정보는 VINAXO 수출팀의 문의 회신 목적으로만 안전하게 사용됩니다.',
        'zh-CN': '您提交的信息仅用于 VINAXO 出口业务团队回复本次咨询。',
      })}
    </span>
  </div>
);

export const SelectedProductPreview: React.FC<{ productId: string; locale: Language }> = ({ productId, locale }) => {
  if (!productId) return null;
  const matched = productsData.find((p) => p.slug === productId || p.id === productId);
  if (!matched) return null;
  const localized = getProductLocalized(matched, locale);

  return (
    <div
      data-testid="selected-product-preview"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        marginBottom: '12px',
        borderRadius: '10px',
        backgroundColor: 'var(--cream-bg)',
        border: '1px solid var(--soft-border)',
      }}
    >
      <img
        src={matched.imageWebp || matched.imageJpg || '/images/products/placeholder.webp'}
        alt={localized.name}
        style={{
          width: '48px',
          height: '48px',
          objectFit: 'cover',
          borderRadius: '8px',
          border: '1px solid rgba(58, 36, 23, 0.12)',
          flexShrink: 0,
        }}
      />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--primary-green)',
          }}
        >
          {pickLocale(locale, {
            vi: 'Sản phẩm đang yêu cầu báo giá',
            en: 'Quoting Selected Product',
            ko: '견적 요청 선택 품목',
            'zh-CN': '当前询价产品',
          })}
        </div>
        <div
          style={{
            fontSize: '0.92rem',
            fontWeight: 700,
            color: 'var(--dark-chocolate)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {localized.name}
        </div>
      </div>
    </div>
  );
};
