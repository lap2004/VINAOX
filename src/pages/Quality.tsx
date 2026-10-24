import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Award, ShieldCheck, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const Quality: React.FC = () => {
  const { language } = useLanguage();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const isVi = language === 'vi';

  const processSteps = [
    {
      step: '01',
      title: isVi ? 'Tuyển Chọn Quả Tươi Tại Vườn' : 'Raw Fruit Harvesting & Sorting',
      desc: isVi
        ? 'Thu mua trực tiếp từ các vùng trồng chuyên canh Đồng Tháp, Tiền Giang. Trái cây được thu hái đúng độ chín cây tự nhiên (Brix tiêu chuẩn), loại bỏ hoàn toàn quả dập nát.'
        : 'Sourced directly from certified Mekong Delta orchards. Fruits are harvested at prime ripeness to ensure optimal natural sugar content, strictly culling damaged produce.',
    },
    {
      step: '02',
      title: isVi ? 'Rửa Khử Khuẩn Ozone & Gọt Vỏ Phòng Sạch' : 'Ozone Sanitization & Peeling',
      desc: isVi
        ? 'Sơ chế và rửa qua hệ thống bồn sục khí ozone nhằm loại bỏ tạp chất và dư lượng thuốc BVTV. Toàn bộ công đoạn gọt vỏ diễn ra trong phân xưởng đạt chuẩn vệ sinh BRCGS.'
        : 'Washed in multi-stage ozone bubbling baths to eliminate microbial surface flora. Clean-room peeling complies with BRCGS international hygiene protocols.',
    },
    {
      step: '03',
      title: isVi ? 'Cắt Lát Tiêu Chuẩn Đồng Đều' : 'Precision Slicing & Formulation',
      desc: isVi
        ? 'Thịt quả được cắt lát với độ dày chuẩn xác, đảm bảo diện tích thoát ẩm đồng đều giữa các miếng sấy, không sử dụng đường tinh luyện hay hóa chất tẩy màu.'
        : 'Precision slicing ensures uniform dehydration thickness across all pieces. Free from added refined sugars or chemical bleaching agents.',
    },
    {
      step: '04',
      title: isVi ? 'Sấy Dẻo Nhiệt Thấp Tuần Hoàn (~60°C)' : 'Gentle Low-Heat Convective Dehydration',
      desc: isVi
        ? '6 buồng sấy công nghệ cao điều khiển tự động nhiệt độ 50 - 60°C và độ ẩm tuần hoàn. Giữ trọn cấu trúc dẻo mềm, màu sắc vàng óng và các vitamin A, C quý giá.'
        : '6 industrial dehydrators maintain controlled 50-60°C convective air circulation. This gentle heat retains pliable texture, vivid natural colors, and heat-sensitive vitamins.',
    },
    {
      step: '05',
      title: isVi ? 'Kiểm Soát Máy Dò Kim Loại Tự Động' : 'Automated Metal Detection & Sealing',
      desc: isVi
        ? '100% sản phẩm thành phẩm đi qua băng chuyền máy dò kim loại tự động trước khi đóng túi zip nhôm và nạp khí Nitơ bảo vệ chống oxy hóa.'
        : '100% of finished batches pass through automated industrial metal detectors before entering nitrogen-flushed barrier pouches.',
    },
    {
      step: '06',
      title: isVi ? 'Lưu Kho Lạnh & Kiểm Nghiệm COA Lô Hàng' : 'Cold Storage & Batch COA Release',
      desc: isVi
        ? 'Sản phẩm được bảo quản trong hệ thống kho lạnh kiểm soát nhiệt độ và độ ẩm nghiêm ngặt. Mỗi lô xuất khẩu đều được cấp phiếu kiểm nghiệm vi sinh (COA) và chứng thư kiểm dịch.'
        : 'Stored under climate-controlled conditions. Every export consignment is released with microbiology Certificate of Analysis (COA) and phytosanitary clearance.',
    },
  ];

  return (
    <div className="quality-page">
      {/* Page Hero */}
      <PageHero
        badge={isVi ? 'TIÊU CHUẨN CHẤT LƯỢNG • BRCGS & OCOP' : 'QUALITY ASSURANCE • BRCGS & OCOP'}
        titleLine1={isVi ? 'Cam Kết Chất Lượng' : 'International Food Safety'}
        titleLine2={isVi ? '& Quy Trình Sản Xuất Khép Kín' : '& Closed-Loop Dehydration Process'}
        description={
          isVi
            ? 'Quy chuẩn an toàn thực phẩm BRCGS Grade B, sản phẩm OCOP 3 sao và cam kết 100% tự nhiên không đường tinh luyện. Cơ sở chế biến 4.000 m² tại Tiền Giang của VINAXO đáp ứng các tiêu chuẩn kiểm dịch nghiêm ngặt của Hoa Kỳ và Châu Âu.'
            : 'BRCGS Food Safety Grade B compliance, 3-Star OCOP recognition, and 100% natural purity. VINAXO’s 4,000 m² modern plant in Tien Giang fulfills strict US FDA and European food regulatory benchmarks.'
        }
        breadcrumbCurrent={isVi ? 'Chất Lượng & Sản Xuất' : 'Our Quality'}
        theme="cream"
      />

      {/* ======================================================================
          SECTION 1 — VERIFIED CERTIFICATIONS MATRIX
          ====================================================================== */}
      <section className="section section-white">
        <div className="container">
          <SectionHeading
            eyebrow={isVi ? 'CHỨNG NHẬN ĐÃ ĐƯỢC XÁC MINH' : 'VERIFIED ACCREDITATIONS'}
            titleLine1={isVi ? 'Hệ Thống Tiêu Chuẩn' : 'Certified Quality System'}
            titleLine2={isVi ? 'Đạt Chuẩn BRCGS Grade B & OCOP' : 'Benchmarked for Global Supermarkets'}
            description={
              isVi
                ? 'Thông tin chứng nhận chính thức của VINAXO, phân biệt rõ các tiêu chuẩn đã đạt được và các cam kết trách nhiệm xã hội đang triển khai thực tế.'
                : 'Official verified certifications and social compliance frameworks implemented across VINAXO operations.'
            }
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '56px',
            }}
          >
            {/* Cert 1: BRCGS Grade B */}
            <div
              className="card"
              style={{
                padding: '28px',
                backgroundColor: 'var(--cream-bg)',
                border: '1.5px solid var(--sage-border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <Award size={28} color="var(--primary-green)" />
                <span className="badge badge-green">VERIFIED STANDARD</span>
              </div>
              <h3 className="title-serif" style={{ fontSize: '1.3rem', color: 'var(--color-heading)', marginBottom: '6px' }}>
                BRCGS Food Safety
              </h3>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-green)', marginBottom: '10px' }}>
                Grade B Global Standard Certification
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-body)', lineHeight: 1.65 }}>
                {isVi
                  ? 'Tiêu chuẩn an toàn thực phẩm toàn cầu BRCGS Hạng B được Báo Người Lao Động ghi nhận, đáp ứng điều kiện nhập khẩu của các hệ thống phân phối lớn tại Hoa Kỳ và Liên minh Châu Âu.'
                  : 'BRCGS Food Safety Grade B benchmark recognized by accredited press, enabling seamless retail distribution across European and North American supermarkets.'}
              </p>
            </div>

            {/* Cert 2: OCOP 3-Star */}
            <div
              className="card"
              style={{
                padding: '28px',
                backgroundColor: 'var(--cream-bg)',
                border: '1.5px solid var(--sage-border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <Sparkles size={28} color="#D4A373" />
                <span className="badge badge-gold">VERIFIED OCOP</span>
              </div>
              <h3 className="title-serif" style={{ fontSize: '1.3rem', color: 'var(--color-heading)', marginBottom: '6px' }}>
                OCOP 3-Star Produce
              </h3>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92541C', marginBottom: '10px' }}>
                Đồng Tháp & Tiền Giang Recognition
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-body)', lineHeight: 1.65 }}>
                {isVi
                  ? 'Chứng nhận sản phẩm OCOP 3 sao cho các dòng Xoài sấy dẻo, Mít sấy dẻo và Thanh long sấy dẻo, ghi nhận quy trình chế biến nông sản đặc sản vùng nguyên liệu đạt chuẩn chất lượng quốc gia.'
                  : 'Official 3-Star OCOP recognition for Dried Mango, Jackfruit, and Dragon fruit, validating premium regional origin and government-audited processing quality.'}
              </p>
            </div>

            {/* Cert 3: BSCI & ESG */}
            <div
              className="card"
              style={{
                padding: '28px',
                backgroundColor: 'var(--cream-bg)',
                border: '1.5px solid var(--sage-border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <ShieldCheck size={28} color="#1D4ED8" />
                <span className="badge badge-blue">ACTIVE PROGRAM</span>
              </div>
              <h3 className="title-serif" style={{ fontSize: '1.3rem', color: 'var(--color-heading)', marginBottom: '6px' }}>
                BSCI & Green ESG
              </h3>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1D4ED8', marginBottom: '10px' }}>
                Social Compliance & EUDR Alignment
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-body)', lineHeight: 1.65 }}>
                {isVi
                  ? 'Chương trình tuân thủ trách nhiệm xã hội BSCI, đảm bảo môi trường làm việc công bằng, không sử dụng lao động trẻ em và chuỗi cung ứng minh bạch đáp ứng quy định chống phá rừng EUDR của Châu Âu.'
                  : 'BSCI social responsibility framework ensuring fair workplace ethics, zero child labor, and supply chain traceability aligned with European EUDR standards.'}
              </p>
            </div>

            {/* Cert 4: Clean Label */}
            <div
              className="card"
              style={{
                padding: '28px',
                backgroundColor: 'var(--cream-bg)',
                border: '1.5px solid var(--sage-border)',
                borderRadius: 'var(--radius-lg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <CheckCircle2 size={28} color="var(--primary-green)" />
                <span className="badge badge-green">100% NATURAL</span>
              </div>
              <h3 className="title-serif" style={{ fontSize: '1.3rem', color: 'var(--color-heading)', marginBottom: '6px' }}>
                Clean Label Guarantee
              </h3>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-green)', marginBottom: '10px' }}>
                Zero Chemical Preservatives
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-body)', lineHeight: 1.65 }}>
                {isVi
                  ? 'Cam kết thành phần 100% quả tươi chín tự nhiên, không bổ sung đường hóa học, không phẩm màu nhân tạo, an toàn tuyệt đối cho sức khỏe người tiêu dùng quốc tế.'
                  : '100% natural fruit formulation with zero artificial flavorings, colorants, or added sugar, catering directly to healthy snacking trends worldwide.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 2 — 6-STEP CLOSED MANUFACTURING PROCESS
          ====================================================================== */}
      <section className="section section-cream">
        <div className="container">
          <SectionHeading
            eyebrow={isVi ? 'QUY TRÌNH SẢN XUẤT 6 BƯỚC KHÉP KÍN' : 'CLOSED MANUFACTURING PROCESS'}
            titleLine1={isVi ? 'Từ Vùng Trồng ĐBSCL' : 'From Mekong Delta Orchards'}
            titleLine2={isVi ? 'Đến Thành Phẩm Sấy Xuất Khẩu' : 'to Export-Ready Dehydrated Fruits'}
            description={
              isVi
                ? '6 công đoạn kiểm soát nghiêm ngặt theo tiêu chuẩn an toàn thực phẩm BRCGS Grade B, đảm bảo chất lượng thành phẩm đồng đều trên từng lô hàng xuất khẩu.'
                : 'A 6-step rigorous quality protocol compliant with BRCGS standards, ensuring peak sensory quality and food safety.'
            }
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {processSteps.map((p, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '28px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  position: 'relative',
                }}
              >
                <div
                  className="title-serif"
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: 'rgba(23, 77, 50, 0.2)',
                    lineHeight: 1,
                    marginBottom: '10px',
                  }}
                >
                  {p.step}
                </div>

                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--color-heading)',
                    marginBottom: '10px',
                  }}
                >
                  {p.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.86rem',
                    color: 'var(--color-body)',
                    lineHeight: 1.65,
                  }}
                >
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 3 — PRODUCTION FACILITY METRICS & CTA
          ====================================================================== */}
      <section className="section section-white">
        <div className="container">
          <div
            style={{
              padding: 'clamp(32px, 5vw, 48px)',
              backgroundColor: 'var(--light-sage)',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--sage-border)',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '36px',
              alignItems: 'center',
            }}
            className="grid-mobile-1"
          >
            <div>
              <span className="section-eyebrow">
                {isVi ? 'CƠ SỞ VẬT CHẤT & KHO VẬN' : 'FACILITY CAPACITY'}
              </span>
              <h2
                className="title-serif"
                style={{
                  fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                  color: 'var(--forest-green)',
                  marginTop: '10px',
                  marginBottom: '14px',
                }}
              >
                {isVi
                  ? 'Nhà Máy Chế Biến 4.000 m² Tại Tiền Giang'
                  : '4,000 m² Processing & Cold Storage Facility'}
              </h2>
              <p
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.7,
                  color: 'var(--color-body-dark)',
                  marginBottom: '20px',
                }}
              >
                {isVi
                  ? 'Khuôn viên nhà máy tại Thị trấn Vĩnh Bình, Huyện Gò Công Tây, tỉnh Tiền Giang với tổng vốn đầu tư ban đầu 15 tỷ đồng. Trang bị 6 buồng sấy nhiệt thấp công nghệ cao, khu vực sơ chế ozone, phòng đệm vô trùng và kho lạnh bảo quản bảo toàn phẩm chất quả tươi.'
                  : 'Located in Vinh Binh Town, Go Cong Tay District, Tien Giang with over 15 billion VND in initial infrastructure. Equipped with 6 convective drying chambers, ozone washing tanks, sterile packing rooms, and deep cold storage.'}
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button
                  variant="primary"
                  onClick={() => onOpenQuote()}
                  icon={<ArrowRight size={15} />}
                >
                  {isVi ? 'Yêu Cầu Báo Giá & COA Mẫu' : 'Request Pricing & COA'}
                </Button>
                <Link to="/contact">
                  <Button variant="secondary">
                    {isVi ? 'Liên Hệ Khảo Sát Nhà Máy' : 'Schedule Facility Tour'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Parameters Box */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <div
                style={{
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--sage-border)',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  {isVi ? 'Diện tích xưởng' : 'Plant Area'}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-green)' }}>
                  4,000 m²
                </div>
              </div>

              <div
                style={{
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--sage-border)',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  {isVi ? 'Thu mua quả tươi' : 'Raw Fruit Input'}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-green)' }}>
                  1,000+ Tấn/th
                </div>
              </div>

              <div
                style={{
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--sage-border)',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  {isVi ? 'Thành phẩm sấy dẻo' : 'Finished Output'}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-green)' }}>
                  70 - 120 Tấn/th
                </div>
              </div>

              <div
                style={{
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--sage-border)',
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: '4px' }}>
                  {isVi ? 'Tỷ lệ sấy trung bình' : 'Concentration Ratio'}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-green)' }}>
                  10 : 1
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Quality;
