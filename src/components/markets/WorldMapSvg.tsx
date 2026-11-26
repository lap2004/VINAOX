import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { CONTINENTS_SVG_PATH } from './continentsData';
import { Anchor, Clock, Package, X } from 'lucide-react';

export interface WorldMapSvgProps {
  variant?: 'compact' | 'full';
  interactive?: boolean;
}

export const WorldMapSvg: React.FC<WorldMapSvgProps> = ({
  variant = 'compact',
  interactive = true,
}) => {
  const { pick } = useLanguage();
  const [activeMarket, setActiveMarket] = useState<string | null>(null);

  const marketDetails: Record<
    string,
    { title: string; share: string; port: string; transit: string; products: string }
  > = {
    usa: {
      title: pick({
        vi: 'Thị Trường Hoa Kỳ (United States)',
        en: 'United States Export Market',
        ko: '미국 수출 시장 (United States)',
        zh: '美国核心出口市场'
      }),
      share: pick({
        vi: '~70% Kim ngạch xuất khẩu',
        en: '~70% Total Export Share',
        ko: '전체 수출 비중 약 70%',
        zh: '占总出口比重约 70%'
      }),
      port: pick({
        vi: 'Cảng đến: Long Beach, Oakland, Los Angeles',
        en: 'Ports of Entry: Long Beach, Oakland, Los Angeles',
        ko: '도착항: 롱비치, 오클랜드, 로스앤젤레스',
        zh: '主要目的港：长滩、奥克兰、洛杉矶'
      }),
      transit: pick({
        vi: 'Thời gian hải trình: 22 - 28 ngày',
        en: 'Transit Time: 22 - 28 days',
        ko: '해상 운송 기간: 22 ~ 28일',
        zh: '海运时效：22 - 28 天'
      }),
      products: pick({
        vi: 'Xoài sấy dẻo, Thanh long sấy dẻo, Chuối sấy dẻo',
        en: 'Soft-dried mango, dragon fruit, and banana',
        ko: '소프트 건망고, 건용과, 바나나 스낵',
        zh: '软烘芒果干、红心火龙果干、香蕉片'
      }),
    },
    eu: {
      title: pick({
        vi: 'Liên Minh Châu Âu (European Union)',
        en: 'European Union Export Market',
        ko: '유럽연합(EU) 수출 시장',
        zh: '欧盟出口市场'
      }),
      share: pick({
        vi: '~20% Kim ngạch xuất khẩu',
        en: '~20% Total Export Share',
        ko: '전체 수출 비중 약 20%',
        zh: '占总出口比重约 20%'
      }),
      port: pick({
        vi: 'Cảng đến: Hamburg (Đức), Rotterdam, Helsinki',
        en: 'Ports of Entry: Hamburg, Rotterdam, Helsinki',
        ko: '도착항: 함부르크(독일), 로테르담, 헬싱키',
        zh: '主要目的港：汉堡（德国）、鹿特丹、赫尔辛基'
      }),
      transit: pick({
        vi: 'Thời gian hải trình: 28 - 35 ngày',
        en: 'Transit Time: 28 - 35 days',
        ko: '해상 운송 기간: 28 ~ 35일',
        zh: '海运时效：28 - 35 天'
      }),
      products: pick({
        vi: 'Dòng sản phẩm đạt chuẩn BRCGS Hạng B & Thích ứng ESG',
        en: 'BRCGS Grade B & ESG Compliant natural fruit lines',
        ko: 'BRCGS Grade B 인증 및 ESG 기준 충족 제품군',
        zh: '符合 BRCGS B 级及 ESG 绿色标准产品线'
      }),
    },
    russia: {
      title: pick({
        vi: 'Thị Trường Nga & Đông Âu (Russia & CIS)',
        en: 'Russia & Eastern Europe Market',
        ko: '러시아 및 동유럽 수출 시장',
        zh: '俄罗斯及东欧出口市场'
      }),
      share: pick({
        vi: 'Đối tác xuất khẩu ổn định',
        en: 'Longstanding Strategic Partners',
        ko: '장기 전략 수출 파트너',
        zh: '长期稳定战略合作伙伴'
      }),
      port: pick({
        vi: 'Cảng đến: Vladivostok, Saint Petersburg',
        en: 'Ports of Entry: Vladivostok, Saint Petersburg',
        ko: '도착항: 블라디보스토크, 상트페테르부르크',
        zh: '主要目的港：符拉迪沃斯托克、圣彼得堡'
      }),
      transit: pick({
        vi: 'Thời gian hải trình: 18 - 25 ngày',
        en: 'Transit Time: 18 - 25 days',
        ko: '해상 운송 기간: 18 ~ 25일',
        zh: '海运时效：18 - 25 天'
      }),
      products: pick({
        vi: 'Dòng trái cây sấy dẻo nhiệt đới & bao bì mùa vụ',
        en: 'Tropical soft-dried fruits & seasonal packaging',
        ko: '열대 소프트 건조 과일 및 시즌별 리테일 포장',
        zh: '热带软烘干果及季节限定包装系列'
      }),
    },
    korea: {
      title: pick({
        vi: 'Hàn Quốc & Đông Á (South Korea & East Asia)',
        en: 'South Korea & East Asia Market',
        ko: '대한민국 및 동아시아 시장',
        zh: '韩国及东亚核心市场'
      }),
      share: pick({
        vi: 'Thị trường tăng trưởng nhanh',
        en: 'High-Growth Regional Market',
        ko: '고성장 핵심 아시아 시장',
        zh: '高增长亚洲区域市场'
      }),
      port: pick({
        vi: 'Cảng đến: Busan, Incheon',
        en: 'Ports of Entry: Busan, Incheon',
        ko: '도착항: 부산항, 인천항',
        zh: '主要目的港：釜山港、仁川港'
      }),
      transit: pick({
        vi: 'Thời gian hải trình: 7 - 10 ngày',
        en: 'Transit Time: 7 - 10 days',
        ko: '해상 운송 기간: 7 ~ 10일',
        zh: '海运时效：7 - 10 天'
      }),
      products: pick({
        vi: 'Xoài sấy dẻo Cát Chu, Thơm sấy dẻo Tân Phước',
        en: 'Premium Cat Chu mango & Tan Phuoc pineapple',
        ko: '프리미엄 깟추 건망고 및 떤프억 건파인애플',
        zh: '优质 Cat Chu 软烘芒果干及新福菠萝干'
      }),
    },
  };

  const handleNodeClick = (marketKey: string) => {
    if (!interactive) return;
    setActiveMarket(activeMarket === marketKey ? null : marketKey);
  };

  return (
    <div
      className={`world-map-wrap world-map-${variant}`}
      style={variant === 'full' ? { maxWidth: '960px', margin: '0 auto' } : {}}
      aria-label="VINAXO Global Export Route Network"
    >
      <div className="world-map-canvas">
        <svg
          className="world-map-svg"
          viewBox="0 0 960 480"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Subtle Grid Pattern */}
            <pattern
              id="vinaxoMapGrid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="#EADFCC"
                strokeWidth="0.5"
                strokeDasharray="2,4"
                opacity="0.7"
              />
            </pattern>

            {/* Drop Shadow Filter for Badges */}
            <filter
              id="vinaxoMarkerShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="150%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2.5"
                floodColor="#3A2417"
                floodOpacity="0.16"
              />
            </filter>

            {/* Hub Glow Filter */}
            <filter
              id="vinaxoHubGlow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="5"
                floodColor="#B9321F"
                floodOpacity="0.45"
              />
            </filter>
          </defs>

          {/* Background Plate (Warm Cream #FAF0E1) */}
          <rect width="960" height="480" rx="10" fill="#FAF0E1" />
          <rect width="960" height="480" rx="10" fill="url(#vinaxoMapGrid)" />

          {/* Tropic / Latitude Reference Lines */}
          <line
            x1="0"
            y1="160"
            x2="960"
            y2="160"
            stroke="#EADFCC"
            strokeWidth="0.75"
            strokeDasharray="4,6"
            opacity="0.7"
          />
          <line
            x1="0"
            y1="245"
            x2="960"
            y2="245"
            stroke="#E2D3BA"
            strokeWidth="1"
            strokeDasharray="6,6"
            opacity="0.8"
          />
          <line
            x1="0"
            y1="330"
            x2="960"
            y2="330"
            stroke="#EADFCC"
            strokeWidth="0.75"
            strokeDasharray="4,6"
            opacity="0.7"
          />

          {/* Continents Layer (Warm Terracotta Sand #E5D4BA) */}
          <path
            className="continents-layer"
            d={CONTINENTS_SVG_PATH}
            fill="#E5D4BA"
            stroke="#D2BCA0"
            strokeWidth="0.6"
          />

          {/* Export Route Curves (Smooth Bezier Arcs from Vietnam Hub 764, 245) */}
          <path
            className="export-route route-us"
            d="M 764,245 C 640,15 360,15 218,146"
            fill="none"
            stroke="#B9321F"
            strokeWidth={activeMarket === 'usa' ? '3.6' : '2.6'}
            strokeDasharray="7,4"
            strokeLinecap="round"
          />

          <path
            className="export-route route-eu"
            d="M 764,245 Q 618,135 506,98"
            fill="none"
            stroke="#B9321F"
            strokeWidth={activeMarket === 'eu' ? '3.6' : '2.6'}
            strokeDasharray="7,4"
            strokeLinecap="round"
          />

          <path
            className="export-route route-russia"
            d="M 764,245 Q 695,142 580,90"
            fill="none"
            stroke="#4B7851"
            strokeWidth={activeMarket === 'russia' ? '3.2' : '2.2'}
            strokeDasharray="6,4"
            strokeLinecap="round"
            opacity="0.9"
          />

          <path
            className="export-route route-korea"
            d="M 764,245 Q 808,198 819,153"
            fill="none"
            stroke="#4B7851"
            strokeWidth={activeMarket === 'korea' ? '3.2' : '2.2'}
            strokeDasharray="6,4"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Destination 1: United States (~70%) */}
          <g
            className="map-node node-us"
            transform="translate(218, 146)"
            onClick={() => handleNodeClick('usa')}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label="USA Export Market"
          >
            <circle r="14" fill="#B9321F" opacity="0.14" />
            <circle r="5" fill="#B9321F" stroke="#FFFFFF" strokeWidth="1.8" />
            <g transform="translate(0, -20)" filter="url(#vinaxoMarkerShadow)">
              <rect
                x="-65"
                y="-13"
                width="130"
                height="26"
                rx="13"
                fill={activeMarket === 'usa' ? '#3A2417' : '#FFFFFF'}
                stroke="#EADFCC"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="4"
                fontFamily="'Be Vietnam Pro', system-ui, sans-serif"
                fontSize="11"
                fontWeight="700"
                fill={activeMarket === 'usa' ? '#F4A83A' : '#3A2417'}
                textAnchor="middle"
              >
                {pick({ vi: 'Hoa Kỳ (~70%)', en: 'USA (~70%)', ko: '미국 (~70%)', zh: '美国 (~70%)' })}
              </text>
            </g>
          </g>

          {/* Destination 2: European Union (~20%) */}
          <g
            className="map-node node-eu"
            transform="translate(506, 98)"
            onClick={() => handleNodeClick('eu')}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label="European Union Export Market"
          >
            <circle r="14" fill="#B9321F" opacity="0.14" />
            <circle r="5" fill="#B9321F" stroke="#FFFFFF" strokeWidth="1.8" />
            <g transform="translate(-24, -20)" filter="url(#vinaxoMarkerShadow)">
              <rect
                x="-56"
                y="-13"
                width="112"
                height="26"
                rx="13"
                fill={activeMarket === 'eu' ? '#3A2417' : '#FFFFFF'}
                stroke="#EADFCC"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="4"
                fontFamily="'Be Vietnam Pro', system-ui, sans-serif"
                fontSize="10.5"
                fontWeight="700"
                fill={activeMarket === 'eu' ? '#F4A83A' : '#3A2417'}
                textAnchor="middle"
              >
                {pick({ vi: 'Châu Âu (~20%)', en: 'EU (~20%)', ko: '유럽연합 (~20%)', zh: '欧盟 (~20%)' })}
              </text>
            </g>
          </g>

          {/* Destination 3: Russia & Eastern Europe */}
          <g
            className="map-node node-russia"
            transform="translate(580, 90)"
            onClick={() => handleNodeClick('russia')}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label="Russia and Eastern Europe Export Market"
          >
            <circle r="12" fill="#4B7851" opacity="0.14" />
            <circle r="4.5" fill="#4B7851" stroke="#FFFFFF" strokeWidth="1.6" />
            <g transform="translate(48, -20)" filter="url(#vinaxoMarkerShadow)">
              <rect
                x="-56"
                y="-12"
                width="112"
                height="24"
                rx="12"
                fill={activeMarket === 'russia' ? '#3A2417' : '#FFFFFF'}
                stroke="#EADFCC"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="3.5"
                fontFamily="'Be Vietnam Pro', system-ui, sans-serif"
                fontSize="9.5"
                fontWeight="700"
                fill={activeMarket === 'russia' ? '#F4A83A' : '#3A2417'}
                textAnchor="middle"
              >
                {pick({ vi: 'NGA & ĐÔNG ÂU', en: 'RUSSIA & E. EUROPE', ko: '러시아 · 동유럽', zh: '俄罗斯与东欧' })}
              </text>
            </g>
          </g>

          {/* Destination 4: Korea & East Asia */}
          <g
            className="map-node node-korea"
            transform="translate(819, 153)"
            onClick={() => handleNodeClick('korea')}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label="Korea and East Asia Export Market"
          >
            <circle r="12" fill="#4B7851" opacity="0.14" />
            <circle r="4.5" fill="#4B7851" stroke="#FFFFFF" strokeWidth="1.6" />
            <g transform="translate(54, -2)" filter="url(#vinaxoMarkerShadow)">
              <rect
                x="-52"
                y="-12"
                width="104"
                height="24"
                rx="12"
                fill={activeMarket === 'korea' ? '#3A2417' : '#FFFFFF'}
                stroke="#EADFCC"
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="3.5"
                fontFamily="'Be Vietnam Pro', system-ui, sans-serif"
                fontSize="10"
                fontWeight="700"
                fill={activeMarket === 'korea' ? '#F4A83A' : '#3A2417'}
                textAnchor="middle"
              >
                {pick({ vi: 'HÀN QUỐC & ĐÔNG Á', en: 'KOREA & E. ASIA', ko: '한국 · 동아시아', zh: '韩国与东亚' })}
              </text>
            </g>
          </g>

          {/* Vietnam Origin Hub */}
          <g
            className="map-node node-vietnam"
            transform="translate(764, 245)"
            filter="url(#vinaxoHubGlow)"
          >
            <circle
              className="radar-pulse"
              r="26"
              fill="none"
              stroke="#B9321F"
              strokeWidth="2"
              opacity="0.5"
            />
            <circle
              className="radar-pulse-2"
              r="16"
              fill="none"
              stroke="#F4A83A"
              strokeWidth="2"
              opacity="0.7"
            />
            <circle r="8" fill="#3A2417" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle r="3.5" fill="#F4A83A" />
            <g transform="translate(0, 26)" filter="url(#vinaxoMarkerShadow)">
              <rect
                x="-85"
                y="-14"
                width="170"
                height="28"
                rx="14"
                fill="#3A2417"
                stroke="#F4A83A"
                strokeWidth="1.6"
              />
              <circle cx="-68" cy="0" r="4" fill="#F4A83A" />
              <text
                x="8"
                y="4"
                fontFamily="'Be Vietnam Pro', system-ui, sans-serif"
                fontSize="11"
                fontWeight="800"
                fill="#FFFFFF"
                textAnchor="middle"
                letterSpacing="0.3"
              >
                {pick({ vi: 'VINAXO (ĐBSCL)', en: 'VINAXO (VIETNAM HUB)', ko: 'VINAXO (베트남 거점)', zh: 'VINAXO（越南总部）' })}
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Redesigned Export Statistics Badge (Underneath the map, clean white card) */}
      <div className="map-stats-bottom-bar">
        <div className="map-stats-badge">
          <span className="badge-accent-dot"></span>
          <span className="badge-stat">
            {pick({ vi: '70% Mỹ • 20% EU', en: '70% US • 20% EU', ko: '미국 70% • EU 20%', zh: '美国 70% • 欧盟 20%' })}
          </span>
          <span className="badge-sep">—</span>
          <span className="badge-label">
            {pick({ vi: 'TỶ TRỌNG XUẤT KHẨU CHÍNH', en: 'CORE EXPORT SHARE', ko: '핵심 수출 비중', zh: '核心出口占比' })}
          </span>
        </div>
      </div>

      {/* Interactive Detail Modal/Flyout for clicked market */}
      {activeMarket && marketDetails[activeMarket] && (
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '16px',
            right: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--soft-border)',
            boxShadow: '0 12px 32px rgba(58, 37, 27, 0.16)',
            padding: '16px 20px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--soft-border)',
              paddingBottom: '8px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: 'var(--dark-chocolate)',
                }}
              >
                {marketDetails[activeMarket].title}
              </span>
              <span
                style={{
                  marginLeft: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--vinaxo-red)',
                  backgroundColor: 'var(--vinaxo-red-soft)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                }}
              >
                {marketDetails[activeMarket].share}
              </span>
            </div>
            <button
              onClick={() => setActiveMarket(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted-text)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              fontSize: '0.82rem',
              color: 'var(--color-body)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Anchor size={14} color="#B9321F" />
              <span>{marketDetails[activeMarket].port}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#B9321F" />
              <span>{marketDetails[activeMarket].transit}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Package size={14} color="#B9321F" />
              <span>{marketDetails[activeMarket].products}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
