import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Factory, CheckCircle, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { COMPANY_INFO } from '../data/company';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const About: React.FC = () => {
  const { language } = useLanguage();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const isVi = language === 'vi';

  const leadership = COMPANY_INFO.leadership;

  const facilityPhotos = [
    {
      imgWebp: '/assets/images/news/fruit-processing.webp',
      imgJpg: '/assets/images/news/fruit-processing.jpg',
      title: isVi
        ? 'Phân xưởng chế biến 4.000 m² & buồng sấy nhiệt thấp'
        : '4,000 m² Processing Facility & Low-Temperature Dehydrators',
      desc: isVi
        ? 'Khuôn viên nhà xưởng tại TT. Vĩnh Bình, H. Gò Công Tây, Tiền Giang trang bị 6 buồng sấy công nghệ cao và hệ thống kho lạnh bảo quản quả tươi.'
        : 'Located in Vinh Binh, Go Cong Tay, Tien Giang with 6 industrial low-temperature dehydration chambers and cold storage.',
    },
    {
      imgWebp: '/assets/images/news/tet-oem-production.webp',
      imgJpg: '/assets/images/news/tet-oem-production.jpg',
      title: isVi
        ? 'Dây chuyền đóng gói vô trùng & rà kim loại tự động'
        : 'Clean-Room Packaging & Metal Detection Line',
      desc: isVi
        ? 'Kiểm soát an toàn thực phẩm theo tiêu chuẩn BRCGS Hạng B, đáp ứng các đơn hàng xuất khẩu đi Hoa Kỳ, Châu Âu và gia công OEM.'
        : 'Operating under BRCGS Grade B food safety benchmarks with automated metal detection for US and European export orders.',
    },
    {
      imgWebp: '/assets/images/news/mango-procurement.webp',
      imgJpg: '/assets/images/news/mango-procurement.jpg',
      title: isVi
        ? 'Bao tiêu quả tươi trực tiếp tại vườn nông dân ĐBSCL'
        : 'Direct Harvest Procurement across Mekong Delta Orchards',
      desc: isVi
        ? 'Liên kết bền vững với nông dân Đồng Tháp, Tiền Giang, giải quyết bài toán tiêu thụ nông sản mùa vụ và ổn định nguồn nguyên liệu.'
        : 'Partnering directly with mango and tropical fruit farmers across Dong Thap and Tien Giang to stabilize harvest value.',
    },
  ];

  const milestones = [
    {
      year: '2018',
      title: isVi ? 'Khởi nguồn ý tưởng & Thử nghiệm công nghệ sấy' : 'Founding Vision & Low-Temp Drying R&D',
      desc: isVi
        ? 'Bắt đầu từ trăn trở trước cảnh nông sản miền Tây được mùa rớt giá, vợ chồng doanh nhân Nguyễn Anh Khoa và Hoàng Thị Thu Thảo đầu tư nghiên cứu quy trình sấy dẻo nhiệt thấp.'
        : 'Driven by the desire to elevate Mekong Delta harvest value, co-founders Nguyen Anh Khoa and Hoang Thi Thu Thao initiated R&D on low-temperature dehydration.',
    },
    {
      year: '2019',
      title: isVi ? 'Thành lập pháp nhân Công ty TNHH VINAXO' : 'Official Incorporation of VINAXO Co., Ltd.',
      desc: isVi
        ? 'Đăng ký pháp nhân doanh nghiệp với MST 1201611681 tại Sở Kế hoạch & Đầu tư tỉnh Tiền Giang, khởi công phân xưởng tại huyện Gò Công Tây.'
        : 'Formally registered under Tax ID 1201611681 and established the first-phase manufacturing facility in Go Cong Tay District, Tien Giang.',
    },
    {
      year: '2021',
      title: isVi ? 'Quy mô nhà xưởng 4.000 m² & Nâng công suất mùa dịch' : '4,000 m² Expansion & Seasonal Salvaging',
      desc: isVi
        ? 'Đầu tư hoàn thiện khuôn viên 4.000 m² với 6 máy sấy công nghiệp, được Báo Nông Nghiệp & Môi Trường ghi nhận giải cứu hàng chục tấn trái cây mỗi ngày.'
        : 'Commissioned 6 industrial dehydrators and cold storage, recognized by National Agricultural Press for processing tens of tons of fresh fruits daily.',
    },
    {
      year: '2023 - 2024',
      title: isVi ? 'Đạt chứng nhận OCOP 3 Sao & Bằng khen cấp tỉnh' : '3-Star OCOP Awards & Provincial Honors',
      desc: isVi
        ? 'Dòng Xoài, Mít, Thanh long sấy đạt chứng nhận OCOP 3 sao; Giám đốc Nguyễn Anh Khoa được trao Bằng khen Nông dân - Doanh nhân tiêu biểu; Phó GĐ Hoàng Thị Thu Thảo đạt Giải Nhì Khởi nghiệp đổi mới sáng tạo.'
        : 'Mango, Jackfruit, and Dragon fruit achieved 3-Star OCOP certification; Director Nguyen Anh Khoa honored as Provincial Exemplary Entrepreneur 2024.',
    },
    {
      year: '2025 - 2026',
      title: isVi ? 'Chuẩn BRCGS Grade B & Mở rộng xuất khẩu US, EU' : 'BRCGS Grade B & Strategic US/EU Export Growth',
      desc: isVi
        ? 'Thị trường Mỹ chiếm ~70% kim ngạch, Châu Âu chiếm ~20% với các bạn hàng Đức, Phần Lan. Nhà máy áp dụng ESG, BSCI và quy định EUDR khắt khe.'
        : 'US export accounts for ~70% of revenue, EU reaches ~20%. Processing facility benchmarks BRCGS Grade B and EUDR compliance for international retail chains.',
    },
  ];

  return (
    <div className="about-page">
      {/* Editorial Page Hero */}
      <PageHero
        badge={isVi ? 'HỒ SƠ DOANH NGHIỆP • CÔNG TY TNHH VINAXO' : 'CORPORATE PROFILE • VINAXO COMPANY LIMITED'}
        titleLine1={isVi ? 'Hành Trình Gắn Bó Nông Sản' : 'Rooted in Vietnam,'}
        titleLine2={isVi ? '& Sứ Mệnh Vươn Tầm Toàn Cầu' : 'Growing for a Healthier World'}
        description={
          isVi
            ? 'Công ty TNHH VINAXO (VINAXO Company Limited) — Doanh nghiệp chế biến sâu nông sản nhiệt đới tại Tiền Giang, kết nối vựa nguyên liệu trù phú Đồng bằng Sông Cửu Long với các thị trường xuất khẩu khó tính Hoa Kỳ, Liên minh Châu Âu và Châu Á.'
            : 'VINAXO Company Limited is a leading processor and exporter of tropical dried fruits based in Tien Giang Province, bridging the rich orchards of the Mekong Delta with demanding international markets across the US, Europe, and Asia.'
        }
        breadcrumbCurrent={isVi ? 'Giới Thiệu' : 'About Us'}
        theme="cream"
      />

      {/* ======================================================================
          SECTION 1 — EDITORIAL CORPORATE OVERVIEW
          ====================================================================== */}
      <section className="section section-white">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: 'clamp(36px, 5vw, 64px)',
              alignItems: 'center',
              marginBottom: '56px',
            }}
            className="grid-mobile-1"
          >
            <div>
              <span className="section-eyebrow">
                {isVi ? 'LỊCH SỬ & TÔN CHỈ HOẠT ĐỘNG' : 'MISSION & CORE PURPOSE'}
              </span>
              <h2
                className="title-serif"
                style={{
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                  color: 'var(--color-heading)',
                  marginTop: '10px',
                  marginBottom: '18px',
                  lineHeight: 1.25,
                }}
              >
                <span>{isVi ? 'Chế Biến Sâu Nông Sản,' : 'Deep Processing,'}</span>
                <br />
                <em style={{ color: 'var(--primary-green)' }}>
                  {isVi ? 'Gia Tăng Giá Trị Gấp 10 Lần' : 'Multiplying Harvest Value tenfold'}
                </em>
              </h2>

              <p
                style={{
                  fontSize: '0.96rem',
                  lineHeight: 1.75,
                  color: 'var(--color-body)',
                  marginBottom: '16px',
                }}
              >
                {isVi
                  ? 'Được thành lập với sứ mệnh giải quyết vòng luẩn quẩn "được mùa rớt giá" cho nhà vườn miền Tây, VINAXO tập trung toàn bộ nguồn lực vào chế biến sâu. Thay vì bán trái tươi dễ thối hỏng và phụ thuộc thương lái biên mậu, công nghệ sấy dẻo nhiệt thấp tuần hoàn (~60°C) giúp bảo toàn nguyên vẹn màu sắc vàng óng, dưỡng chất vi lượng và vị ngọt thanh đặc trưng.'
                  : 'Founded with the core mission of overcoming post-harvest price depressions for local fruit farmers, VINAXO directs full resources into industrial value-added processing. By replacing volatile raw fruit trading with convective dehydration at ~60°C, we preserve golden hues, vital micronutrients, and authentic tropical aroma.'}
              </p>

              <p
                style={{
                  fontSize: '0.96rem',
                  lineHeight: 1.75,
                  color: 'var(--color-body)',
                }}
              >
                {isVi
                  ? 'Theo tính toán thực tế tại xưởng, trung bình <strong>10 kg xoài tươi</strong> qua quy trình làm sạch, gọt vỏ và sấy nhiệt thấp sẽ cho ra <strong>1 kg thành phẩm sấy dẻo hảo hạng</strong>. Giá trị kinh tế tăng gấp 5 đến 10 lần so với bán quả tươi, tạo sinh kế ổn định cho hàng trăm hộ nông dân liên kết và công nhân địa phương.'
                  : 'Operating at a rigorous <strong>10:1 concentration ratio</strong> (10 kg of fresh fruit yields 1 kg of premium soft-dried produce), our process increases agricultural economic value by 5 to 10 times, sustaining stable incomes for hundreds of local farm households and plant technicians.'}
              </p>
            </div>

            {/* Corporate Factsheet Card */}
            <div
              className="card"
              style={{
                padding: '32px',
                backgroundColor: 'var(--cream-bg)',
                border: '1.5px solid var(--sage-border)',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--forest-green)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Factory size={20} />
                <span>{isVi ? 'Hồ Sơ Năng Lực Doanh Nghiệp' : 'Enterprise Credentials'}</span>
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  fontSize: '0.88rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-muted)' }}>{isVi ? 'Pháp nhân:' : 'Legal Name:'}</span>
                  <strong style={{ color: 'var(--color-heading)', textAlign: 'right' }}>
                    {isVi ? COMPANY_INFO.legalNameVi : COMPANY_INFO.legalNameEn}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-muted)' }}>{isVi ? 'Mã số thuế:' : 'Tax ID:'}</span>
                  <strong style={{ color: 'var(--color-heading)', fontFamily: 'monospace' }}>
                    {COMPANY_INFO.taxCode}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-muted)' }}>{isVi ? 'Năm thành lập:' : 'Established:'}</span>
                  <strong style={{ color: 'var(--color-heading)' }}>
                    2018 ({isVi ? 'ĐKKD 2019' : 'Inc. 2019'})
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-muted)' }}>{isVi ? 'Quy mô nhà máy:' : 'Facility Area:'}</span>
                  <strong style={{ color: 'var(--primary-green)' }}>
                    {COMPANY_INFO.facility.area} (Gò Công Tây, Tiền Giang)
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-muted)' }}>{isVi ? 'Công suất thu mua:' : 'Raw Procurement:'}</span>
                  <strong style={{ color: 'var(--color-heading)' }}>
                    {COMPANY_INFO.facility.capacityMonthlyRaw}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-muted)' }}>{isVi ? 'Thành phẩm sấy:' : 'Finished Output:'}</span>
                  <strong style={{ color: 'var(--color-heading)' }}>
                    {COMPANY_INFO.facility.capacityMonthlyFinished}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing Hubs Grid */}
          <div
            style={{
              padding: '28px',
              backgroundColor: 'var(--light-sage)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--sage-border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-green)', fontWeight: 700, marginBottom: '6px' }}>
                <MapPin size={18} />
                <span>{isVi ? 'Vựa Xoài Đồng Tháp' : 'Dong Thap Mango Hub'}</span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-body)', lineHeight: 1.6 }}>
                {isVi
                  ? 'Vùng trồng xoài Cát Chu và Cát Hòa Lộc đạt tiêu chuẩn OCOP 3 sao, độ ngọt thơm tự nhiên cao và múi quả đồng đều.'
                  : 'Sourcing premium Cat Chu and Hoa Loc mangoes recognized for balanced acidity, natural sweetness, and firm pulp.'}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-green)', fontWeight: 700, marginBottom: '6px' }}>
                <MapPin size={18} />
                <span>{isVi ? 'Vựa Khóm Tân Phước, Tiền Giang' : 'Tan Phuoc Pineapple Hub'}</span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-body)', lineHeight: 1.6 }}>
                {isVi
                  ? 'Thủ phủ khóm Queen nức tiếng miền Tây, sấy nhiệt thấp bảo toàn enzyme Bromelain và màu vàng ươm mọng mật.'
                  : 'Famed Queen pineapple epicenter, dehydrated gently to preserve bromelain enzymes and vibrant amber honey hues.'}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-green)', fontWeight: 700, marginBottom: '6px' }}>
                <MapPin size={18} />
                <span>{isVi ? 'Thanh Long Chợ Gạo & Mít Thái' : 'Cho Gao Dragon Fruit & Jackfruit'}</span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--color-body)', lineHeight: 1.6 }}>
                {isVi
                  ? 'Thanh long ruột đỏ giàu betalain cùng múi mít Thái tươi chín cây từ Tiền Giang, Hậu Giang, Vĩnh Long.'
                  : 'Antioxidant-rich red dragon fruit and tree-ripened jackfruit segments from specialized orchards.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 2 — REAL FACILITY GALLERY
          ====================================================================== */}
      <section className="section section-cream">
        <div className="container">
          <SectionHeading
            eyebrow={isVi ? 'HÌNH ẢNH CƠ SỞ VẬT CHẤT THỰC TẾ' : 'FACILITY & OPERATIONS GALLERY'}
            titleLine1={isVi ? 'Quy Mô Nhà Xưởng 4.000 m²' : 'Inside VINAXO Modern Facility'}
            titleLine2={isVi ? '& Dây Chuyền Sấy Công Nghệ Cao' : '& High-Tech Dehydration Line'}
            description={
              isVi
                ? 'Hình ảnh thực tế khuôn viên nhà xưởng, dây chuyền đóng gói vô trùng và hoạt động thu mua tại vùng nguyên liệu Đồng bằng Sông Cửu Long.'
                : 'Photographic documentation of our manufacturing plant, hygienic clean rooms, and agricultural harvest operations.'
            }
          />

          <div
            className="grid-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '24px',
            }}
          >
            {facilityPhotos.map((photo, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  backgroundColor: 'var(--white)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ position: 'relative', paddingTop: '62%', overflow: 'hidden' }}>
                  <picture>
                    <source srcSet={photo.imgWebp} type="image/webp" />
                    <img
                      src={photo.imgJpg}
                      alt={photo.title}
                      loading="lazy"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </picture>
                </div>
                <div style={{ padding: '22px' }}>
                  <h3
                    className="title-serif"
                    style={{
                      fontSize: '1.15rem',
                      color: 'var(--color-heading)',
                      marginBottom: '8px',
                      fontWeight: 700,
                    }}
                  >
                    {photo.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-body)', lineHeight: 1.6 }}>
                    {photo.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 3 — VERIFIED LEADERSHIP TEAM
          ====================================================================== */}
      <section className="section section-white">
        <div className="container">
          <SectionHeading
            eyebrow={isVi ? 'BAN LÃNH ĐẠO XÁC MINH' : 'EXECUTIVE LEADERSHIP'}
            titleLine1={isVi ? 'Đội Ngũ Sáng Lập & Điều Hành' : 'Founders & Commercial Leadership'}
            titleLine2={isVi ? 'Đồng Hành Cùng Nông Sản Việt' : 'Guiding Global Agricultural Growth'}
            description={
              isVi
                ? 'Thông tin lãnh đạo doanh nghiệp đã được xác minh qua hồ sơ ĐKKD quốc gia, các bài báo chính luận và quyết định khen thưởng của UBND tỉnh Tiền Giang.'
                : 'Executive profiles verified against the National Business Registry and official press records.'
            }
          />

          <div
            className="grid-3 leadership-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {leadership.map((leader, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '28px',
                  backgroundColor: 'var(--cream-bg)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--light-sage)',
                      color: 'var(--primary-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      marginBottom: '18px',
                    }}
                  >
                    {leader.name
                      .split(' ')
                      .pop()
                      ?.charAt(0) || 'V'}
                  </div>

                  <h3
                    className="title-serif"
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: 'var(--color-heading)',
                      marginBottom: '4px',
                    }}
                  >
                    {leader.name}
                  </h3>

                  <div
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: 'var(--primary-green)',
                      marginBottom: '14px',
                    }}
                  >
                    {isVi ? leader.titleVi : leader.titleEn}
                  </div>

                  {leader.honorVi && (
                    <div
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--sage-border)',
                        fontSize: '0.8rem',
                        color: 'var(--color-body-dark)',
                        lineHeight: 1.5,
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Sparkles size={14} color="#D4A373" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{leader.honorVi}</span>
                    </div>
                  )}

                  {leader.spokespersonFor && (
                    <div
                      style={{
                        marginTop: '10px',
                        fontSize: '0.78rem',
                        color: 'var(--color-muted)',
                      }}
                    >
                      {leader.spokespersonFor}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    marginTop: '20px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--color-border)',
                    fontSize: '0.78rem',
                    color: 'var(--color-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle size={14} color="var(--primary-green)" />
                  <span>{isVi ? 'Hồ sơ xác minh chính thức' : 'Officially Verified Profile'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 4 — COMPANY TIMELINE & HISTORY
          ====================================================================== */}
      <section className="section section-cream">
        <div className="container">
          <SectionHeading
            eyebrow={isVi ? 'LỊCH SỬ PHÁT TRIỂN' : 'COMPANY MILESTONES'}
            titleLine1={isVi ? 'Chặng Đường Hình Thành' : 'Milestones of Dedication'}
            titleLine2={isVi ? '& Vươn Xa Quốc Tế (2018 - 2026)' : '& Global Expansion (2018 - 2026)'}
            description={
              isVi
                ? 'Những dấu mốc phát triển khẳng định năng lực chế biến sâu và nỗ lực nâng tầm trái cây sấy Việt Nam.'
                : 'A timeline documenting our journey from local startup innovation to export-grade food safety standards.'
            }
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              maxWidth: '860px',
              margin: '0 auto',
            }}
          >
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '24px 28px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  className="title-serif"
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: 'var(--forest-green)',
                    lineHeight: 1,
                    minWidth: '84px',
                    paddingTop: '4px',
                  }}
                >
                  {m.year}
                </div>

                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--color-heading)',
                      marginBottom: '6px',
                    }}
                  >
                    {m.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--color-body)', lineHeight: 1.65 }}>
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 5 — B2B COOPERATION CTA
          ====================================================================== */}
      <section className="section section-white">
        <div className="container text-center">
          <div
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              padding: 'clamp(36px, 5vw, 56px) 24px',
              backgroundColor: 'var(--light-sage)',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--sage-border)',
            }}
          >
            <span className="section-eyebrow">
              {isVi ? 'ĐỐI TÁC THƯƠNG MẠI B2B & OEM' : 'B2B COMMERCIAL COOPERATION'}
            </span>
            <h2
              className="title-serif"
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
                color: 'var(--forest-green)',
                marginTop: '12px',
                marginBottom: '16px',
              }}
            >
              {isVi ? 'Đồng Hành Cùng VINAXO Vươn Ra Toàn Cầu' : 'Partner with VINAXO for Global Growth'}
            </h2>
            <p
              style={{
                fontSize: '0.94rem',
                color: 'var(--color-body-dark)',
                lineHeight: 1.7,
                marginBottom: '28px',
              }}
            >
              {isVi
                ? 'Chúng tôi chào đón các nhà nhập khẩu, chuỗi siêu thị và đối tác gia công OEM liên hệ để nhận hồ sơ năng lực, mẫu thử nghiệm sản phẩm và báo giá CIF/FOB.'
                : 'We welcome international importers, supermarket buyers, and OEM partners to request company dossiers, product sample kits, and CIF/FOB quotations.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => onOpenQuote()}
                icon={<ArrowRight size={16} />}
              >
                {isVi ? 'Yêu Cầu Báo Giá B2B' : 'Request B2B Quote'}
              </Button>
              <Link to="/contact">
                <Button variant="secondary" size="lg">
                  {isVi ? 'Liên Hệ Trực Tiếp' : 'Direct Inquiry'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
