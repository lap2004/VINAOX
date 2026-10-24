import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Phone, Mail, ShieldCheck, Factory } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { COMPANY_INFO } from '../data/company';
import { PageHero } from '../components/ui/PageHero';
import { ContactForm } from '../components/forms/ContactForm';

export const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialProduct = searchParams.get('product') || '';
  const { language } = useLanguage();
  const isVi = language === 'vi';

  return (
    <div className="contact-page">
      {/* Page Hero */}
      <PageHero
        badge={isVi ? 'LIÊN HỆ & BÁO GIÁ XUẤT KHẨU B2B' : 'B2B COMMERCIAL INQUIRIES & QUOTES'}
        titleLine1={isVi ? 'Kết Nối Doanh Nghiệp' : 'Contact VINAXO'}
        titleLine2={isVi ? '& Yêu Cầu Báo Giá Trực Tiếp' : '& Request Export Quotations'}
        description={
          isVi
            ? 'Trực tiếp liên hệ Ban Lãnh đạo và Bộ phận Thương mại Quốc tế Công ty TNHH VINAXO để nhận tư vấn chào hàng FOB/CIF, bảng kiểm nghiệm an toàn thực phẩm COA và mẫu thử nghiệm trái cây sấy.'
            : 'Get in direct contact with VINAXO’s executive team and export desk for FOB/CIF quotations, product specification sheets, and international commercial sample kits.'
        }
        breadcrumbCurrent={isVi ? 'Liên Hệ' : 'Contact'}
        theme="cream"
      />

      {/* Main Contact Section: Left Info Cards, Right Contact Form */}
      <section className="section section-white">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '0.95fr 1.05fr',
              gap: 'clamp(36px, 5vw, 64px)',
              alignItems: 'flex-start',
            }}
            className="grid-mobile-1"
          >
            {/* Left Column: Verified Corporate & Factory Information */}
            <div>
              <div style={{ marginBottom: '32px' }}>
                <span className="section-eyebrow">
                  {isVi ? 'THÔNG TIN PHÁP LÝ & CƠ SỞ' : 'HEADQUARTERS & MANUFACTURING'}
                </span>
                <h2
                  className="title-serif"
                  style={{
                    fontSize: 'clamp(1.7rem, 2.6vw, 2.3rem)',
                    color: 'var(--color-heading)',
                    marginTop: '10px',
                    marginBottom: '14px',
                  }}
                >
                  {isVi ? 'CÔNG TY TNHH VINAXO' : 'VINAXO COMPANY LIMITED'}
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--color-body)', lineHeight: 1.65 }}>
                  {isVi
                    ? 'Doanh nghiệp chuyên chế biến sâu và xuất khẩu trái cây sấy dẻo tự nhiên từ Đồng bằng Sông Cửu Long. Đầy đủ pháp nhân, mã số thuế và cơ sở sản xuất tại tỉnh Tiền Giang.'
                    : 'Specialized processor and exporter of Mekong Delta natural dried fruits. Fully accredited enterprise registered with the National Business Registry.'}
                </p>
              </div>

              {/* Information Cards Stack */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Card 1: Headquarters & Factory */}
                <div
                  className="card"
                  style={{
                    padding: '24px',
                    backgroundColor: 'var(--cream-bg)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--light-sage)',
                        color: 'var(--primary-green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Factory size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '4px' }}>
                        {isVi ? 'Trụ Sở & Nhà Máy Chế Biến 4.000 m²' : 'Plant & Headquarters'}
                      </h3>
                      <p style={{ fontSize: '0.86rem', color: 'var(--color-body)', lineHeight: 1.6 }}>
                        {isVi
                          ? COMPANY_INFO.headquarters.addressVi
                          : COMPANY_INFO.headquarters.addressEn}
                      </p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '6px' }}>
                        {isVi ? 'Vùng nguyên liệu: ' : 'Sourcing Hubs: '}
                        <strong>{isVi ? COMPANY_INFO.headquarters.sourcingHubVi : COMPANY_INFO.headquarters.sourcingHubEn}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Phone & Email */}
                <div
                  className="card"
                  style={{
                    padding: '24px',
                    backgroundColor: 'var(--cream-bg)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Hotline */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--light-sage)',
                          color: 'var(--primary-green)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Phone size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--color-muted)' }}>
                          {isVi ? 'Hotline Điều Hành:' : 'Direct Hotline:'}
                        </div>
                        <a
                          href={`tel:${COMPANY_INFO.contacts.hotline}`}
                          style={{
                            fontSize: '0.96rem',
                            fontWeight: 700,
                            color: 'var(--primary-green)',
                          }}
                        >
                          {COMPANY_INFO.contacts.phoneDisplay}
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--light-sage)',
                          color: 'var(--primary-green)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Mail size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--color-muted)' }}>
                          {isVi ? 'Email Thương Mại:' : 'Commercial Email:'}
                        </div>
                        <a
                          href={`mailto:${COMPANY_INFO.contacts.email}`}
                          style={{
                            fontSize: '0.86rem',
                            fontWeight: 600,
                            color: 'var(--color-heading)',
                            wordBreak: 'break-all',
                          }}
                        >
                          {COMPANY_INFO.contacts.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Legal Tax Code & Standards */}
                <div
                  className="card"
                  style={{
                    padding: '24px',
                    backgroundColor: 'var(--light-sage)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--sage-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <ShieldCheck size={20} color="var(--primary-green)" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--forest-green)' }}>
                      {isVi ? 'Xác Minh Pháp Lý & Chứng Nhận' : 'Legal Verification & Standards'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: 'var(--color-body-dark)', lineHeight: 1.65 }}>
                    <div>
                      • <strong>{isVi ? 'Mã số thuế: ' : 'Tax Code: '}</strong>
                      <span style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>{COMPANY_INFO.taxCode}</span>
                    </div>
                    <div>
                      • <strong>{isVi ? 'Chứng nhận an toàn thực phẩm: ' : 'Accreditations: '}</strong>
                      BRCGS Food Safety Grade B, OCOP 3 Sao Tiền Giang & Đồng Tháp
                    </div>
                    <div>
                      • <strong>{isVi ? 'Website bán lẻ chính thức: ' : 'Official Retail Site: '}</strong>
                      <a href={COMPANY_INFO.contacts.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-green)', textDecoration: 'underline' }}>
                        https://vinaxo.net
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Unified B2B Quote & Contact Form */}
            <div>
              <ContactForm initialProduct={initialProduct} />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 2 — VERIFIED GOOGLE MAPS EMBED (VINH BINH, GO CONG TAY)
          ====================================================================== */}
      <section className="section section-cream" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div style={{ marginBottom: '24px' }}>
            <span className="section-eyebrow">
              {isVi ? 'VỊ TRÍ ĐỊA LÝ & NHÀ MÁY' : 'GEOGRAPHIC LOCATION & MAP'}
            </span>
            <h2 className="title-serif" style={{ fontSize: '1.6rem', color: 'var(--color-heading)' }}>
              {isVi
                ? 'Vị Trí Nhà Máy Tại Thị Trấn Vĩnh Bình, Huyện Gò Công Tây, Tiền Giang'
                : 'Facility Map: Vinh Binh Town, Go Cong Tay District, Tien Giang Province'}
            </h2>
          </div>

          <div
            style={{
              width: '100%',
              height: '420px',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              backgroundColor: '#E5E7EB',
            }}
          >
            <iframe
              title="VINAXO Facility Location Map"
              src="https://maps.google.com/maps?q=V%C4%A9nh%20B%C3%ACnh,%20G%C3%B2%20C%C3%B4ng%20T%C3%A2y,%20Ti%E1%BB%81n%20Giang,%20Vi%E1%BB%87t%20Nam&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
