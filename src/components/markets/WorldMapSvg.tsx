import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export interface WorldMapSvgProps {
  interactive?: boolean;
}

export const WorldMapSvg: React.FC<WorldMapSvgProps> = ({ interactive = true }) => {
  const { language } = useLanguage();
  const isVi = language === 'vi';
  const [activeMarket, setActiveMarket] = useState<string | null>(null);

  const marketDetails: Record<
    string,
    { title: string; share: string; port: string; transit: string; products: string }
  > = {
    usa: {
      title: isVi ? 'Thị Trường Hoa Kỳ (United States)' : 'United States Export Market',
      share: isVi ? '~70% Kim ngạch xuất khẩu' : '~70% Total Export Share',
      port: isVi ? 'Cảng đến: Long Beach, Oakland, Los Angeles' : 'Ports of Entry: Long Beach, Oakland, Los Angeles',
      transit: isVi ? 'Thời gian hải trình: 22 - 28 ngày' : 'Transit Time: 22 - 28 days',
      products: isVi ? 'Xoài sấy dẻo, Thanh long sấy dẻo, Chuối sấy dẻo' : 'Soft-dried mango, dragon fruit, and banana',
    },
    eu: {
      title: isVi ? 'Liên Minh Châu Âu (European Union)' : 'European Union Export Market',
      share: isVi ? '~20% Kim ngạch xuất khẩu' : '~20% Total Export Share',
      port: isVi ? 'Cảng đến: Hamburg (Đức), Rotterdam, Helsinki' : 'Ports of Entry: Hamburg, Rotterdam, Helsinki',
      transit: isVi ? 'Thời gian hải trình: 28 - 35 ngày' : 'Transit Time: 28 - 35 days',
      products: isVi ? 'Dòng sản phẩm đạt chuẩn BRCGS Hạng B & Thích ứng ESG' : 'BRCGS Grade B & ESG Compliant natural fruit lines',
    },
    russia: {
      title: isVi ? 'Thị Trường Nga & Đông Âu (Russia & CIS)' : 'Russia & Eastern Europe Market',
      share: isVi ? 'Đối tác xuất khẩu ổn định' : 'Longstanding Strategic Partners',
      port: isVi ? 'Cảng đến: Vladivostok, Saint Petersburg' : 'Ports of Entry: Vladivostok, Saint Petersburg',
      transit: isVi ? 'Thời gian hải trình: 18 - 25 ngày' : 'Transit Time: 18 - 25 days',
      products: isVi ? 'Dòng trái cây sấy dẻo nhiệt đới & gia công phục vụ mùa vụ' : 'Tropical soft-dried fruits & seasonal packaging',
    },
    korea: {
      title: isVi ? 'Hàn Quốc & Đông Á (South Korea & East Asia)' : 'South Korea & East Asia Market',
      share: isVi ? 'Thị trường tăng trưởng nhanh' : 'High-Growth Regional Market',
      port: isVi ? 'Cảng đến: Busan, Incheon' : 'Ports of Entry: Busan, Incheon',
      transit: isVi ? 'Thời gian hải trình: 7 - 10 ngày' : 'Transit Time: 7 - 10 days',
      products: isVi ? 'Xoài sấy dẻo Cát Chu, Thơm sấy dẻo Tân Phước' : 'Premium Cat Chu mango & Tan Phuoc pineapple',
    },
  };

  return (
    <div className="world-map-wrapper" style={{ width: '100%', position: 'relative' }}>
      <div
        style={{
          width: '100%',
          backgroundColor: '#F0F6F1',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--sage-border)',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
        }}
      >
        <svg
          viewBox="0 0 960 480"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern
              id="vinaxoGridReact"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="#DCE8E0"
                strokeWidth="0.5"
                strokeDasharray="2,4"
                opacity="0.8"
              />
            </pattern>

            {/* Drop Shadow Filter */}
            <filter
              id="vinaxoMarkerShadowReact"
              x="-20%"
              y="-20%"
              width="140%"
              height="150%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2.5"
                floodColor="#0E3722"
                floodOpacity="0.16"
              />
            </filter>

            {/* Hub Glow Filter */}
            <filter
              id="vinaxoHubGlowReact"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="6"
                floodColor="#174D32"
                floodOpacity="0.45"
              />
            </filter>

            {/* Radar Animation Keyframes inside SVG */}
            <style>
              {`
                @keyframes pingRadar {
                  0% { r: 8px; opacity: 0.8; stroke-width: 2.5px; }
                  50% { r: 24px; opacity: 0.4; stroke-width: 1.5px; }
                  100% { r: 36px; opacity: 0; stroke-width: 0.5px; }
                }
                @keyframes pingRadar2 {
                  0% { r: 6px; opacity: 0.9; }
                  100% { r: 20px; opacity: 0; }
                }
                @keyframes dashTravel {
                  to { stroke-dashoffset: -44; }
                }
                .radar-pulse-anim {
                  animation: pingRadar 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
                  transform-origin: center;
                }
                .radar-pulse-anim-2 {
                  animation: pingRadar2 2.4s cubic-bezier(0, 0.2, 0.8, 1) 0.8s infinite;
                  transform-origin: center;
                }
                .route-anim {
                  animation: dashTravel 2.2s linear infinite;
                }
              `}
            </style>
          </defs>

          {/* Background Rect & Grid */}
          <rect width="960" height="480" rx="10" fill="#F0F6F1" />
          <rect width="960" height="480" rx="10" fill="url(#vinaxoGridReact)" />

          {/* Latitude Lines */}
          <line
            x1="0"
            y1="160"
            x2="960"
            y2="160"
            stroke="#E1EBE4"
            strokeWidth="0.75"
            strokeDasharray="4,6"
          />
          <line
            x1="0"
            y1="245"
            x2="960"
            y2="245"
            stroke="#D6E5DC"
            strokeWidth="1"
            strokeDasharray="6,6"
          />
          <line
            x1="0"
            y1="330"
            x2="960"
            y2="330"
            stroke="#E1EBE4"
            strokeWidth="0.75"
            strokeDasharray="4,6"
          />

          {/* Continents Layer */}
          <g fill="#CADECF" stroke="#B4CFBF" strokeWidth="0.6">
            {/* North America */}
            <path d="M 120,40 L 290,40 L 330,90 L 310,140 L 260,180 L 210,230 L 180,210 L 150,150 L 110,90 Z M 218,146 L 245,155 L 260,135 L 235,120 Z" />
            {/* South America */}
            <path d="M 260,250 L 340,270 L 350,340 L 300,430 L 270,440 L 255,360 L 245,280 Z" />
            {/* Europe */}
            <path d="M 450,70 L 540,65 L 560,110 L 510,140 L 460,140 L 440,100 Z" />
            {/* Africa */}
            <path d="M 440,165 L 530,165 L 570,220 L 560,320 L 510,380 L 470,330 L 430,230 Z" />
            {/* Asia & Russia */}
            <path d="M 545,65 L 880,50 L 920,100 L 890,160 L 820,160 L 780,230 L 730,250 L 670,240 L 600,190 L 550,130 Z" />
            {/* Australia */}
            <path d="M 780,320 L 870,310 L 890,370 L 850,420 L 780,400 L 760,350 Z" />
          </g>

          {/* Export Route Curves (Vietnam Hub at 764, 245) */}
          {/* Route 1: Vietnam -> USA (764,245 -> 218,146) */}
          <path
            className="route-anim"
            d="M 764,245 C 640,15 360,15 218,146"
            fill="none"
            stroke="#174D32"
            strokeWidth={activeMarket === 'usa' ? '3.8' : '2.6'}
            strokeDasharray="7,4"
            strokeLinecap="round"
            style={{ transition: 'stroke-width 0.2s ease' }}
          />

          {/* Route 2: Vietnam -> EU (764,245 -> 506,98) */}
          <path
            className="route-anim"
            d="M 764,245 Q 618,135 506,98"
            fill="none"
            stroke="#174D32"
            strokeWidth={activeMarket === 'eu' ? '3.8' : '2.6'}
            strokeDasharray="7,4"
            strokeLinecap="round"
            style={{ transition: 'stroke-width 0.2s ease' }}
          />

          {/* Route 3: Vietnam -> Russia (764,245 -> 580,90) */}
          <path
            className="route-anim"
            d="M 764,245 Q 695,142 580,90"
            fill="none"
            stroke="#174D32"
            strokeWidth={activeMarket === 'russia' ? '3.5' : '2.2'}
            strokeDasharray="6,4"
            strokeLinecap="round"
            opacity="0.9"
            style={{ transition: 'stroke-width 0.2s ease' }}
          />

          {/* Route 4: Vietnam -> Korea (764,245 -> 819,153) */}
          <path
            className="route-anim"
            d="M 764,245 Q 808,198 819,153"
            fill="none"
            stroke="#174D32"
            strokeWidth={activeMarket === 'korea' ? '3.5' : '2.2'}
            strokeDasharray="6,4"
            strokeLinecap="round"
            opacity="0.9"
            style={{ transition: 'stroke-width 0.2s ease' }}
          />

          {/* Destination 1: United States (~70%) */}
          <g
            transform="translate(218, 146)"
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => setActiveMarket(activeMarket === 'usa' ? null : 'usa')}
          >
            <circle r="14" fill="#174D32" opacity="0.14" />
            <circle r="5.5" fill="#174D32" stroke="#FFFFFF" strokeWidth="2" />
            <g transform="translate(0, -22)" filter="url(#vinaxoMarkerShadowReact)">
              <rect
                x="-64"
                y="-13"
                width="128"
                height="26"
                rx="13"
                fill={activeMarket === 'usa' ? '#174D32' : '#FFFFFF'}
                stroke="#C2DCD0"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="4"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize="11"
                fontWeight="700"
                fill={activeMarket === 'usa' ? '#FFFFFF' : '#174D32'}
                textAnchor="middle"
              >
                USA (~70%)
              </text>
            </g>
          </g>

          {/* Destination 2: European Union (~20%) */}
          <g
            transform="translate(506, 98)"
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => setActiveMarket(activeMarket === 'eu' ? null : 'eu')}
          >
            <circle r="14" fill="#174D32" opacity="0.14" />
            <circle r="5.5" fill="#174D32" stroke="#FFFFFF" strokeWidth="2" />
            <g transform="translate(-20, -22)" filter="url(#vinaxoMarkerShadowReact)">
              <rect
                x="-56"
                y="-13"
                width="112"
                height="26"
                rx="13"
                fill={activeMarket === 'eu' ? '#174D32' : '#FFFFFF'}
                stroke="#C2DCD0"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="4"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize="10.5"
                fontWeight="700"
                fill={activeMarket === 'eu' ? '#FFFFFF' : '#174D32'}
                textAnchor="middle"
              >
                EU (~20%)
              </text>
            </g>
          </g>

          {/* Destination 3: Russia & Eastern Europe */}
          <g
            transform="translate(580, 90)"
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => setActiveMarket(activeMarket === 'russia' ? null : 'russia')}
          >
            <circle r="12" fill="#174D32" opacity="0.1" />
            <circle r="4.5" fill="#174D32" stroke="#FFFFFF" strokeWidth="1.6" />
            <g transform="translate(48, -20)" filter="url(#vinaxoMarkerShadowReact)">
              <rect
                x="-58"
                y="-12"
                width="116"
                height="24"
                rx="12"
                fill={activeMarket === 'russia' ? '#174D32' : '#FFFFFF'}
                stroke="#C2DCD0"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="3.5"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize="9.5"
                fontWeight="700"
                fill={activeMarket === 'russia' ? '#FFFFFF' : '#2E5C43'}
                textAnchor="middle"
              >
                RUSSIA & CIS
              </text>
            </g>
          </g>

          {/* Destination 4: Korea & East Asia */}
          <g
            transform="translate(819, 153)"
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => setActiveMarket(activeMarket === 'korea' ? null : 'korea')}
          >
            <circle r="12" fill="#174D32" opacity="0.1" />
            <circle r="4.5" fill="#174D32" stroke="#FFFFFF" strokeWidth="1.6" />
            <g transform="translate(54, -2)" filter="url(#vinaxoMarkerShadowReact)">
              <rect
                x="-56"
                y="-12"
                width="112"
                height="24"
                rx="12"
                fill={activeMarket === 'korea' ? '#174D32' : '#FFFFFF'}
                stroke="#C2DCD0"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="3.5"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize="10"
                fontWeight="700"
                fill={activeMarket === 'korea' ? '#FFFFFF' : '#2E5C43'}
                textAnchor="middle"
              >
                KOREA & E. ASIA
              </text>
            </g>
          </g>

          {/* Origin Hub: Vietnam (Tien Giang Facility) */}
          <g
            transform="translate(764, 245)"
            filter="url(#vinaxoHubGlowReact)"
          >
            {/* Radar Pulsing Rings */}
            <circle
              className="radar-pulse-anim"
              cx="0"
              cy="0"
              r="26"
              fill="none"
              stroke="#174D32"
              strokeWidth="2"
            />
            <circle
              className="radar-pulse-anim-2"
              cx="0"
              cy="0"
              r="16"
              fill="none"
              stroke="#174D32"
              strokeWidth="2"
            />
            {/* Center Pins */}
            <circle r="8" fill="#174D32" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle r="3.5" fill="#FFE27A" />

            {/* Label Tag */}
            <g transform="translate(0, 26)" filter="url(#vinaxoMarkerShadowReact)">
              <rect
                x="-86"
                y="-14"
                width="172"
                height="28"
                rx="14"
                fill="#174D32"
                stroke="#FFFFFF"
                strokeWidth="1.6"
              />
              <circle cx="-68" cy="0" r="4" fill="#FFE27A" />
              <text
                x="8"
                y="4"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontSize="11"
                fontWeight="800"
                fill="#FFFFFF"
                textAnchor="middle"
                letterSpacing="0.4"
              >
                VINAXO (TIỀN GIANG)
              </text>
            </g>
          </g>
        </svg>

        {/* Bottom Metrics Bar */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--sage-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '0.84rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent)',
                display: 'inline-block',
              }}
            />
            <strong style={{ color: 'var(--forest-green)' }}>
              {isVi ? '~70% Xuất khẩu Hoa Kỳ • ~20% Châu Âu' : '~70% US • ~20% EU Core Markets'}
            </strong>
          </div>

          <div style={{ color: 'var(--color-muted)', fontSize: '0.78rem' }}>
            {isVi
              ? 'Nguồn đối chiếu: Báo Người Lao Động, Báo Sài Gòn Giải Phóng'
              : 'Verified via Người Lao Động & SGGP official press records'}
          </div>
        </div>
      </div>

      {/* Active Market Popover Details if clicked */}
      {activeMarket && marketDetails[activeMarket] && (
        <div
          style={{
            marginTop: '16px',
            padding: '18px 22px',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--primary-green)',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <h4
              style={{
                fontSize: '1rem',
                color: 'var(--forest-green)',
                fontWeight: 700,
              }}
            >
              {marketDetails[activeMarket].title}
            </h4>
            <span className="badge badge-green">
              {marketDetails[activeMarket].share}
            </span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px',
              fontSize: '0.84rem',
              color: 'var(--color-body)',
            }}
          >
            <div>
              <strong>{isVi ? '• Cảng đến:' : '• Destination:'}</strong>{' '}
              {marketDetails[activeMarket].port}
            </div>
            <div>
              <strong>{isVi ? '• Thời gian:' : '• Transit:'}</strong>{' '}
              {marketDetails[activeMarket].transit}
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>{isVi ? '• Mặt hàng chủ lực:' : '• Key Products:'}</strong>{' '}
              {marketDetails[activeMarket].products}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
