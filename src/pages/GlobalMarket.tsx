import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Ship, Anchor, Clock, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { WorldMapSvg } from '../components/markets/WorldMapSvg';
import { Button } from '../components/ui/Button';
import { MainLayoutContext } from '../components/layout/MainLayout';

export const GlobalMarket: React.FC = () => {
  const { language } = useLanguage();
  const { onOpenQuote } = useOutletContext<MainLayoutContext>();
  const isVi = language === 'vi';

  const marketCards = [
    {
      country: isVi ? 'Thị Trường Hoa Kỳ (United States)' : 'United States Export Market',
      share: isVi ? '~70% Kim Ngạch Xuất Khẩu' : '~70% Total Export Share',
      source: isVi ? 'Nguồn: Báo Người Lao Động (02/03/2025)' : 'Source: Người Lao Động Newspaper',
      ports: isVi ? 'Cảng đến: Long Beach, Oakland, Los Angeles' : 'Key Discharge Ports: Long Beach, Oakland, Los Angeles',
      transit: isVi ? '22 - 28 Ngày (Tuyến hải trình xuyên Thái Bình Dương)' : '22 - 28 Days (Trans-Pacific Maritime Freight)',
      desc: isVi
        ? 'Hoa Kỳ là thị trường xuất khẩu lớn nhất của VINAXO. Người tiêu dùng Mỹ đặc biệt ưa chuộng sản phẩm Xoài sấy dẻo tự nhiên không thêm đường (Clean Label) và các dòng trái cây nhiệt đới sấy dẻo giữ trọn vi chất.'
        : 'The US represents VINAXO’s primary export destination. American consumers strongly favor clean-label soft-dried mango with zero added sugars and nutrient-dense tropical varieties.',
      products: isVi ? 'Xoài sấy dẻo, Thanh long sấy dẻo, Chuối sấy dẻo' : 'Dried Mango, Dragon Fruit, Dried Banana',
    },
    {
      country: isVi ? 'Liên Minh Châu Âu (European Union)' : 'European Union Export Market',
      share: isVi ? '~20% Doanh Số Xuất Khẩu' : '~20% Export Sales Share',
      source: isVi ? 'Nguồn: Báo Người Lao Động (02/03/2025)' : 'Source: Người Lao Động Newspaper',
      ports: isVi ? 'Cảng đến: Hamburg (Đức), Rotterdam (Hà Lan), Helsinki (Phần Lan)' : 'Key Discharge Ports: Hamburg (Germany), Rotterdam, Helsinki',
      transit: isVi ? '28 - 35 Ngày (Tuyến Á - Âu qua Kênh Suez hoặc Mũi Hảo Vọng)' : '28 - 35 Days (Asia - Europe Maritime Route)',
      desc: isVi
        ? 'Châu Âu là thị trường có tiêu chuẩn chất lượng khắt khe nhất. VINAXO đáp ứng tiêu chuẩn an toàn thực phẩm BRCGS Grade B, tuân thủ trách nhiệm xã hội BSCI và quy định chống phá rừng EUDR đối với các dòng sản phẩm phủ sô-cô-la.'
        : 'Demanding the highest compliance benchmarks, Europe relies on VINAXO’s BRCGS Grade B food safety, BSCI social responsibility, and EUDR-compliant cocoa supply chains.',
      products: isVi ? 'Trái cây sấy BRCGS, Thanh năng lượng trái cây nhúng Sô-cô-la' : 'BRCGS Dried Fruits, Chocolate-Enrobed Energy Bars',
    },
    {
      country: isVi ? 'Thị Trường Nga & Đông Âu (Russia & CIS)' : 'Russia & Eastern Europe Market',
      share: isVi ? 'Đối Tác Thường Xuyên' : 'Established Seasonal Partner',
      source: isVi ? 'Nguồn: Báo 24H (19/11/2024)' : 'Source: 24H Consumer Press',
      ports: isVi ? 'Cảng đến: Vladivostok, Saint Petersburg, Novorossiysk' : 'Key Discharge Ports: Vladivostok, St. Petersburg, Novorossiysk',
      transit: isVi ? '18 - 25 Ngày' : '18 - 25 Days Maritime Transit',
      desc: isVi
        ? 'Đối tác tiêu thụ thường xuyên dòng trái cây sấy dẻo nhiệt đới trong các mùa vụ lễ Tết. Sản phẩm được đóng gói thùng carton xuất khẩu và túi zip bảo quản khí trơ đảm bảo độ dẻo mềm nguyên bản.'
        : 'Consistent seasonal volume partner for tropical dried fruit lines, shipped in nitrogen-flushed barrier bags and master export cartons.',
      products: isVi ? 'Xoài sấy dẻo, Mít sấy chân không, Chuối sấy dẻo' : 'Dried Mango, Vacuum Jackfruit, Soft-Dried Banana',
    },
    {
      country: isVi ? 'Hàn Quốc & Đông Á (South Korea & East Asia)' : 'South Korea & East Asia Market',
      share: isVi ? 'Thị Trường Tiềm Năng Cao' : 'High-Growth Asian Market',
      source: isVi ? 'Nguồn: Báo Đồng Tháp (19/09/2025)' : 'Source: Dong Thap Economic Press',
      ports: isVi ? 'Cảng đến: Busan, Incheon' : 'Key Discharge Ports: Busan, Incheon',
      transit: isVi ? '7 - 10 Ngày (Thời gian vận chuyển nhanh)' : '7 - 10 Days Short Maritime Transit',
      desc: isVi
        ? 'Hàn Quốc và các nước Đông Á đánh giá rất cao chất lượng ngọt thanh tự nhiên của giống xoài Cát Chu và thơm Tân Phước sấy dẻo. Lợi thế địa lý giúp tối ưu hóa chi phí logistics đường biển.'
        : 'East Asian markets value the delicate sweetness of Mekong Delta Cat Chu mango and Tan Phuoc pineapple, with distinct advantages in rapid maritime turnaround.',
      products: isVi ? 'Xoài Cát Chu sấy dẻo, Thơm sấy dẻo Tân Phước' : 'Cat Chu Dried Mango, Tan Phuoc Dried Pineapple',
    },
  ];

  return (
    <div className="markets-page">
      {/* Page Hero */}
      <PageHero
        badge={isVi ? 'MẠNG LƯỚI XUẤT KHẨU TOÀN CẦU • GLOBAL REACH' : 'EXPORT REACH • INTERNATIONAL TRADE'}
        titleLine1={isVi ? 'Thị Trường Toàn Cầu' : 'Global Export Network'}
        titleLine2={isVi ? '& Tuyến Vận Tải Quốc Tế' : '& International Trade Routes'}
        description={
          isVi
            ? 'Tổng quan cơ cấu thị trường xuất khẩu đã được xác minh của VINAXO: ~70% kim ngạch phục vụ các đối tác tại Hoa Kỳ, ~20% cung ứng cho thị trường Châu Âu (Đức, Phần Lan) cùng bạn hàng thường xuyên tại Hàn Quốc và Nga.'
            : 'Verified export distribution overview of VINAXO: ~70% of shipments bound for the United States, ~20% serving European buyers (Germany, Finland), alongside recurring shipments to South Korea and Russia.'
        }
        breadcrumbCurrent={isVi ? 'Thị Trường Toàn Cầu' : 'Global Market'}
        theme="cream"
      />

      {/* ======================================================================
          SECTION 1 — INTERACTIVE WORLD MAP & EXPORT ARCS
          ====================================================================== */}
      <section className="section section-white">
        <div className="container">
          <SectionHeading
            eyebrow={isVi ? 'BẢN ĐỒ TUYẾN ĐƯỜNG XUẤT KHẨU' : 'EXPORT SHIPPING ROUTES'}
            titleLine1={isVi ? 'Hải Trình Từ Vịnh Thái Lan / Cảng Cát Lái' : 'Shipping from Vietnam Ocean Hub'}
            titleLine2={isVi ? 'Tới Các Cảng Biển Quốc Tế' : 'to Key World Seaports'}
            description={
              isVi
                ? 'Nhấp chuột vào từng điểm đến trên bản đồ để tra cứu thông tin chi tiết về cảng đến, thời gian hải trình và các mặt hàng nông sản sấy chủ lực.'
                : 'Click any destination marker on the interactive map to view arrival ports, transit duration, and core exported fruit lines.'
            }
          />

          <WorldMapSvg interactive={true} />
        </div>
      </section>

      {/* ======================================================================
          SECTION 2 — DETAILED MARKET PROFILES & ACCREDITED SOURCES
          ====================================================================== */}
      <section className="section section-cream">
        <div className="container">
          <SectionHeading
            eyebrow={isVi ? 'DỮ LIỆU THỊ TRƯỜNG ĐÃ ĐƯỢC XÁC MINH' : 'VERIFIED DESTINATION PROFILES'}
            titleLine1={isVi ? 'Hồ Sơ Các Thị Trường Trọng Điểm' : 'Core International Markets'}
            titleLine2={isVi ? '& Năng Lực Vận Chuyển Hải Trình' : '& Logistics Specifications'}
            description={
              isVi
                ? 'Thông tin về cơ cấu thị trường xuất khẩu, cảng bốc dỡ và thời gian vận chuyển dựa trên các báo cáo thực tế đã được công bố trên Báo Người Lao Động và Báo Sài Gòn Giải Phóng.'
                : 'Market share data and maritime delivery routes verified through accredited economic publications.'
            }
          />

          <div
            className="grid-2"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '28px',
            }}
          >
            {marketCards.map((m, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '30px',
                  backgroundColor: '#FFFFFF',
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <span className="badge badge-green">{m.share}</span>
                    <span style={{ fontSize: '0.76rem', color: 'var(--color-muted)' }}>
                      {m.source}
                    </span>
                  </div>

                  <h3
                    className="title-serif"
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 700,
                      color: 'var(--color-heading)',
                      marginBottom: '12px',
                    }}
                  >
                    {m.country}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--color-body)',
                      lineHeight: 1.65,
                      marginBottom: '20px',
                    }}
                  >
                    {m.desc}
                  </p>

                  <div
                    style={{
                      padding: '14px',
                      backgroundColor: 'var(--cream-bg)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.82rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Anchor size={14} color="var(--primary-green)" />
                      <strong>{m.ports}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} color="var(--primary-green)" />
                      <span>{m.transit}</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    paddingTop: '14px',
                    borderTop: '1px solid var(--color-border)',
                    fontSize: '0.82rem',
                    color: 'var(--forest-green)',
                    fontWeight: 600,
                  }}
                >
                  {isVi ? '• Mặt hàng tiêu thụ chính: ' : '• Core Products: '}
                  <span style={{ color: 'var(--color-body-dark)' }}>{m.products}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECTION 3 — CONTAINER SPECIFICATIONS & B2B COOPERATION
          ====================================================================== */}
      <section className="section section-white">
        <div className="container">
          <div
            style={{
              padding: 'clamp(32px, 5vw, 48px)',
              backgroundColor: 'var(--forest-green)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '40px',
              alignItems: 'center',
            }}
            className="grid-mobile-1"
          >
            <div>
              <span className="section-eyebrow section-eyebrow-light">
                {isVi ? 'HỢP TÁC B2B XUẤT KHẨU' : 'B2B COMMERCIAL LOGISTICS'}
              </span>
              <h2
                className="title-serif"
                style={{
                  fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                  color: '#FFFFFF',
                  marginTop: '12px',
                  marginBottom: '16px',
                }}
              >
                {isVi
                  ? 'Đối Tác Cung Ứng Nông Sản Sấy Tin Cậy'
                  : 'Reliable Container Supply Chain for Global Buyers'}
              </h2>
              <p
                style={{
                  fontSize: '0.94rem',
                  lineHeight: 1.7,
                  color: 'rgba(255, 255, 255, 0.88)',
                  marginBottom: '28px',
                }}
              >
                {isVi
                  ? 'VINAXO cung cấp đầy đủ chứng thư kiểm dịch thực vật (Phytosanitary Certificate), phiếu kiểm nghiệm vi sinh (COA) và chứng nhận xuất xứ (C/O Form A, Form B, Form EUR.1) đáp ứng quy định hải quan quốc tế.'
                  : 'VINAXO provides full export documentation including Phytosanitary Clearance, microbiology COA, and Certificate of Origin (Form A, B, EUR.1) ensuring seamless customs clearance.'}
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Button
                  variant="white"
                  size="lg"
                  onClick={() => onOpenQuote()}
                  icon={<ArrowRight size={16} />}
                >
                  {isVi ? 'Yêu Cầu Báo Giá FOB / CIF' : 'Request FOB / CIF Quotation'}
                </Button>
                <Link to="/contact">
                  <Button variant="outline-white" size="lg">
                    {isVi ? 'Liên Hệ Ban Kinh Doanh' : 'Contact Export Desk'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Container Load Parameters */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                fontSize: '0.88rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Ship size={20} color="#A3E6B8" />
                <span>
                  <strong>FCL 20ft Container:</strong> ~9 - 11 Tấn (MT)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Ship size={20} color="#A3E6B8" />
                <span>
                  <strong>FCL 40ft Container:</strong> ~20 - 22 Tấn (MT)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="#A3E6B8" />
                <span>
                  <strong>Incoterms hỗ trợ:</strong> FOB Cát Lái, CIF, CFR
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} color="#A3E6B8" />
                <span>
                  <strong>Thanh toán thương mại:</strong> L/C at sight, T/T
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GlobalMarket;
