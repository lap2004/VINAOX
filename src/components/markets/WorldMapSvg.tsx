import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Anchor, Clock, Package, X } from 'lucide-react';

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
    <div
      className="world-map-wrapper"
      style={{
        width: '100%',
        maxWidth: '1020px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '100%',
          backgroundColor: '#F2F7F4',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1.5px solid var(--sage-border)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
        }}
      >
        <svg
          viewBox="0 0 960 480"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            {/* Fine Grid Pattern */}
            <pattern
              id="vinaxoGridFine"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#DCE8E0"
                strokeWidth="0.5"
                strokeDasharray="2,3"
                opacity="0.75"
              />
            </pattern>

            {/* Marker Drop Shadow Filter */}
            <filter
              id="vinaxoMarkerShadowFine"
              x="-20%"
              y="-20%"
              width="140%"
              height="150%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#103D2A"
                floodOpacity="0.14"
              />
            </filter>

            {/* Hub Glow Filter */}
            <filter
              id="vinaxoHubGlowFine"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="8"
                floodColor="#174D32"
                floodOpacity="0.5"
              />
            </filter>

            {/* Radar Animation Keyframes */}
            <style>
              {`
                @keyframes pingRadarMap {
                  0% { r: 8px; opacity: 0.85; stroke-width: 2.5px; }
                  50% { r: 24px; opacity: 0.4; stroke-width: 1.5px; }
                  100% { r: 38px; opacity: 0; stroke-width: 0.5px; }
                }
                @keyframes pingRadarMap2 {
                  0% { r: 6px; opacity: 0.9; }
                  100% { r: 22px; opacity: 0; }
                }
                @keyframes routePulseLine {
                  to { stroke-dashoffset: -44; }
                }
                .radar-pulse-main {
                  animation: pingRadarMap 2.5s cubic-bezier(0, 0.2, 0.8, 1) infinite;
                  transform-origin: center;
                }
                .radar-pulse-sub {
                  animation: pingRadarMap2 2.5s cubic-bezier(0, 0.2, 0.8, 1) 0.8s infinite;
                  transform-origin: center;
                }
                .route-dash-travel {
                  animation: routePulseLine 2.2s linear infinite;
                }
              `}
            </style>
          </defs>

          {/* Background and Coordinate Grid */}
          <rect width="960" height="480" rx="16" fill="#F2F7F4" />
          <rect width="960" height="480" rx="16" fill="url(#vinaxoGridFine)" />

          {/* Subtle Latitude Reference Guides */}
          <line
            x1="0"
            y1="140"
            x2="960"
            y2="140"
            stroke="#E1EBE4"
            strokeWidth="0.8"
            strokeDasharray="4,6"
          />
          <line
            x1="0"
            y1="248"
            x2="960"
            y2="248"
            stroke="#D6E5DC"
            strokeWidth="1"
            strokeDasharray="6,6"
          />
          <line
            x1="0"
            y1="350"
            x2="960"
            y2="350"
            stroke="#E1EBE4"
            strokeWidth="0.8"
            strokeDasharray="4,6"
          />

          {/* ======================================================================
              AUTHENTIC GEOGRAPHIC LANDMASSES (Refined Contours)
              ====================================================================== */}
          <g fill="#CADECF" stroke="#B2CDBC" strokeWidth="0.75" strokeLinejoin="round">
            {/* 1. NORTH AMERICA & GREENLAND */}
            {/* Greenland */}
            <path d="M 335,28 C 355,25 385,38 380,65 C 375,82 350,88 335,78 C 322,70 320,40 335,28 Z" />
            {/* North America Continent */}
            <path d="M 95,65 C 105,52 145,45 195,45 C 235,45 285,55 305,80 C 315,95 295,115 285,125 C 288,145 280,165 268,178 C 265,190 252,192 248,180 C 235,178 220,185 208,205 C 198,222 188,245 178,252 C 168,248 172,230 182,215 C 172,205 160,180 148,162 C 135,142 120,128 105,118 C 92,108 85,85 95,65 Z" />

            {/* 2. SOUTH AMERICA */}
            <path d="M 235,262 C 265,255 298,260 328,278 C 352,292 358,322 342,352 C 328,378 305,420 288,445 C 275,448 268,432 272,408 C 275,382 262,350 252,328 C 242,305 225,278 235,262 Z" />

            {/* 3. EUROPE & SCANDINAVIA */}
            {/* British Isles */}
            <path d="M 448,82 C 458,78 468,88 465,102 C 460,112 448,110 445,98 C 442,88 444,84 448,82 Z" />
            {/* Mainland Europe */}
            <path d="M 462,118 C 480,105 510,95 538,92 C 555,102 550,122 532,135 C 515,148 488,155 470,152 C 458,142 455,128 462,118 Z" />
            {/* Scandinavia */}
            <path d="M 488,48 C 505,42 528,52 532,75 C 530,90 515,95 500,88 C 490,82 482,65 488,48 Z" />

            {/* 4. AFRICA & MADAGASCAR */}
            {/* Africa Continent */}
            <path d="M 445,168 C 485,160 535,162 562,185 C 585,205 588,235 565,265 C 555,290 545,335 528,375 C 515,395 498,390 490,365 C 475,325 450,285 432,245 C 420,218 425,185 445,168 Z" />
            {/* Madagascar */}
            <path d="M 578,325 C 588,318 596,335 592,362 C 588,375 580,372 576,355 C 572,340 574,330 578,325 Z" />

            {/* 5. ASIA & RUSSIA */}
            {/* Vast Eurasian Landmass */}
            <path d="M 548,78 C 585,55 640,45 710,45 C 785,45 850,55 895,75 C 915,85 918,105 895,122 C 875,135 845,142 825,152 C 815,168 808,185 818,205 C 805,218 782,215 765,225 C 755,240 758,265 745,282 C 735,270 725,248 720,225 C 712,205 695,190 675,200 C 655,215 645,242 632,240 C 622,232 628,205 620,185 C 610,165 580,155 562,150 C 545,132 540,105 548,78 Z" />
            {/* India Subcontinent */}
            <path d="M 648,198 C 665,192 688,205 695,228 C 698,252 682,275 668,285 C 655,272 650,245 645,225 C 642,210 644,202 648,198 Z" />
            {/* Japan Islands Arc */}
            <path d="M 855,128 C 865,135 868,155 858,172 C 850,180 842,175 845,160 C 848,145 850,135 855,128 Z" />
            {/* Indonesia & Maritime Southeast Asia */}
            <path d="M 748,302 C 765,298 785,302 795,315 C 788,325 768,322 755,318 C 748,315 745,305 748,302 Z" />
            <path d="M 798,285 C 815,280 828,295 822,312 C 812,318 802,308 798,285 Z" />

            {/* 6. AUSTRALIA & NEW ZEALAND */}
            <path d="M 782,335 C 815,318 855,322 882,345 C 895,365 885,395 862,415 C 835,422 805,418 788,395 C 772,375 768,348 782,335 Z" />
          </g>

          {/* ======================================================================
              EXPORT SHIPPING ROUTES (Smooth, Distinct, Non-overlapping Bezier Arcs)
              ====================================================================== */}

          {/* Route 1: Vietnam Hub (748, 248) -> USA West Coast (195, 148) via Transpacific Arc */}
          <path
            className="route-dash-travel"
            d="M 748,248 C 620,18 340,18 195,148"
            fill="none"
            stroke="#174D32"
            strokeWidth={activeMarket === 'usa' ? '3.6' : '2.4'}
            strokeDasharray="7,4"
            strokeLinecap="round"
            style={{ transition: 'stroke-width 0.2s ease' }}
          />

          {/* Route 2: Vietnam Hub (748, 248) -> EU Ports (482, 108) via Indian Ocean / Suez Route */}
          <path
            className="route-dash-travel"
            d="M 748,248 C 660,305 565,255 520,175 Q 498,135 482,108"
            fill="none"
            stroke="#174D32"
            strokeWidth={activeMarket === 'eu' ? '3.6' : '2.4'}
            strokeDasharray="7,4"
            strokeLinecap="round"
            style={{ transition: 'stroke-width 0.2s ease' }}
          />

          {/* Route 3: Vietnam Hub (748, 248) -> Russia & CIS (620, 88) via Inland Northern Corridor */}
          <path
            className="route-dash-travel"
            d="M 748,248 Q 692,150 620,88"
            fill="none"
            stroke="#174D32"
            strokeWidth={activeMarket === 'russia' ? '3.4' : '2.2'}
            strokeDasharray="6,4"
            strokeLinecap="round"
            opacity="0.9"
            style={{ transition: 'stroke-width 0.2s ease' }}
          />

          {/* Route 4: Vietnam Hub (748, 248) -> South Korea (812, 152) via East China Sea */}
          <path
            className="route-dash-travel"
            d="M 748,248 Q 798,202 812,152"
            fill="none"
            stroke="#174D32"
            strokeWidth={activeMarket === 'korea' ? '3.4' : '2.2'}
            strokeDasharray="6,4"
            strokeLinecap="round"
            opacity="0.9"
            style={{ transition: 'stroke-width 0.2s ease' }}
          />

          {/* ======================================================================
              DESTINATION MARKERS & LABELS (Elevated, Clean Pill Badges)
              ====================================================================== */}

          {/* Destination 1: United States (~70%) at (195, 148) */}
          <g
            transform="translate(195, 148)"
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => setActiveMarket(activeMarket === 'usa' ? null : 'usa')}
          >
            <circle r="14" fill="#174D32" opacity="0.14" />
            <circle r="5.5" fill="#174D32" stroke="#FFFFFF" strokeWidth="2" />
            <g transform="translate(0, -24)" filter="url(#vinaxoMarkerShadowFine)">
              <rect
                x="-66"
                y="-13"
                width="132"
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

          {/* Destination 2: European Union (~20%) at (482, 108) */}
          <g
            transform="translate(482, 108)"
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => setActiveMarket(activeMarket === 'eu' ? null : 'eu')}
          >
            <circle r="14" fill="#174D32" opacity="0.14" />
            <circle r="5.5" fill="#174D32" stroke="#FFFFFF" strokeWidth="2" />
            <g transform="translate(0, -24)" filter="url(#vinaxoMarkerShadowFine)">
              <rect
                x="-58"
                y="-13"
                width="116"
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
                fontSize="11"
                fontWeight="700"
                fill={activeMarket === 'eu' ? '#FFFFFF' : '#174D32'}
                textAnchor="middle"
              >
                EU (~20%)
              </text>
            </g>
          </g>

          {/* Destination 3: Russia & CIS at (620, 88) */}
          <g
            transform="translate(620, 88)"
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => setActiveMarket(activeMarket === 'russia' ? null : 'russia')}
          >
            <circle r="12" fill="#174D32" opacity="0.1" />
            <circle r="4.5" fill="#174D32" stroke="#FFFFFF" strokeWidth="1.6" />
            <g transform="translate(0, -22)" filter="url(#vinaxoMarkerShadowFine)">
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

          {/* Destination 4: Korea & East Asia at (812, 152) */}
          <g
            transform="translate(812, 152)"
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            onClick={() => setActiveMarket(activeMarket === 'korea' ? null : 'korea')}
          >
            <circle r="12" fill="#174D32" opacity="0.1" />
            <circle r="4.5" fill="#174D32" stroke="#FFFFFF" strokeWidth="1.6" />
            <g transform="translate(56, 0)" filter="url(#vinaxoMarkerShadowFine)">
              <rect
                x="-54"
                y="-12"
                width="108"
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
                fontSize="9.5"
                fontWeight="700"
                fill={activeMarket === 'korea' ? '#FFFFFF' : '#2E5C43'}
                textAnchor="middle"
              >
                KOREA & E. ASIA
              </text>
            </g>
          </g>

          {/* ======================================================================
              ORIGIN HUB: VIETNAM (VINAXO TIEN GIANG & CAT LAI / CAI MEP PORTS)
              ====================================================================== */}
          <g
            transform="translate(748, 248)"
            filter="url(#vinaxoHubGlowFine)"
          >
            {/* Radar Pulsing Rings */}
            <circle
              className="radar-pulse-main"
              cx="0"
              cy="0"
              r="26"
              fill="none"
              stroke="#174D32"
              strokeWidth="2"
            />
            <circle
              className="radar-pulse-sub"
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
            <g transform="translate(0, 26)" filter="url(#vinaxoMarkerShadowFine)">
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
                backgroundColor: 'var(--primary-green)',
                display: 'inline-block',
              }}
            />
            <strong style={{ color: 'var(--forest-green)' }}>
              {isVi ? '~70% Xuất khẩu Hoa Kỳ' : '~70% US Export'}
            </strong>
            <span style={{ color: 'var(--color-muted)' }}>•</span>
            <span style={{ color: 'var(--color-body)' }}>
              {isVi ? '~20% Châu Âu' : '~20% European Union'}
            </span>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
            {isVi
              ? 'Nguồn đối chiếu: Báo Người Lao Động, Báo Sài Gòn Giải Phóng'
              : 'Verified sources: Nguoi Lao Dong & SGGP Press'}
          </div>
        </div>
      </div>

      {/* Interactive Market Details Popover */}
      {interactive && activeMarket && marketDetails[activeMarket] && (
        <div
          style={{
            marginTop: '16px',
            padding: '20px 24px',
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--sage-border)',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeInUp 0.22s ease',
            position: 'relative',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMarket(null)}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--color-muted)',
              padding: '4px',
            }}
            aria-label="Close details"
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--light-sage)',
                color: 'var(--forest-green)',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            >
              {marketDetails[activeMarket].share}
            </span>
            <h4
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--forest-green)',
                margin: 0,
              }}
            >
              {marketDetails[activeMarket].title}
            </h4>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              marginTop: '14px',
              fontSize: '0.85rem',
              color: 'var(--color-body)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Anchor size={16} color="var(--primary-green)" />
              <span>{marketDetails[activeMarket].port}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="var(--primary-green)" />
              <span>{marketDetails[activeMarket].transit}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={16} color="var(--primary-green)" />
              <span>{marketDetails[activeMarket].products}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
