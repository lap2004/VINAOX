/**
 * VINAXO Corporate Website - Bilingual Content & Configuration Data
 * Languages: English (en) and Vietnamese (vi)
 *
 * All corporate information, metrics, certifications, and press citations
 * in this file have been audited and verified against official registries
 * and accredited press publications (Báo Người Lao Động, CafeF, Báo Đồng Tháp,
 * Báo Thanh Niên, Báo 24H, Báo Sài Gòn Giải Phóng, Báo Nông nghiệp & Môi trường).
 */

export const COMPANY_INFO = {
  legalNameVi: "CÔNG TY TNHH VINAXO",
  legalNameEn: "VINAXO COMPANY LIMITED",
  brandName: "VINAXO",
  taxCode: "1201611681",
  foundingYear: 2018,
  incorporatedDate: "27/08/2019",
  headquarters: {
    addressVi: "Khu phố 5, Thị trấn Vĩnh Bình, Huyện Gò Công Tây, Tỉnh Tiền Giang, Việt Nam",
    addressEn: "Quarter 5, Vinh Binh Town, Go Cong Tay District, Tien Giang Province, Vietnam",
    sourcingHubVi: "Đồng Tháp, Tiền Giang, Vĩnh Long (Đồng bằng Sông Cửu Long)",
    sourcingHubEn: "Dong Thap, Tien Giang, Vinh Long (Mekong Delta Hub)"
  },
  facility: {
    area: "4,000 m²",
    investment: "15 tỷ VNĐ (giai đoạn đầu)",
    capacityMonthlyRaw: "1,000+ tấn trái cây tươi / tháng",
    capacityMonthlyFinished: "70 - 120 tấn thành phẩm sấy dẻo / tháng",
    ratio: "10 kg trái cây tươi qua sấy cho ra 1 kg thành phẩm sấy dẻo hảo hạng",
    technology: "Sấy dẻo nhiệt thấp (~60°C), chiên sấy chân không & máy ly tâm tách dầu"
  },
  leadership: [
    {
      name: "Nguyễn Anh Khoa",
      titleVi: "Giám đốc điều hành & Đại diện pháp luật",
      titleEn: "Managing Director & Legal Representative",
      honorVi: "Danh hiệu 'Nông dân sản xuất, kinh doanh giỏi' cấp tỉnh năm 2024 (UBND tỉnh Tiền Giang trao tặng)"
    },
    {
      name: "Hoàng Thị Thu Thảo",
      titleVi: "Đồng sáng lập & Phó Giám đốc / Tổng Giám đốc",
      titleEn: "Co-Founder & Deputy / General Director",
      honorVi: "Giải Nhì cuộc thi 'Ý tưởng sáng tạo khởi nghiệp cấp tỉnh' (Hội LHPN tỉnh trao tặng)"
    },
    {
      name: "Hoàng Mạnh Cường",
      titleVi: "Giám đốc kinh doanh",
      titleEn: "Commercial & Business Director",
      spokespersonFor: "Đại diện phát ngôn trên Báo Người Lao Động, CafeF, 24H, SGGP"
    }
  ],
  contacts: {
    hotline: "+84 907 494 177",
    phoneDisplay: "0907 494 177",
    email: "thaovinaxo@gmail.com",
    website: "https://vinaxo.net"
  },
  auditStatus: {
    lastAudited: "2026-10-23",
    verifiedBy: "Antigravity Research & Verification Engine",
    reportFile: "VINAXO_CONTENT_AUDIT.md"
  }
};

export const siteContent = {
  en: {
    meta: {
      title: "VINAXO - Naturally Pure Dried Fruits | Vietnam's Agricultural Exporter",
      description: "VINAXO (Tien Giang & Dong Thap) specializes in natural soft-dried mango, jackfruit, pineapple, dragon fruit. BRCGS Grade B certified, exported to the US, EU, and Russia."
    },
    nav: {
      home: "Home",
      about: "About Us",
      products: "Products",
      quality: "Our Quality",
      globalMarket: "Global Market",
      news: "Press & Media",
      contact: "Contact",
      getQuote: "Request a Quote"
    },
    hero: {
      eyebrow: "VINAXO COMPANY LIMITED • VIETNAM AGRICULTURAL EXPORTER",
      titleLine1: "Natural Dried Fruits",
      titleLine2: "Global Market Reach",
      description: "Specializing in 100% natural soft-dried tropical fruits from the Mekong Delta — no added sugar, preservative-free. BRCGS Grade B food safety certified, trusted across the United States, Europe, and global B2B markets.",
      primaryCta: "Explore Our Products",
      secondaryCta: "About VINAXO",
      features: [
        {
          id: "natural",
          title: "100% Natural<br>No Added Sugar",
          icon: "leaf"
        },
        {
          id: "sourcing",
          title: "Mekong Delta Hub<br>Tien Giang & Dong Thap",
          icon: "origin"
        },
        {
          id: "export",
          title: "USA, EU & Global<br>70% US • 20% EU",
          icon: "globe"
        }
      ],
      scriptAccent: {
        line1: "Pure",
        line2: "Fruits,",
        line3: "Global",
        line4: "Standards"
      },
      badge: {
        top: "FROM",
        country: "VIETNAM",
        bottom: "TO THE WORLD"
      }
    },
    about: {
      label: "ABOUT VINAXO",
      titleLine1: "Rooted in the Mekong Delta",
      titleLine2: "Elevating Vietnamese Agricultural Value",
      description: "Established in Go Cong Tay, Tien Giang with concentrated mango raw material sourcing in Dong Thap, VINAXO operates a modern 4,000 m² processing facility. Sourcing over 1,000 tons of fresh tropical fruits monthly directly from local farmers, we deploy high-tech low-temperature drying (~60°C) and vacuum frying to preserve authentic aromas and vital nutrients. Our soft-dried mango, jackfruit, and dragon fruit proudly hold 3-Star OCOP recognition and BRCGS international food safety certification.",
      cta: "Our Leadership & Story",
      imageOverlay: {
        tag: "Mekong Delta Produce",
        line1: "Pure Fruits,",
        line2: "Global Value"
      },
      stats: [
        {
          value: "70%",
          label: "US Export Market Share",
          note: "Primary destination (~70% of export volume - Source: Người Lao Động)",
          source: "Source: Người Lao Động"
        },
        {
          value: "20%",
          label: "EU Export Sales",
          note: "Strict compliance with EU ESG & BRCGS standards (Source: Người Lao Động)",
          source: "Source: Người Lao Động"
        },
        {
          value: "1,000+",
          unit: "MT/Mo",
          label: "Fresh Fruit Sourcing Capacity",
          note: "Procurement across Dong Thap, Tien Giang, Vinh Long (Source: Báo Đồng Tháp)",
          source: "Source: Báo Đồng Tháp"
        },
        {
          value: "BRCGS",
          unit: "Grade B",
          label: "Global Food Safety Standard",
          note: "Certified processing facility benchmarked for world supermarkets",
          source: "Source: Người Lao Động"
        }
      ]
    },
    productsSection: {
      label: "OUR PRODUCTS",
      titleLine1: "Selected Tropical Dried Fruits",
      titleLine2: "from Vietnam's Premier Orchards",
      description: "Carefully hand-selected at optimal ripeness and gently dehydrated using low-heat technology — VINAXO brings authentic, nutrient-rich Vietnamese flavors to the international stage.",
      viewAll: "View All Products & Specifications"
    },
    qualitySection: {
      label: "QUALITY & PRODUCTION STANDARDS",
      titleLine1: "Verified International Standards",
      titleLine2: "for Global Food Safety",
      description: "VINAXO's processing facility operates under strict hygiene and temperature controls. Our gentle dehydration at ~60°C and centrifugal oil separation retain authentic colors, vitamins, and tropical flavors without artificial preservatives or refined sugars.",
      certifications: [
        {
          id: "brcgs",
          type: "rect",
          title: "BRCGS",
          subtitle: "Food Safety Grade B",
          status: "VERIFIED STANDARD",
          badgeColor: "emerald",
          desc: "Benchmarked international food safety standard for global supermarket export."
        },
        {
          id: "ocop",
          type: "rect",
          title: "OCOP 3-STAR",
          subtitle: "Certified Regional Produce",
          status: "VERIFIED",
          badgeColor: "amber",
          desc: "Official government recognition for Dried Mango, Jackfruit & Dragon Fruit."
        },
        {
          id: "bsci-esg",
          type: "rect",
          title: "BSCI & ESG",
          subtitle: "Social & Green Compliance",
          status: "ACTIVE IMPLEMENTATION",
          badgeColor: "blue",
          desc: "Full social responsibility, fair workplace practices, and EUDR-aligned supply."
        },
        {
          id: "natural",
          type: "circle",
          title: "100%",
          subtitle: "NATURAL FRUIT",
          status: "CLEAN LABEL",
          badgeColor: "emerald",
          desc: "No chemical preservatives, no synthetic colorings, low/no added sugar."
        }
      ],
      notice: "Note: General mockup badges (FDA, ISO 22000, HACCP) are currently undergoing formal administrative file review.",
      cta: "Learn About Our Quality Commitments"
    },
    globalSection: {
      label: "GLOBAL EXPORT MARKETS",
      titleLine1: "Trusted Supply Chain",
      titleLine2: "to the US, Europe & Asia",
      description: "With ~70% of export volume shipped to the United States and ~20% serving European partners (including Germany and Finland), VINAXO is a trusted B2B partner for wholesale distributors, retail supermarkets, and OEM private-label brands worldwide.",
      cta: "Explore Our Export Network",
      badgeNumber: "70% US • 20% EU",
      badgeText: "Core Export Share",
      markets: [
        { name: "United States", share: "~70%", desc: "Largest export volume for natural soft-dried mango and tropical fruits." },
        { name: "European Union", share: "~20%", desc: "Supplying Germany, Finland with ESG-compliant, EUDR-aligned lines." },
        { name: "Russia & Eastern Europe", share: "Major Partners", desc: "Longstanding seasonal and retail dried fruit partnerships." },
        { name: "South Korea & East Asia", share: "Expanding Market", desc: "High appreciation for soft-dried mango and dragon fruit." }
      ]
    },
    newsSection: {
      label: "PRESS & MEDIA",
      title: "VINAXO in the Press & Corporate News",
      subtitle: "Verified coverage from leading Vietnamese news agencies on our export operations, raw material sourcing, and processing standards.",
      filterAll: "All News",
      filterPress: "VINAXO in the Press",
      filterCompany: "Production & Company Updates",
      viewAll: "Explore Press Archive"
    },
    ctaBanner: {
      label: "B2B COOPERATION & PRIVATE LABEL",
      titleLine1: "Partner with VINAXO",
      titleLine2: "for Premium Tropical Dried Fruits",
      description: "Looking for an authentic Vietnamese dried fruit manufacturer for bulk container orders, supermarket private-label (OEM), or retail distribution? Connect directly with our trade team.",
      button: "Contact Our Export Team",
      visualTag: "100% PURE NATURAL",
      visualTitle: "Export Grade Tropical Fruits",
      visualSub: "Soft-dried mango, jackfruit, pineapple & dragon fruit"
    },
    corporateCards: {
      legalTitle: "Legal Entity & Tax ID",
      legalSub: "Tax Code: 1201611681 • Incorporated: 2019",
      hqTitle: "Headquarters & Facility",
      hqSub: "Facility area: 4,000 m² • Sourcing hubs: Dong Thap, Tien Giang, Vinh Long",
      contactTitle: "Direct Export Contacts",
      contactSub: "Email: thaovinaxo@gmail.com • Web: vinaxo.net"
    },
    modal: {
      title: "Request a Product Quote / B2B Inquiry",
      subtitle: "Connect directly with VINAXO's international trade department for specifications, samples, and container-load pricing.",
      nameLabel: "Full Name",
      namePlaceholder: "e.g. Johnathan Smith",
      emailLabel: "Corporate Email",
      emailPlaceholder: "name@company.com",
      phoneLabel: "Phone / WhatsApp / Zalo",
      phonePlaceholder: "+84 907 494 177",
      companyLabel: "Company & Country",
      companyPlaceholder: "Acme Foods, Germany",
      productLabel: "Product Category of Interest",
      productOptions: [
        "Select product...",
        "Naturally Soft-Dried Mango (OCOP 3-Star / No Added Sugar)",
        "Soft-Dried & Vacuum-Fried Jackfruit (OCOP 3-Star)",
        "Soft-Dried Dragon Fruit (Red / White Flesh, OCOP 3-Star)",
        "Naturally Soft-Dried Pineapple (Tan Phuoc Hub)",
        "Chocolate-Coated Fruits & Natural Fruit Energy Bars (EUDR Aligned)",
        "Full Catalog / OEM Private Label Processing"
      ],
      messageLabel: "Order Requirements & Destination Port",
      messagePlaceholder: "Please describe your estimated container volume (MT), destination port (CIF/FOB), packaging specifications...",
      submitBtn: "Send Inquiry to VINAXO",
      closeBtn: "Close",
      validating: "Validating information...",
      successTitle: "Inquiry Successfully Sent!",
      successBody: "Thank you for contacting VINAXO. Our commercial trade department will review your specifications and reply via email within 24 hours.",
      productDetail: {
        specSheetTitle: "B2B Technical Specifications & Product Sheet",
        categoryLabel: "Category:",
        originLabel: "Sourcing Region:",
        ingredientsLabel: "Ingredients:",
        processLabel: "Processing Method:",
        moistureLabel: "Moisture Content:",
        shelfLifeLabel: "Shelf Life:",
        packagingLabel: "B2B Export Packaging:",
        certificationsLabel: "Standards & Certifications:",
        requestQuoteBtn: "Request Quote for this Product",
        closeBtn: "Close Specification Sheet"
      }
    },
    pageBanners: {
      about: {
        title: "About VINAXO Company Limited",
        subtitle: "Pioneering premium Vietnamese dried fruits from the fertile Mekong Delta to world tables, built upon direct farmer partnerships and BRCGS food safety excellence.",
        home: "Home",
        current: "About Us"
      },
      products: {
        title: "VINAXO Tropical Dried Fruit Catalog",
        subtitle: "100% natural, gently low-temperature dehydrated, zero added sugar or artificial preservatives — bringing authentic tropical tastes to global consumers.",
        home: "Home",
        current: "Products"
      },
      quality: {
        title: "Quality Assurance & Processing Standards",
        subtitle: "Strict food safety controls from accredited orchard sourcing to sterile cleanroom packaging, certified under BRCGS Grade B and BSCI social compliance.",
        home: "Home",
        current: "Our Quality"
      },
      markets: {
        title: "Global Export Markets & Supply Chain",
        subtitle: "Delivering world-class Vietnamese agricultural produce across the United States (~70%), the European Union (~20%), Russia, and East Asia.",
        home: "Home",
        current: "Global Market"
      },
      news: {
        title: "Press & Media Coverage",
        subtitle: "Independent reports and interviews from leading national economic and agricultural news agencies covering VINAXO's processing and export operations.",
        home: "Home",
        current: "Press & Media"
      },
      contact: {
        title: "Connect with VINAXO Export Department",
        subtitle: "Inquire about container-load export pricing, customized OEM private-label manufacturing, or request complimentary product samples from our factory.",
        home: "Home",
        current: "Contact Us"
      }
    },
    contactPage: {
      directInquiryLabel: "DIRECT INQUIRY",
      panelTitle: "B2B Inquiry & Quote Request Form",
      panelDesc: "Please provide your project specifications below. Your request will be forwarded directly to VINAXO's export and commercial department.",
      nameLabel: "Full Name *",
      namePlaceholder: "e.g. Johnathan Smith",
      emailLabel: "Corporate Email *",
      emailPlaceholder: "name@company.com",
      companyLabel: "Company & Country",
      companyPlaceholder: "Acme Foods, Germany",
      phoneLabel: "Phone / WhatsApp / Zalo",
      phonePlaceholder: "+84 907 494 177",
      inquiryTypeLabel: "Inquiry Type *",
      productLabel: "Product of Interest",
      subjectLabel: "Inquiry Subject *",
      subjectDefault: "Select inquiry subject...",
      messageLabel: "Detailed Requirements / Specifications *",
      messagePlaceholder: "Please describe your estimated container volume (MT), destination port (CIF/FOB), packaging specifications...",
      submitBtn: "Send B2B Inquiry to VINAXO",
      connectNote: "💡 <em>Direct connection:</em> Upon submission, your email client will be opened with pre-filled specifications to send directly to <strong>thaovinaxo@gmail.com</strong>. You may also contact our team directly via WhatsApp/Hotline <strong>+84 907 494 177</strong>.",
      cardLegalTitle: "Corporate Legal Entity & Head Office",
      cardFacilityTitle: "Processing Facility & Sourcing Hubs",
      cardHotlineTitle: "Commercial Hotline & Trade Inquiries",
      cardExportTitle: "Export Desk & International Support",
      cardMapTitle: "Factory Location (Go Cong Tay, Tien Giang)",
      cards: {
        legalName: "VINAXO COMPANY LIMITED",
        taxLabel: "Tax Code:",
        taxVal: "1201611681 (Issued by Tien Giang DPI)",
        hqLabel: "Headquarters:",
        hqVal: "Quarter 5, Vinh Binh Town, Go Cong Tay District, Tien Giang Province, Vietnam",
        repLabel: "Legal Representative:",
        repVal: "Mr. Nguyen Anh Khoa (Managing Director)",
        areaLabel: "Facility Area:",
        areaVal: "4,000 m² in Go Cong Tay District, Tien Giang",
        capLabel: "Processing Capacity:",
        capVal: "1,000+ MT fresh fruit / month",
        hubLabel: "Mekong Sourcing Hubs:",
        hubVal: "Dong Thap (Cat Chu mango), Tien Giang (Tan Phuoc pineapple, Cho Gao dragon fruit), Vinh Long",
        hotlineLabel: "B2B Hotline:",
        emailLabel: "Official Email:",
        webLabel: "Website:",
        hoursLabel: "Business Hours:",
        hoursVal: "Monday – Saturday: 07:30 – 17:00 (GMT+7)",
        supportLabel: "Online Channels:",
        incotermsLabel: "Incoterms:",
        incotermsVal: "CIF, FOB, CFR (Cat Lai, Hiep Phuoc, Cai Mep Ports)",
        sampleLabel: "Sample Policy:",
        sampleVal: "Complimentary sample kits for commercial buyers (DHL / FedEx express)"
      },
      mapSectionLabel: "OUR LOCATION",
      mapSectionTitle: "VINAXO Processing Plant & Facility",
      mapSectionDesc: "Strategically located at the heart of the Mekong Delta fruit hubs, ensuring rapid transport to international container ports (Cat Lai, Hiep Phuoc, Cai Mep).",
      mapCoords: "Coordinates: 10.380295, 106.516139 • Vinh Binh, Go Cong Tay, Tien Giang",
      mapDistance: "~65 km from Ho Chi Minh City • Seamless highway and riverway export logistics",
      openMapBtn: "Open in Google Maps",
      ctaLabel: "SUSTAINABLE PARTNERSHIP",
      ctaTitle: "Let's Build a Long-Term Partnership",
      ctaDesc: "VINAXO welcomes international importers, supermarket chains, distributors, and private-label OEM partners. Reliable supply, uniform quality, and long-term commitment.",
      ctaQuoteBtn: "Request a Quote Now",
      faqLabel: "TRADE FAQ",
      faqTitle: "Frequently Asked Questions (B2B Trade FAQ)",
      faqDesc: "Quick guidance on minimum order quantities (MOQ), sample courier services, and international payment terms.",
      faqQ1: "What is the Minimum Order Quantity (MOQ)?",
      faqA1: "For private label (OEM) export orders, standard MOQ is 1 metric ton per SKU. For bulk master carton ingredients, MOQ is flexible starting from 500 kg.",
      faqQ2: "How long does sample delivery take?",
      faqA2: "VINAXO provides complimentary sample kits for verified commercial partners. Samples are dispatched via DHL/FedEx courier, typically arriving within 3–5 business days.",
      faqQ3: "What international payment terms are accepted?",
      faqA3: "We support standard international trade payment instruments including T/T (Telegraphic Transfer) and irrevocable Letter of Credit (L/C at sight) opened via top-tier banks.",
      selectOptions: {
        inquiryTypes: [
          { value: "", label: "Select inquiry subject..." },
          { value: "Container Export Quote Inquiry (FCL/LCL)", label: "Container Export Quote Inquiry (FCL/LCL)" },
          { value: "Private Label / OEM Manufacturing", label: "Private Label / OEM Manufacturing" },
          { value: "Product Specifications & Catalog", label: "Product Specifications & Catalog" },
          { value: "Product Sample Request", label: "Product Sample Request" },
          { value: "Wholesale & Regional Distribution", label: "Wholesale & Regional Distribution" },
          { value: "General Agricultural Trade Inquiry", label: "General Agricultural Trade Inquiry" }
        ],
        products: [
          { value: "All Products / Undecided", label: "All Products / Undecided" },
          { value: "Naturally Soft-Dried Mango (OCOP 3-Star / No Added Sugar)", label: "Naturally Soft-Dried Mango" },
          { value: "Soft-Dried & Vacuum-Fried Jackfruit (OCOP 3-Star)", label: "Soft-Dried & Vacuum Jackfruit" },
          { value: "Soft-Dried Dragon Fruit (Red / White Flesh, OCOP 3-Star)", label: "Soft-Dried Dragon Fruit" },
          { value: "Naturally Soft-Dried Pineapple (Tan Phuoc Hub)", label: "Naturally Soft-Dried Pineapple" },
          { value: "Chocolate-Coated Fruits & Natural Fruit Energy Bars", label: "Fruit Energy Bars & Chocolate" },
          { value: "Full Catalog / OEM Private Label Processing", label: "Custom OEM Formulation" }
        ]
      }
    },
    mapLabels: {
      usa: "USA (~70%)",
      eu: "EU (~20%)",
      russia: "RUSSIA & E. EUROPE",
      korea: "KOREA & E. ASIA",
      vietnam: "VINAXO (TIEN GIANG)"
    },
    productFilterTabs: {
      all: "All Products",
      mango: "Soft-Dried Mango",
      jackfruit: "Soft-Dried Jackfruit",
      dragon: "Soft-Dried Dragon Fruit",
      pineapple: "Soft-Dried Pineapple",
      banana: "Soft-Dried Banana",
      "energy-bar": "Fruit Bars & Chocolate",
      energyBar: "Fruit Bars & Chocolate",
      ocop: "★ OCOP 3-Star Produce"
    },
    marketsPage: {
      section1: {
        label: "GLOBAL FOOTPRINT",
        title: "Connecting Vietnamese Produce with Global Consumers",
        desc: "With high-tech processing capabilities and BRCGS Grade B food safety standards, VINAXO has built robust supply chains into demanding international markets adhering to strict hygiene and social compliance requirements."
      },
      pillars: {
        usa: {
          badge: "Primary Export Market (~70%)",
          title: "United States",
          desc: "VINAXO's largest market, accounting for approximately 70% of export volume. Our natural soft-dried mango and tropical fruits are distributed through wholesale importers, retail supermarket chains, and Asian-American distribution networks.",
          source: "Source: Người Lao Động (02/03/2025) - Quote from Commercial Director Hoang Manh Cuong"
        },
        eu: {
          badge: "High-Standard Market (~20%)",
          title: "European Union",
          desc: "Accounting for approximately 20% of export turnover, concentrated in Northern and Western Europe (Germany, Finland). VINAXO strictly complies with BSCI social compliance, pesticide residue limits, and EUDR anti-deforestation requirements.",
          source: "Source: Người Lao Động (02/03/2025)"
        },
        russia: {
          badge: "Traditional Long-Term Market",
          title: "Russia & CIS Region",
          desc: "A market with stable demand and strong growth for premium soft-dried tropical fruits (mango, jackfruit, pineapple). Longstanding trade relations sustain regular containerized shipments.",
          source: "Source: VINAXO Corporate Trade Portfolio"
        },
        eastAsia: {
          badge: "Expanding Market",
          title: "South Korea & East Asia",
          desc: "East Asian consumers highly favor naturally soft-dried mango and red-fleshed dragon fruit as healthy, nutrient-rich snacks and premium gift selections.",
          source: "Source: CafeF & Báo Đồng Tháp (2025)"
        }
      },
      section2: {
        label: "LOGISTICS INFRASTRUCTURE",
        title: "Export Routes & Maritime Logistics Network",
        desc: "Located in Tien Giang at the heart of the Mekong Delta, VINAXO's facility connects seamlessly via regional expressways to Vietnam's premier deep-sea international container terminals.",
        portsTitle: "Key Departure Ports",
        portsDesc: "Cat Lai (HCMC), Hiep Phuoc & Cai Mep Deep-Sea Port",
        specTitle: "Logistics Lead Time",
        specDesc: "~2 hours from facility to port gate",
        airTitle: "Air Freight Express",
        airDesc: "Tan Son Nhat (SGN) for rapid sample delivery",
        containerTitle: "Container Loading Specs",
        containerDesc: "20ft FCL: 12 – 14 MT • 40ft FCL: 24 – 26 MT"
      },
      section3: {
        label: "PARTNERSHIP PROCESS",
        title: "International Trade Cooperation Workflow",
        desc: "Rapid, transparent, and professional trade partnerships with VINAXO's dedicated export team.",
        step1Num: "Step 1",
        step1Title: "Consultation & Sample Dispatch",
        step1Desc: "Product selection review, sample dispatch via DHL/FedEx courier, and comprehensive FOB/CIF quotation based on projected container volumes.",
        step2Num: "Step 2",
        step2Title: "Contracting & OEM Packaging Design",
        step2Desc: "Specification alignment, private label packaging artwork finalization, production scheduling, and international payment terms (L/C, T/T).",
        step3Num: "Step 3",
        step3Title: "Batch Manufacturing, Testing & Port Dispatch",
        step3Desc: "Controlled batch dehydration, issuing Certificates of Analysis (COA), export customs clearance, and prompt courier of complete Bill of Lading (B/L) shipping sets."
      },
      section4: {
        label: "INTERNATIONAL TRADE INQUIRY",
        title: "Connect with VINAXO International Export Department",
        desc: "We welcome international importers, retail chains, and global wholesalers to discuss delivery terms, preferential FCL volume rates, and customized seasonal crop contracts.",
        btnPrimary: "Request Container Quote",
        btnSecondary: "Contact Export Desk"
      }
    },
    productsPage: {
      section1: {
        label: "PREMIUM VIETNAMESE DRIED FRUITS",
        title: "Selected Tropical Fruits from Certified Mekong Orchards",
        desc: "Every batch of VINAXO dried fruits undergoes rigorous inspection from the Mekong Delta's most renowned orchards (Dong Thap, Tien Giang, Vinh Long). A precise 10:1 dehydration recovery ratio preserves authentic soft chewy textures, natural aroma, and rich nutrients."
      },
      section2: {
        label: "B2B COOPERATION & PRIVATE LABEL",
        title: "OEM Manufacturing & Export Packaging Solutions",
        desc: "VINAXO is a trusted contract manufacturer for international retail chains, supermarkets, and specialty food brands across the United States, Europe, and Asia, offering end-to-end solutions from formulation to finished retail packaging.",
        card1Title: "Customized Texture & Slicing",
        card1Desc: "Tailor finished moisture levels from 12% to 18% to regional consumer preferences. Slicing options include slices, strips, dices, or natural whole halves.",
        card2Title: "Retail Packaging & Bulk Cartons",
        card2Desc: "Private label pouch printing in 50g, 100g, 250g, 500g zipper bags with nitrogen flushing or 5kg–10kg master cartons for industrial repacking.",
        card3Title: "Full Food Safety & Compliance Dossier",
        card3Desc: "Certificate of Analysis (COA) for every export lot, comprehensive microbiological, heavy metal, and pesticide residue testing meeting FDA and EFSA requirements."
      },
      section3: {
        label: "TECHNICAL SPECIFICATIONS",
        title: "Export-Grade Technical Specifications Summary",
        desc: "All products undergo controlled processing from orchard-fresh fruit selection to sterile moisture-barrier packaging.",
        colName: "Product Name",
        colOrigin: "Sourcing Region",
        colMoisture: "Moisture",
        colShelfLife: "Shelf Life",
        colCert: "Certifications",
        colQuote: "Quote",
        row1Name: "Naturally Soft-Dried Mango",
        row1Origin: "Dong Thap & Tien Giang",
        row2Name: "Soft-Dried & Vacuum Jackfruit",
        row2Origin: "Tien Giang & Vinh Long",
        row3Name: "Soft-Dried Dragon Fruit",
        row3Origin: "Cho Gao, Tien Giang",
        row4Name: "Naturally Soft-Dried Pineapple",
        row4Origin: "Tan Phuoc, Tien Giang",
        row5Name: "Naturally Soft-Dried Banana",
        row5Origin: "Mekong Delta Hub",
        row6Name: "Fruit Energy Bars & Chocolate",
        row6Origin: "Selected Regional Blend",
        months12: "12 Months",
        quoteBtn: "Request Quote",
        certOcop: "3-Star OCOP",
        certBrcgs: "BRCGS Facility",
        certNatural: "100% Clean Label",
        certEudr: "EUDR Aligned"
      },
      section4: {
        label: "B2B COOPERATION & PRIVATE LABEL",
        title: "Request Samples & Container Quotes",
        desc: "Commercial partners, international importers, and distributors can connect directly with our export desk for physical sample kits and preferential FOB/CIF price lists.",
        btnPrimary: "Request Quick Quote",
        btnSecondary: "Contact Export Desk"
      }
    },
    qualityPage: {
      section1: {
        label: "MANUFACTURING WORKFLOW",
        title: "6-Step Closed Manufacturing Process Under BRCGS Standards",
        desc: "VINAXO's facility operates under strict critical control points, completely eliminating refined sugars and synthetic bleaching agents to preserve authentic colors, fiber, and natural vitamins.",
        step1Title: "Orchard Sourcing & Inbound Quality Inspection",
        step1Desc: "Harvested from contracted grower cooperatives in Dong Thap, Tien Giang, and Vinh Long. Measuring natural Brix sugar levels, sensory ripeness checks, and pesticide residue screening before warehouse entry.",
        step2Title: "Preparation, Peeling & Ozone Disinfection Wash",
        step2Desc: "Multi-stage washing combined with ozone aeration for outer surface disinfection. Cleanroom-attired workers peel, deseed, and uniformly slice fruit.",
        step3Title: "Low-Temperature Pretreatment & Natural Conditioning",
        step3Desc: "Gentle thermal conditioning inactivates color-changing enzymes naturally, without sulfur dioxide (SO2) bleaching or artificial refined sugars.",
        step4Title: "Low-Heat Dehydration (~60°C) & Vacuum Frying",
        step4Desc: "Circulating convective low-temperature dehydrators gradually remove moisture, preserving pliable texture, dietary fiber, and vitamin C. Vacuum frying is applied for crunchy lines.",
        step5Title: "Centrifugal De-Oiling & Cleanroom Cooling",
        step5Desc: "Vacuum-fried items enter high-capacity centrifuges to extract excess oil, ensuring light crispness and minimal fat content meeting healthy snack standards.",
        step6Title: "Metal Detection, Cleanroom Packaging & Batch Coding",
        step6Desc: "100% of finished lots pass through automated metal detectors. Sealed in multi-layer barrier pouches with nitrogen flushing or export cartons with full traceability barcodes."
      },
      section2: {
        label: "INFRASTRUCTURE & CAPACITY",
        title: "Modern 4,000 m² Processing Facility in Tien Giang",
        desc: "Located in Vinh Binh Town, Go Cong Tay District, Tien Giang Province, VINAXO's plant was built with an initial investment of 15 billion VND, purpose-engineered for export-grade food safety.",
        stat1Val: "1,000+ MT",
        stat1Label: "Fresh fruit sourced monthly",
        stat2Val: "70 - 120 MT",
        stat2Label: "Finished dried fruit monthly",
        stat3Val: "10:1 Ratio",
        stat3Label: "10 kg fresh yields 1 kg dried",
        stat4Val: "BRCGS Grade B",
        stat4Label: "Global food safety benchmark",
        sourceNote: "* Verified source data: Báo Người Lao Động (02/03/2025) and Báo Đồng Tháp (19/09/2025).",
        imgAlt: "VINAXO Tien Giang facility and agricultural sourcing hubs"
      },
      section3: {
        label: "CERTIFIED STANDARDS",
        title: "Verified Quality Assurance & Certification Portfolio",
        desc: "VINAXO is committed to complete transparency in all quality declarations. All certifications below have been audited against official registers and government acknowledgments.",
        brcgsBadge: "VERIFIED STANDARD",
        brcgsTitle: "BRCGS Food Safety",
        brcgsSub: "Grade B Benchmark",
        brcgsDesc: "Global food safety standard published by the British Retail Consortium, an essential passport for exporting into major supermarket chains across the US and Europe.",
        ocopBadge: "VERIFIED • OCOP 3-STAR",
        ocopTitle: "Tien Giang 3-Star OCOP",
        ocopSub: "Provincial Government Certified",
        ocopDesc: "Official recognition of exceptional regional produce by Tien Giang People's Committee for 3 key lines: Dried Mango, Jackfruit, and Dragon Fruit.",
        bsciBadge: "ACTIVE IMPLEMENTATION",
        bsciTitle: "BSCI & ESG Green Chain",
        bsciSub: "Social & Environmental Compliance",
        bsciDesc: "Upholding fair workplace conditions, ethical employment, living wages, and EUDR deforestation-free supply chain commitments for European partners.",
        cleanBadge: "100% NATURAL STANDARD",
        cleanTitle: "100% Clean Label",
        cleanSub: "Zero Chemical Preservatives",
        cleanDesc: "Committed to zero refined artificial sugar, zero synthetic dyes, and zero chemical preservatives. Retaining authentic natural fruit flavor.",
        transparencyTitle: "Quality Transparency Notice:",
        transparencyText: "VINAXO strictly adheres to the principle of only publishing audited and verified certifications. Standard trade badges (FDA, ISO 22000, HACCP) are currently in formal administrative review, prepared for bilateral trade contracts upon specific importer request."
      },
      section4: {
        title: "Tour Our Facility or Request Quality Dossiers",
        desc: "We welcome international audit teams, commercial partners, and importers to review our BRCGS inspection reports, COA test records, or schedule an on-site factory tour.",
        btnPrimary: "Request Quality Audit Dossier",
        btnSecondary: "Contact Quality Assurance Team"
      }
    },
    aboutPage: {
      metrics: {
        m1Num: "4,000 m²",
        m1Label: "Processing Facility Area",
        m1Note: "Facility located in Go Cong Tay, Tien Giang (Initial investment: 15B VND)",
        m1Source: "Source: Báo Nông nghiệp & Môi trường",
        m2Num: "1,000+ MT",
        m2Label: "Fresh Fruit Sourcing Capacity",
        m2Note: "Seasonal procurement across Dong Thap, Tien Giang, Vinh Long",
        m2Source: "Source: Báo Đồng Tháp",
        m3Num: "70 - 120 MT",
        m3Label: "Monthly Finished Output",
        m3Note: "10:1 dehydration ratio serving export orders",
        m3Source: "Source: Người Lao Động",
        m4Num: "~70% USA",
        m4Label: "US Export Market Share",
        m4Note: "Primary destination alongside ~20% European shipments",
        m4Source: "Source: Người Lao Động"
      },
      timeline: {
        label: "OUR JOURNEY",
        title: "Milestones in Elevating Vietnamese Agriculture",
        desc: "From a Mekong Delta startup to a trusted natural dried fruit exporter recognized on international supermarket shelves.",
        y2018Badge: "Year 2018",
        y2018Title: "Agricultural Dehydration Inception",
        y2018Desc: "Co-founders Hoang Thi Thu Thao and Nguyen Anh Khoa began addressing post-harvest oversupply in the Mekong Delta, pioneering low-temperature drying to preserve genuine fruit flavors.",
        y2019Badge: "Year 2019",
        y2019Title: "Corporate Incorporation of VINAXO",
        y2019Desc: "Officially incorporated as VINAXO COMPANY LIMITED (Tax Code: 1201611681), building the foundation in Vinh Binh Town, Go Cong Tay District, Tien Giang.",
        y2021Badge: "Year 2021",
        y2021Title: "15 Billion VND Processing Facility Investment",
        y2021Desc: "Expanded into a 4,000 m² facility with 6 modern industrial dehydrators and cold storage, processing tens of tons of fresh fruits daily.",
        y2023Badge: "Year 2023",
        y2023Title: "BRCGS Certification & US Market Expansion",
        y2023Desc: "Achieved BRCGS Food Safety Grade B international certification; scaled exports to the United States (~70% share) and European Union (~20%).",
        y2024Badge: "Year 2024",
        y2024Title: "Exemplary Entrepreneur Honors & OCOP Awards",
        y2024Desc: "Managing Director Nguyen Anh Khoa honored as Provincial Exemplary Farmer-Entrepreneur; Ms. Hoang Thi Thu Thao won 2nd Prize in Provincial Startup Contest; products earned 3-Star OCOP recognition.",
        presentBadge: "Present",
        presentTitle: "Global B2B Supply Chain Expansion",
        presentDesc: "Actively sourcing over 1,000 tons of fruit monthly, expanding private-label OEM manufacturing for retail chains and digital agricultural platforms worldwide."
      },
      infrastructure: {
        label: "INFRASTRUCTURE & TECHNOLOGY",
        title: "4,000 m² Processing Facility in Tien Giang",
        desc: "Located at Quarter 5, Vinh Binh Town, Go Cong Tay District, VINAXO's production plant is engineered under international food hygiene standards.",
        feature1Title: "6 Low-Temperature Dehydration Units (~60°C)",
        feature1Desc: "Strict moisture control preserving natural vibrant golden hues without chemical coloring or refined sugars.",
        feature2Title: "Cold Storage for Seasonal Crop Stocking",
        feature2Desc: "Capacity to store fresh fruits during peak harvest, sustaining continuous manufacturing through October each year for dependable exports.",
        feature3Title: "Vacuum Frying & Centrifugal De-Oiling Line",
        feature3Desc: "Dedicated to naturally crisp jackfruit, drastically lowering oil content to protect consumer health."
      },
      sourcing: {
        label: "MEKONG DELTA ORCHARDS",
        title: "Direct Farmer Partnerships & Clean Supply",
        desc: "VINAXO partners closely with premier fruit-growing hubs across the Mekong Delta, creating sustainable livelihoods for hundreds of farming families.",
        row1Label: "Dong Thap Mango Hub (Cat Chu & Hoa Loc):",
        row1Val: "Procuring over 1,000 tons seasonally",
        row2Label: "Tan Phuoc Pineapple Capital, Tien Giang:",
        row2Val: "Supplying naturally sweet Queen pineapples",
        row3Label: "Cho Gao Dragon Fruit Region, Tien Giang:",
        row3Val: "Betalain-rich red dragon fruit",
        row4Label: "Tien Giang & Hau Giang Jackfruit Orchards:",
        row4Val: "Thick-fleshed aromatic Thai jackfruit"
      },
      gallery: {
        label: "FACILITY & PRODUCTION GALLERY",
        title: "VINAXO Processing Plant, Production Lines & Orchards",
        desc: "Photographs from our processing facility in Vinh Binh, Go Cong Tay, Tien Giang and Mekong Delta agricultural hubs.",
        card1Tag: "4,000 M² FACILITY",
        card1Title: "Cleanrooms & Low-Heat Dehydration Chambers",
        card1Desc: "6 low-heat dehydrators (~60°C) and cold storage in Vinh Binh, Tien Giang with initial investment of 15 billion VND.",
        card2Tag: "TESTING & PACKAGING",
        card2Title: "Metal Detection & Moisture-Barrier Packaging",
        card2Desc: "100% automated metal detection per batch, nitrogen-flushed foil pouches and master cartons for B2B container shipments.",
        card3Tag: "MEKONG SOURCING HUBS",
        card3Title: "Seasonal Mango & Tropical Fruit Procurement",
        card3Desc: "Sourcing over 1,000 tons of fresh produce monthly, fostering sustainable livelihoods for hundreds of farming households."
      },
      process: {
        label: "PRODUCTION PROCESS",
        title: "6-Step Closed Manufacturing Process Under BRCGS Standards",
        desc: "From tree-ripened orchard fruits to premium soft-dried delicacies exported to the United States and Europe.",
        step1Title: "Orchard Sourcing & Brix Level Testing",
        step1Desc: "Fresh fruit harvested from partner cooperatives in Dong Thap, Tien Giang, and Vinh Long. Measuring natural Brix sugar levels before storage.",
        step2Title: "Ozone Disinfection Wash & Cleanroom Peeling",
        step2Desc: "Surface sterilization via ozone aeration. Cleanroom personnel peel, deseed, and uniformly slice every piece.",
        step3Title: "Low-Heat Pretreatment & Natural Conditioning",
        step3Desc: "Naturally inactivates color-changing enzymes without sulfur dioxide (SO2) bleaching or refined sugars.",
        step4Title: "Low-Temperature Dehydration (~60°C) & Vacuum Frying",
        step4Desc: "6 low-temperature convection dehydrators gently remove moisture, preserving golden color, chewy texture, and vitamins A & C.",
        step5Title: "Centrifugal De-Oiling & Cleanroom Cooling",
        step5Desc: "For fried lines, high-capacity centrifugal separators extract surplus oil, ensuring minimal fat content under clean snack standards.",
        step6Title: "Metal Detection, Cleanroom Packaging & Batch Coding",
        step6Desc: "100% finished goods pass automated metal detection. Packed in nitrogen-flushed foil zipper bags or export master cartons with barcodes.",
        btnQuality: "View Full Quality Assurance System"
      },
      certificationsSection: {
        label: "CERTIFICATIONS & EXPORT STANDARDS",
        title: "Transparent International Quality Commitments",
        desc: "VINAXO strictly adheres to truthfulness across all declared standards, confirmed by regulatory agencies and international inspection bodies."
      }
    },
    leadership: {
      label: "VINAXO LEADERSHIP",
      title: "Pioneering Value for Vietnamese Agriculture",
      subtitle: "A passionate founding and executive team committed to regional agricultural quality and elevating brand prestige on the international stage.",
      khoa: {
        role: "Managing Director & Legal Representative",
        desc: "Honored as Provincial Exemplary Farmer-Entrepreneur in Tien Giang (2024). Leads strategic investment in technology, the 4,000 m² facility expansion, and sustainable Mekong farmer contracts.",
        stamp: "Verified: Báo Đồng Tháp"
      },
      thao: {
        role: "Co-Founder & Deputy Director",
        desc: "Originator of the VINAXO Dried Fruits Project, 2nd Prize Winner in the Provincial Innovative Startup Competition. Directly oversees R&D processes and 3-Star OCOP quality standards.",
        stamp: "Verified: Báo Đồng Tháp"
      },
      cuong: {
        role: "Commercial & Business Development Director",
        desc: "Commercial representative overseeing key export markets including the US, EU, and Russia; featured spokesperson across economic media (Người Lao Động, CafeF, 24H) regarding green agricultural export chains.",
        stamp: "Verified: CafeF & NLĐ"
      }
    },
    newsPage: {
      mediaCard: {
        label: "MEDIA RELATIONS",
        title: "Press & Media Relations Contact",
        desc: "VINAXO's Communications Department provides high-resolution imagery, company media kits, orchard statistics, and arranges executive interviews for journalists and media agencies.",
        btnInterview: "Send Interview Request",
        btnContact: "View Contact Details",
        boxTitle: "Official Media Spokespersons",
        spokespersonLabel: "Representatives:",
        spokespersonVal: "Mr. Hoang Manh Cuong (Commercial Director) / Ms. Hoang Thi Thu Thao (Deputy Director)",
        emailLabel: "Email:",
        hotlineLabel: "Hotline:",
        copyrightNote: "* Copyright Note: All articles and excerpts retain copyright with their original publishing agencies. The 'Read Original Article' button directs readers directly to the official news source."
      }
    },
    modal: {
      productDetail: {
        specSheetTitle: "B2B Technical Specifications",
        originLabel: "Sourcing Region:",
        ingredientsLabel: "Ingredients:",
        processLabel: "Dehydration Process:",
        moistureLabel: "Standard Moisture:",
        shelfLifeLabel: "Shelf Life:",
        storageLabel: "Storage Conditions:",
        packagingLabel: "Packaging Formats:",
        certificationsLabel: "Quality & Certifications:",
        requestQuoteBtn: "Request Quote for this Product",
        closeBtn: "Close"
      }
    },
    footer: {
      tagline: "Natural Goodness | Global Reach",
      companyName: "VINAXO COMPANY LIMITED",
      companyBio: "VINAXO Company Limited specializes in processed Vietnamese agricultural products and dried fruits, serving domestic and international markets with a focus on quality and long-term partnerships.",
      quickLinksHeading: "QUICK LINKS",
      contactHeading: "CONTACT INFORMATION",
      developedHeading: "DEVELOPED BY",
      taxCodeLabel: "Tax Code",
      taxCode: "1201611681",
      address: "Quarter 5, Vinh Binh Town, Go Cong Tay District, Tien Giang Province, Vietnam",
      phone: "(+84) 907 494 177",
      email: "thaovinaxo@gmail.com",
      website: "https://vinaxo.net",
      sonaiTitle: "Artificial Intelligence Technology",
      sonaiDesc: "Website Designed & Developed by SONAI",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      sitemap: "Sitemap",
      rights: "© 2026 VINAXO COMPANY LIMITED. All rights reserved."
    }
  },

  vi: {
    meta: {
      title: "VINAXO - Trái Cây Sấy Tự Nhiên | Doanh Nghiệp Xuất Khẩu Nông Sản Việt Nam",
      description: "CÔNG TY TNHH VINAXO (Tiền Giang & Đồng Tháp) chuyên chế biến và xuất khẩu xoài sấy dẻo tự nhiên, mít sấy, thơm sấy, thanh long sấy. Đạt chuẩn BRCGS Grade B, OCOP 3 sao, xuất khẩu Mỹ, EU, Nga."
    },
    nav: {
      home: "Trang chủ",
      about: "Về chúng tôi",
      products: "Sản phẩm",
      quality: "Chất lượng",
      globalMarket: "Thị trường",
      news: "Báo chí & Tin tức",
      contact: "Liên hệ",
      getQuote: "Nhận báo giá"
    },
    hero: {
      eyebrow: "CÔNG TY TNHH VINAXO • XUẤT KHẨU NÔNG SẢN VIỆT NAM",
      titleLine1: "Trái Cây Sấy Tự Nhiên",
      titleLine2: "Vươn Tầm Quốc Tế",
      description: "Doanh nghiệp chuyên chế biến và xuất khẩu trái cây sấy dẻo tự nhiên vùng Đồng bằng Sông Cửu Long — 100% tự nhiên, không thêm đường, không chất bảo quản. Đạt chuẩn an toàn thực phẩm BRCGS Grade B, sản phẩm OCOP 3 sao, xuất khẩu mạnh sang thị trường Hoa Kỳ, Châu Âu và Nga.",
      primaryCta: "Khám phá sản phẩm",
      secondaryCta: "Về VINAXO",
      features: [
        {
          id: "natural",
          title: "100% Trái cây tự nhiên<br>Không đường, không phụ gia",
          icon: "leaf"
        },
        {
          id: "sourcing",
          title: "Vùng trồng ĐBSCL chọn lọc<br>Vựa xoài Đồng Tháp & Tiền Giang",
          icon: "origin"
        },
        {
          id: "export",
          title: "Xuất khẩu Mỹ & Châu Âu<br>70% thị phần Mỹ • 20% EU",
          icon: "globe"
        }
      ],
      scriptAccent: {
        line1: "Trái cây",
        line2: "thuần khiết,",
        line3: "Tiêu chuẩn",
        line4: "toàn cầu"
      },
      badge: {
        top: "TỪ",
        country: "VIỆT NAM",
        bottom: "RA THẾ GIỚI"
      }
    },
    about: {
      label: "VỀ CÔNG TY TNHH VINAXO",
      titleLine1: "Bắt nguồn từ phù sa miền Tây",
      titleLine2: "Nâng tầm giá trị nông sản Việt",
      description: "Được thành lập tại thị trấn Vĩnh Bình, huyện Gò Công Tây, tỉnh Tiền Giang cùng vùng nguyên liệu xoài tập trung tại Đồng Tháp, VINAXO sở hữu nhà máy chế biến hiện đại quy mô 4.000 m². Trung bình mỗi tháng, công ty thu mua hơn 1.000 tấn trái cây tươi từ bà con nông dân Đồng bằng Sông Cửu Long, áp dụng công nghệ sấy nhiệt thấp (~60°C) và chiên chân không tách dầu ly tâm để giữ trọn vẹn màu sắc, dưỡng chất và hương vị tự nhiên. Các sản phẩm xoài sấy dẻo, mít sấy và thanh long sấy của VINAXO vinh dự đạt chuẩn OCOP 3 sao và nhà máy được chứng nhận an toàn thực phẩm quốc tế BRCGS Grade B.",
      cta: "Hành trình & Lãnh đạo",
      imageOverlay: {
        tag: "Nông sản ĐBSCL",
        line1: "Nông sản Việt,",
        line2: "Giá trị toàn cầu"
      },
      stats: [
        {
          value: "70%",
          label: "Thị phần xuất khẩu Mỹ",
          note: "Thị trường chủ lực (chiếm ~70% lượng xuất khẩu - Nguồn: Báo Người Lao Động)",
          source: "Nguồn: Báo Người Lao Động"
        },
        {
          value: "20%",
          label: "Doanh số xuất khẩu Châu Âu",
          note: "Đáp ứng tiêu chuẩn xanh ESG và BRCGS (Nguồn: Báo Người Lao Động)",
          source: "Nguồn: Báo Người Lao Động"
        },
        {
          value: "1.000+",
          unit: "Tấn/Tháng",
          label: "Năng lực thu mua nguyên liệu tươi",
          note: "Liên kết bao tiêu tại Đồng Tháp, Tiền Giang, Vĩnh Long (Nguồn: Báo Đồng Tháp)",
          source: "Nguồn: Báo Đồng Tháp"
        },
        {
          value: "BRCGS",
          unit: "Grade B",
          label: "Tiêu chuẩn an toàn thực phẩm quốc tế",
          note: "Nhà máy đạt chuẩn xuất khẩu vào chuỗi siêu thị toàn cầu",
          source: "Nguồn: Báo Người Lao Động"
        }
      ]
    },
    productsSection: {
      label: "DANH MỤC SẢN PHẨM",
      titleLine1: "Trái cây sấy dẻo hảo hạng",
      titleLine2: "từ những vựa trái cây trù phú Việt Nam",
      description: "Thu hoạch đúng độ chín tự nhiên, sơ chế vệ sinh nghiêm ngặt và sấy dẻo bằng công nghệ hiện đại — VINAXO giữ trọn hương vị tươi ngon nguyên bản của từng loại trái cây nhiệt đới Việt Nam.",
      viewAll: "Xem tất cả sản phẩm & Thông số"
    },
    qualitySection: {
      label: "CHẤT LƯỢNG & TIÊU CHUẨN SẢN XUẤT",
      titleLine1: "Tiêu chuẩn kiểm định thực tế",
      titleLine2: "Vững vàng chất lượng quốc tế",
      description: "Quy trình chế biến tại nhà máy VINAXO được kiểm soát nghiêm ngặt theo tiêu chuẩn an toàn thực phẩm quốc tế. Công nghệ sấy dẻo nhiệt thấp (~60°C) và công nghệ sấy chân không tách dầu giúp giữ nguyên hàm lượng vitamin và cấu trúc mềm dẻo tự nhiên, hoàn toàn không phụ thuộc chất bảo quản hay phẩm màu công nghiệp.",
      certifications: [
        {
          id: "brcgs",
          type: "rect",
          title: "BRCGS",
          subtitle: "Food Safety Grade B",
          status: "ĐÃ XÁC MINH",
          badgeColor: "emerald",
          desc: "Tiêu chuẩn an toàn thực phẩm quốc tế BRCGS Grade B được báo chí công nhận cho nhà máy VINAXO."
        },
        {
          id: "ocop",
          type: "rect",
          title: "OCOP 3 SAO",
          subtitle: "Sản phẩm OCOP Tiền Giang",
          status: "ĐÃ XÁC MINH",
          badgeColor: "amber",
          desc: "Chứng nhận cấp tỉnh cho Xoài sấy dẻo, Mít sấy dẻo và Thanh long sấy dẻo VINAXO."
        },
        {
          id: "bsci-esg",
          type: "rect",
          title: "BSCI & ESG",
          subtitle: "Trách nhiệm xã hội & Xanh hóa",
          status: "ĐANG ÁP DỤNG",
          badgeColor: "blue",
          desc: "Thực hành phát triển bền vững ESG, trách nhiệm xã hội BSCI và thích ứng tiêu chuẩn chống phá rừng EUDR."
        },
        {
          id: "natural",
          type: "circle",
          title: "100%",
          subtitle: "TỰ NHIÊN",
          status: "CLEAN LABEL",
          badgeColor: "emerald",
          desc: "Dòng sản phẩm Natural Dried Fruit không thêm đường, không chất bảo quản hoá học."
        }
      ],
      notice: "Ghi chú kiểm định: Các biểu tượng mẫu demo cũ (FDA, ISO 22000, HACCP) đang được rà soát hồ sơ theo đúng nguyên tắc minh bạch dữ liệu.",
      cta: "Tìm hiểu cam kết chất lượng của VINAXO"
    },
    globalSection: {
      label: "THỊ TRƯỜNG XUẤT KHẨU",
      titleLine1: "Hành lang xuất khẩu vững chắc",
      titleLine2: "vươn tới Hoa Kỳ, Châu Âu và Nga",
      description: "Với ~70% sản lượng xuất khẩu tới thị trường Hoa Kỳ và ~20% doanh số tại các quốc gia Châu Âu (như Đức, Phần Lan), VINAXO tự hào là đối tác chế biến tin cậy của các nhà nhập khẩu B2B, hệ thống bán lẻ và các đơn vị gia công OEM nhãn hàng riêng.",
      cta: "Mạng lưới xuất khẩu của chúng tôi",
      badgeNumber: "70% Mỹ • 20% EU",
      badgeText: "Tỷ trọng xuất khẩu chính",
      markets: [
        { name: "Hoa Kỳ", share: "~70%", desc: "Thị trường xuất khẩu lớn nhất của VINAXO với các dòng xoài sấy dẻo tự nhiên." },
        { name: "Liên minh Châu Âu", share: "~20%", desc: "Cung cấp cho đối tác Đức, Phần Lan theo tiêu chuẩn ESG, BRCGS và EUDR." },
        { name: "Nga & Đông Âu", share: "Đối tác lớn", desc: "Thị trường truyền thống với đơn hàng lớn dịp lễ Tết và phân phối bán lẻ." },
        { name: "Hàn Quốc & Đông Á", share: "Đang mở rộng", desc: "Nhu cầu cao đối với xoài sấy dẻo và thanh long sấy dẻo nguyên vị." }
      ]
    },
    newsSection: {
      label: "BÁO CHÍ NÓI VỀ VINAXO",
      title: "Tin tức báo chí & Hoạt động doanh nghiệp",
      subtitle: "Tổng hợp các bài viết và tin tức từ các cơ quan báo chí chính thống về hoạt động chế biến, xuất khẩu và nguồn nguyên liệu của VINAXO.",
      filterAll: "Tất cả tin tức",
      filterPress: "Báo chí nói về VINAXO",
      filterCompany: "Hoạt động doanh nghiệp",
      viewAll: "Xem tất cả bài báo"
    },
    ctaBanner: {
      label: "HỢP TÁC B2B & GIA CÔNG OEM",
      titleLine1: "Hợp tác cùng VINAXO",
      titleLine2: "Cung cấp trái cây sấy chất lượng cho thị trường quốc tế",
      description: "Quý đối tác đang tìm kiếm nhà máy sản xuất trái cây sấy uy tín tại Việt Nam cho đơn hàng container xuất khẩu, gia công thương hiệu riêng (OEM) hoặc phân phối siêu thị? Hãy liên hệ trực tiếp với đội ngũ kinh doanh của chúng tôi.",
      button: "Liên hệ đội ngũ kinh doanh",
      visualTag: "100% THUẦN TỰ NHIÊN",
      visualTitle: "Trái Cây Sấy Chuẩn Xuất Khẩu",
      visualSub: "Xoài • Mít • Thơm • Thanh Long sấy dẻo nhiệt thấp ~60°C"
    },
    corporateCards: {
      legalTitle: "Pháp Nhân & Mã Số Thuế",
      legalSub: "Mã số thuế: 1201611681 • Cấp phép hoạt động: 2019",
      hqTitle: "Trụ Sở & Nhà Máy Chế Biến",
      hqSub: "Quy mô nhà máy: 4.000 m² • Vùng trồng liên kết: Đồng Tháp, Tiền Giang, Vĩnh Long",
      contactTitle: "Liên Hệ Xuất Khẩu Trực Tiếp",
      contactSub: "Email: thaovinaxo@gmail.com • Web: vinaxo.net"
    },
    modal: {
      title: "Yêu cầu báo giá xuất khẩu / Hợp tác B2B",
      subtitle: "Kết nối trực tiếp với bộ phận kinh doanh & xuất nhập khẩu VINAXO để nhận tiêu chuẩn kỹ thuật, mẫu thử và bảng giá container.",
      nameLabel: "Họ và tên",
      namePlaceholder: "Ví dụ: Nguyễn Văn An",
      emailLabel: "Email doanh nghiệp",
      emailPlaceholder: "ten@doanhnghiep.com",
      phoneLabel: "Số điện thoại / Zalo / WhatsApp",
      phonePlaceholder: "0907 494 177",
      companyLabel: "Tên công ty & Quốc gia",
      companyPlaceholder: "Công ty Cổ phần Thực phẩm An Thịnh, Việt Nam",
      productLabel: "Sản phẩm quan tâm",
      productOptions: [
        "Chọn sản phẩm...",
        "Xoài sấy dẻo tự nhiên (OCOP 3 sao / Không thêm đường)",
        "Mít sấy dẻo & sấy chân không (OCOP 3 sao)",
        "Thanh long sấy dẻo (Ruột đỏ / Ruột trắng, OCOP 3 sao)",
        "Thơm (Dứa) sấy dẻo tự nhiên (Vùng Tân Phước)",
        "Trái cây sấy nhúng Sô-cô-la & Thanh năng lượng (Chuẩn EUDR)",
        "Toàn bộ danh mục / Gia công nhãn hàng riêng (OEM)"
      ],
      messageLabel: "Nhu cầu chi tiết, số lượng & Cảng đích",
      messagePlaceholder: "Vui lòng cho biết sản lượng dự kiến (tấn), quy cách đóng gói, cảng đến (FOB/CIF), chứng từ cần thiết...",
      submitBtn: "Gửi yêu cầu tới VINAXO",
      closeBtn: "Đóng",
      validating: "Đang kiểm tra thông tin...",
      successTitle: "Yêu cầu đã được gửi thành công!",
      successBody: "Cảm ơn quý đối tác đã liên hệ Công ty TNHH VINAXO. Bộ phận thương mại quốc tế sẽ xem xét yêu cầu và phản hồi qua email trong vòng 24 giờ làm việc.",
      productDetail: {
        specSheetTitle: "Bảng Thông Số Kỹ Thuật B2B & Chi Tiết Sản Phẩm",
        categoryLabel: "Phân loại:",
        originLabel: "Vùng nguyên liệu:",
        ingredientsLabel: "Thành phần:",
        processLabel: "Phương pháp chế biến:",
        moistureLabel: "Độ ẩm tiêu chuẩn:",
        shelfLifeLabel: "Hạn sử dụng:",
        packagingLabel: "Quy cách đóng gói xuất khẩu:",
        certificationsLabel: "Chứng nhận & Tiêu chuẩn:",
        requestQuoteBtn: "Yêu cầu báo giá sản phẩm này",
        closeBtn: "Đóng thông số sản phẩm"
      }
    },
    pageBanners: {
      about: {
        title: "Về Công Ty TNHH VINAXO",
        subtitle: "Doanh nghiệp chế biến và xuất khẩu trái cây sấy tự nhiên từ đồng bằng sông Cửu Long, nâng tầm nông sản Việt với tiêu chuẩn an toàn thực phẩm quốc tế.",
        home: "Trang chủ",
        current: "Về chúng tôi"
      },
      products: {
        title: "Danh Mục Sản Phẩm Trái Cây Sấy VINAXO",
        subtitle: "100% tự nhiên, sấy dẻo nhiệt thấp, không thêm đường, bảo toàn màu sắc và dưỡng chất tự nhiên từ các vùng chuyên canh ĐBSCL.",
        home: "Trang chủ",
        current: "Sản phẩm"
      },
      quality: {
        title: "Tiêu Chuẩn Chất Lượng & Quy Trình Chế Biến",
        subtitle: "Kiểm soát an toàn thực phẩm nghiêm ngặt từ vùng trồng đến thành phẩm xuất khẩu, đạt chứng nhận quốc tế BRCGS Grade B và chuỗi cung ứng BSCI.",
        home: "Trang chủ",
        current: "Chất lượng & Sản xuất"
      },
      markets: {
        title: "Mạng Lưới Thị Trường & Xuất Khẩu Toàn Cầu",
        subtitle: "Cung ứng nông sản trái cây sấy dẻo nhiệt đới tới các thị trường khó tính nhất: Hoa Kỳ (~70%), Liên minh Châu Âu (~20%), Hàn Quốc và Nga.",
        home: "Trang chủ",
        current: "Thị trường xuất khẩu"
      },
      news: {
        title: "Báo Chí Nói Về VINAXO & Hoạt Động Doanh Nghiệp",
        subtitle: "Tổng hợp các bài viết, phóng sự và trích dẫn từ các cơ quan báo chí chính thống về hoạt động chế biến, xuất khẩu nông sản của VINAXO.",
        home: "Trang chủ",
        current: "Báo chí & Tin tức"
      },
      contact: {
        title: "Liên Hệ & Kết Nối Hợp Tác B2B",
        subtitle: "Đội ngũ xuất nhập khẩu và kinh doanh VINAXO sẵn sàng phản hồi chi tiết về quy cách sản phẩm, mẫu thử và bảng giá đơn hàng container trong vòng 24 giờ.",
        home: "Trang chủ",
        current: "Liên hệ"
      }
    },
    contactPage: {
      directInquiryLabel: "GỬI YÊU CẦU TRỰC TIẾP",
      panelTitle: "Biểu Mẫu Báo Giá & Hợp Tác B2B",
      panelDesc: "Quý đối tác vui lòng điền các thông tin dưới đây. Yêu cầu của bạn sẽ được chuyển thẳng đến bộ phận kinh doanh và xuất nhập khẩu của VINAXO.",
      nameLabel: "Họ và tên *",
      namePlaceholder: "Ví dụ: Nguyễn Văn An",
      emailLabel: "Email doanh nghiệp *",
      emailPlaceholder: "ten@doanhnghiep.com",
      companyLabel: "Tên công ty & Quốc gia",
      companyPlaceholder: "Ví dụ: Công ty Cổ phần Thực phẩm An Thịnh, Việt Nam",
      phoneLabel: "Số điện thoại / Zalo / WhatsApp",
      phonePlaceholder: "0907 494 177",
      inquiryTypeLabel: "Mục đích liên hệ / Loại yêu cầu *",
      productLabel: "Sản phẩm quan tâm",
      subjectLabel: "Mục đích liên hệ / Tiêu đề *",
      subjectDefault: "Chọn mục đích liên hệ...",
      messageLabel: "Nội dung yêu cầu chi tiết *",
      messagePlaceholder: "Vui lòng cho biết sản lượng dự kiến (tấn), quy cách bao bì, cảng đến (FOB/CIF), chứng từ cần thiết...",
      submitBtn: "Gửi yêu cầu tới VINAXO",
      connectNote: "💡 <em>Kết nối thực tế:</em> Sau khi nhấn gửi, hệ thống sẽ mở ứng dụng email của bạn với tiêu đề và nội dung được tạo tự động để gửi trực tiếp tới <strong>thaovinaxo@gmail.com</strong>. Quý khách cũng có thể liên hệ trực tiếp qua Zalo/Hotline <strong>0907 494 177</strong> để nhận báo giá nhanh nhất.",
      cardLegalTitle: "Pháp Nhân & Trụ Sở Doanh Nghiệp",
      cardFacilityTitle: "Cơ Sở Sản Xuất & Vùng Chuyên Canh",
      cardHotlineTitle: "Đường Dây Nóng & Liên Hệ Trực Tiếp",
      cardExportTitle: "Kênh Xuất Khẩu & Hỗ Trợ Quốc Tế",
      cardMapTitle: "Bản Đồ Vị Trí Nhà Máy (Gò Công Tây, Tiền Giang)",
      cards: {
        legalName: "CÔNG TY TNHH VINAXO",
        taxLabel: "Mã số thuế:",
        taxVal: "1201611681 do Sở KH&ĐT Tiền Giang cấp",
        hqLabel: "Trụ sở:",
        hqVal: "Khu phố 5, Thị trấn Vĩnh Bình, Huyện Gò Công Tây, Tỉnh Tiền Giang, Việt Nam",
        repLabel: "Đại diện pháp luật:",
        repVal: "Ông Nguyễn Anh Khoa (Giám đốc)",
        areaLabel: "Quy mô nhà máy:",
        areaVal: "4.000 m² tại Huyện Gò Công Tây, Tiền Giang",
        capLabel: "Năng lực chế biến:",
        capVal: "1.000+ tấn trái cây tươi/tháng",
        hubLabel: "Vùng nguyên liệu Mekong:",
        hubVal: "Đồng Tháp (vùng xoài Cát Chu), Tiền Giang (thơm Tân Phước, thanh long Chợ Gạo), Vĩnh Long",
        hotlineLabel: "Hotline B2B:",
        emailLabel: "Email chính thức:",
        webLabel: "Website:",
        hoursLabel: "Giờ làm việc:",
        hoursVal: "Thứ Hai – Thứ Bảy: 07:30 – 17:00 (GMT+7)",
        supportLabel: "Hỗ trợ trực tuyến:",
        incotermsLabel: "Điều kiện thương mại:",
        incotermsVal: "CIF, FOB, CFR các cảng Cát Lái, Hiệp Phước, Cái Mép",
        sampleLabel: "Chính sách mẫu thử:",
        sampleVal: "Cung cấp mẫu miễn phí cho đối tác doanh nghiệp (chuyển phát nhanh DHL / FedEx)"
      },
      mapSectionLabel: "VỊ TRÍ ĐỊA LÝ",
      mapSectionTitle: "Nhà Máy Chế Biến VINAXO Tiền Giang",
      mapSectionDesc: "Vị trí thuận lợi tại trung tâm vùng nguyên liệu trái cây đồng bằng sông Cửu Long, kết nối nhanh chóng tới các cảng biển xuất khẩu quốc tế (Cát Lái, Hiệp Phước, Cái Mép).",
      mapCoords: "Tọa độ: 10.380295, 106.516139 • Thị trấn Vĩnh Bình, Huyện Gò Công Tây, Tiền Giang",
      mapDistance: "Cách TP. Hồ Chí Minh ~65 km • Thuận tiện vận chuyển container xuất khẩu đường bộ và đường thủy",
      openMapBtn: "Mở Google Maps",
      ctaLabel: "HỢP TÁC BỀN VỮNG",
      ctaTitle: "Đồng Hành Hợp Tác Bền Vững Cùng VINAXO",
      ctaDesc: "VINAXO luôn sẵn sàng chào đón các đối tác nhập khẩu quốc tế, chuỗi bán lẻ, nhà phân phối và doanh nghiệp gia công OEM. Cam kết cung ứng ổn định, chất lượng đồng nhất và đồng hành dài hạn.",
      ctaQuoteBtn: "Nhận Báo Giá Ngay",
      faqLabel: "HỎI ĐÁP B2B",
      faqTitle: "Câu Hỏi Thường Gặp Về Giao Thương B2B",
      faqDesc: "Giải đáp nhanh các thắc mắc về số lượng đặt hàng tối thiểu, mẫu thử và thủ tục thanh toán quốc tế.",
      faqQ1: "Số lượng đặt hàng tối thiểu (MOQ) là bao nhiêu?",
      faqA1: "Đối với đơn hàng xuất khẩu nhãn riêng (OEM), MOQ tiêu chuẩn là 1 tấn cho mỗi loại sản phẩm. Với đơn hàng đóng thùng master carton xuất khẩu nguyên liệu, MOQ linh hoạt từ 500 kg.",
      faqQ2: "Thời gian gửi mẫu thử (Sample) mất bao lâu?",
      faqA2: "VINAXO cung cấp mẫu thử miễn phí cho đối tác doanh nghiệp. Mẫu được đóng gói và chuyển phát nhanh quốc tế qua DHL/FedEx, thông thường tới tay đối tác trong vòng 3 – 5 ngày làm việc.",
      faqQ3: "Điều khoản thanh toán quốc tế áp dụng là gì?",
      faqA3: "VINAXO chấp nhận các phương thức thanh toán thương mại quốc tế thông dụng bao gồm T/T (Telegraphic Transfer) và L/C không hủy ngang mở tại ngân hàng uy tín hàng đầu.",
      selectOptions: {
        inquiryTypes: [
          { value: "", label: "Chọn mục đích liên hệ..." },
          { value: "Báo giá đơn hàng xuất khẩu container (FCL/LCL)", label: "Báo giá đơn hàng xuất khẩu container (FCL/LCL)" },
          { value: "Gia công nhãn riêng Private Label / OEM", label: "Gia công nhãn riêng Private Label / OEM" },
          { value: "Thông tin sản phẩm & Thông số kỹ thuật", label: "Thông tin sản phẩm & Thông số kỹ thuật" },
          { value: "Yêu cầu gửi mẫu thử sản phẩm", label: "Yêu cầu gửi mẫu thử sản phẩm" },
          { value: "Hợp tác đại lý phân phối trong nước & quốc tế", label: "Hợp tác đại lý phân phối trong nước & quốc tế" },
          { value: "Liên hệ chung / Hợp tác cung ứng nông sản", label: "Liên hệ chung / Hợp tác cung ứng nông sản" }
        ],
        products: [
          { value: "Tất cả sản phẩm / Chưa xác định", label: "Tất cả sản phẩm / Chưa xác định" },
          { value: "Xoài sấy dẻo tự nhiên (OCOP 3 sao / Không thêm đường)", label: "Xoài sấy dẻo tự nhiên" },
          { value: "Mít sấy dẻo & sấy chân không (OCOP 3 sao)", label: "Mít sấy dẻo & sấy chân không" },
          { value: "Thanh long sấy dẻo (Ruột đỏ / Ruột trắng, OCOP 3 sao)", label: "Thanh long sấy dẻo" },
          { value: "Thơm (Dứa) sấy dẻo tự nhiên (Vùng Tân Phước)", label: "Thơm (Dứa) sấy dẻo tự nhiên" },
          { value: "Trái cây sấy nhúng Sô-cô-la & Thanh năng lượng", label: "Trái cây bọc sô-cô-la & Thanh năng lượng" },
          { value: "Toàn bộ danh mục / Gia công nhãn hàng riêng (OEM)", label: "Gia công theo quy cách riêng (OEM)" }
        ]
      }
    },
    mapLabels: {
      usa: "Hoa Kỳ (~70%)",
      eu: "Châu Âu (~20%)",
      russia: "NGA & ĐÔNG ÂU",
      korea: "HÀN QUỐC & ĐÔNG Á",
      vietnam: "VINAXO (TIỀN GIANG)"
    },
    productFilterTabs: {
      all: "Tất cả sản phẩm",
      mango: "Xoài sấy dẻo",
      jackfruit: "Mít sấy dẻo",
      dragon: "Thanh long sấy",
      pineapple: "Thơm sấy",
      banana: "Chuối sấy",
      "energy-bar": "Thanh hoa quả & Socola",
      energyBar: "Thanh hoa quả & Socola",
      ocop: "★ OCOP 3 Sao Tiền Giang"
    },
    marketsPage: {
      section1: {
        label: "HÀNH TRÌNH TOÀN CẦU",
        title: "Hành Trình Đưa Nông Sản Việt Chinh Phục Thị Trường Toàn Cầu",
        desc: "Nhờ năng lực chế biến công nghệ cao và hệ thống kiểm soát an toàn thực phẩm chuẩn BRCGS Grade B, VINAXO đã thiết lập chuỗi cung ứng vững chắc sang các thị trường đòi hỏi khắt khe nhất về an toàn vệ sinh và trách nhiệm xã hội."
      },
      pillars: {
        usa: {
          badge: "Thị Trường Trọng Điểm (~70%)",
          title: "Hoa Kỳ",
          desc: "Thị trường tiêu thụ lớn nhất của VINAXO, chiếm khoảng 70% tổng sản lượng xuất khẩu. Các dòng xoài sấy dẻo không thêm đường và hoa quả nhiệt đới được phân phối thông qua các nhà nhập khẩu bán sỉ và chuỗi bán lẻ kiều bào cũng như thị trường bản địa.",
          source: "Nguồn: Báo Người Lao Động (02/03/2025) - Trích lời GĐKD Hoàng Mạnh Cường"
        },
        eu: {
          badge: "Thị Trường Tiêu Chuẩn Cao (~20%)",
          title: "Liên Minh Châu Âu",
          desc: "Chiếm khoảng 20% kim ngạch xuất khẩu, tập trung tại các thị trường Bắc và Tây Âu (Đức, Phần Lan). VINAXO đáp ứng nghiêm ngặt các quy định về an sinh xã hội BSCI, kiểm soát dư lượng hóa chất và định hướng chuỗi cung ứng không gây mất rừng (EUDR).",
          source: "Nguồn: Báo Người Lao Động (02/03/2025)"
        },
        russia: {
          badge: "Thị Trường Truyền Thống",
          title: "Nga & Cộng Đồng CIS",
          desc: "Thị trường có nhu cầu ổn định và tăng trưởng tốt đối với các dòng trái cây nhiệt đới sấy dẻo chất lượng cao (xoài, mít, thơm). Mối quan hệ thương mại lâu năm giúp duy trì các đơn hàng container thường kỳ.",
          source: "Nguồn: Hồ sơ giao thương doanh nghiệp VINAXO"
        },
        eastAsia: {
          badge: "Thị Trường Tiềm Năng",
          title: "Hàn Quốc & Đông Á",
          desc: "Người tiêu dùng Đông Á đặc biệt ưa chuộng xoài sấy dẻo và thanh long sấy ruột đỏ tự nhiên như một món ăn vặt lành mạnh, giàu dinh dưỡng và làm quà tặng đặc sản cao cấp.",
          source: "Nguồn: Báo CafeF & Báo Đồng Tháp (2025)"
        }
      },
      section2: {
        label: "HẠ TẦNG LOGISTICS",
        title: "Bản Đồ Tuyến Vận Tải & Hạ Tầng Cảng Xuất Khẩu",
        desc: "Nhà máy VINAXO tại Tiền Giang sở hữu vị trí địa lý đắc địa, kết nối thuận tiện qua hệ thống cao tốc ĐBSCL tới các cụm cảng nước sâu quốc tế lớn nhất miền Nam Việt Nam.",
        portsTitle: "Cảng Xuất Khẩu Trọng Điểm",
        portsDesc: "Cảng Cát Lái, Hiệp Phước & Cảng Quốc Tế Cái Mép",
        specTitle: "Thời Gian Vận Chuyển",
        specDesc: "~2 giờ từ nhà máy đến cảng biển",
        airTitle: "Vận Tải Hàng Không Hỏa Tốc",
        airDesc: "Sân bay Tân Sơn Nhất (SGN) chuyển phát mẫu nhanh",
        containerTitle: "Quy Cách Container",
        containerDesc: "20ft FCL: 12 – 14 tấn • 40ft FCL: 24 – 26 tấn"
      },
      section3: {
        label: "QUY TRÌNH HỢP TÁC",
        title: "Quy Trình Hợp Tác Giao Thương Quốc Tế",
        desc: "Hợp tác nhanh chóng, minh bạch và chuyên nghiệp với đội ngũ chuyên trách xuất nhập khẩu của VINAXO.",
        step1Num: "Bước 1",
        step1Title: "Tư Vấn & Gửi Mẫu Thử",
        step1Desc: "Thảo luận nhu cầu chủng loại, gửi mẫu thử sản phẩm (sample courier qua DHL/FedEx) và chào giá FOB/CIF chi tiết theo số lượng dự kiến.",
        step2Num: "Bước 2",
        step2Title: "Ký Hợp Đồng & Thiết Kế OEM",
        step2Desc: "Thống nhất quy cách bao bì, market nhãn mác (nếu làm Private Label), thời hạn giao hàng và điều khoản thanh toán quốc tế (L/C, T/T).",
        step3Num: "Bước 3",
        step3Title: "Sản Xuất, Kiểm Nghiệm & Xuất Cảng",
        step3Desc: "Chế biến theo lô, cấp COA kiểm nghiệm vi sinh - hóa lý, hoàn tất thủ tục hải quan xuất khẩu và gửi bộ chứng từ B/L đầy đủ cho người mua."
      },
      section4: {
        label: "KẾT NỐI XUẤT NHẬP KHẨU",
        title: "Kết Nối Với Phòng Kinh Doanh Quốc Tế VINAXO",
        desc: "Chúng tôi luôn sẵn sàng hỗ trợ quý nhà nhập khẩu, nhà phân phối sỉ toàn cầu về các điều kiện giao hàng, bảng giá FCL ưu đãi và kế hoạch đóng gói xuất khẩu theo mùa vụ.",
        btnPrimary: "Nhận Báo Giá Container",
        btnSecondary: "Liên Hệ Phòng Xuất Khẩu"
      }
    },
    productsPage: {
      section1: {
        label: "NÔNG SẢN SẤY CAO CẤP",
        title: "Nông Sản Nhiệt Đới Chọn Lọc Từ Vùng Trồng Đạt Chuẩn",
        desc: "Mỗi mẻ trái cây sấy VINAXO đều trải qua quy trình phân loại nghiêm ngặt từ những vựa trái cây danh tiếng nhất Đồng bằng sông Cửu Long (Đồng Tháp, Tiền Giang, Vĩnh Long). Tỷ lệ thu hồi 10:1 (10 kg trái cây tươi qua sơ chế và sấy nhiệt thấp cho ra 1 kg thành phẩm sấy dẻo) tạo nên kết cấu dẻo mềm đặc trưng, thơm tự nhiên và giàu dưỡng chất."
      },
      section2: {
        label: "HỢP TÁC B2B & GIA CÔNG OEM",
        title: "Gia Công OEM & Đóng Gói Xuất Khẩu Theo Yêu Cầu",
        desc: "VINAXO là đối tác sản xuất gia công uy tín cho các tập đoàn bán lẻ, chuỗi siêu thị và thương hiệu thực phẩm quốc tế tại Hoa Kỳ, Châu Âu và Hàn Quốc. Chúng tôi cung ứng giải pháp trọn gói từ R&D công thức đến đóng gói thành phẩm.",
        card1Title: "Tùy Biến Độ Dẻo & Cắt Lát",
        card1Desc: "Điều chỉnh độ ẩm thành phẩm từ 12% đến 18% theo yêu cầu thị hiếu từng thị trường. Quy cách cắt lát mỏng (slices), con chì (strips), xúc xắc (dices) hoặc nguyên miếng tự nhiên.",
        card2Title: "Đóng Gói Bán Lẻ & Bao Bì Thùng Lớn",
        card2Desc: "Hỗ trợ in ấn bao bì nhãn riêng (Private Label) theo thương hiệu khách hàng dạng túi zipper 50g, 100g, 250g, 500g nạp khí Nitơ hoặc thùng master carton 5kg - 10kg cho nhà máy đóng gói lại.",
        card3Title: "Hồ Sơ An Toàn & Kiểm Nghiệm Đầy Đủ",
        card3Desc: "Cung cấp Certificate of Analysis (COA) cho từng lô hàng xuất khẩu, kiểm nghiệm vi sinh, kim loại nặng, dư lượng thuốc BVTV đạt tiêu chuẩn nghiêm ngặt của FDA Hoa Kỳ và EFSA Châu Âu."
      },
      section3: {
        label: "THÔNG SỐ KỸ THUẬT B2B",
        title: "Bảng Thông Số Kỹ Thuật Tiêu Chuẩn Xuất Khẩu",
        desc: "Toàn bộ sản phẩm được kiểm soát chất lượng từ khâu nguyên liệu tươi đến quy trình đóng gói màng ngăn ẩm chuyên dụng.",
        colName: "Tên Sản Phẩm",
        colOrigin: "Vùng Nguyên Liệu",
        colMoisture: "Độ Ẩm",
        colShelfLife: "Hạn Sử Dụng",
        colCert: "Chứng Nhận",
        colQuote: "Báo Giá",
        row1Name: "Xoài Sấy Dẻo Tự Nhiên",
        row1Origin: "Đồng Tháp & Tiền Giang",
        row2Name: "Mít Sấy Dẻo & Chiên Chân Không",
        row2Origin: "Tiền Giang & Vĩnh Long",
        row3Name: "Thanh Long Sấy Dẻo",
        row3Origin: "Chợ Gạo, Tiền Giang",
        row4Name: "Thơm (Khóm) Sấy Dẻo",
        row4Origin: "Tân Phước, Tiền Giang",
        row5Name: "Chuối Sấy Dẻo",
        row5Origin: "Đồng Bằng Sông Cửu Long",
        row6Name: "Thanh Hoa Quả Năng Lượng Nhúng Socola",
        row6Origin: "Vùng Chuyên Canh ĐBSCL",
        months12: "12 Tháng",
        quoteBtn: "Nhận Báo Giá",
        certOcop: "OCOP 3 Sao",
        certBrcgs: "Nhà máy chuẩn BRCGS",
        certNatural: "100% Thuần Tự Nhiên",
        certEudr: "Chuẩn EUDR"
      },
      section4: {
        label: "HỢP TÁC B2B & GIA CÔNG OEM",
        title: "Yêu Cầu Mẫu Thử & Báo Giá Container",
        desc: "Quý đối tác thương mại, nhà nhập khẩu quốc tế và nhà phân phối có thể liên hệ trực tiếp để nhận catalogue mẫu thực tế cùng bảng giá FOB/CIF ưu đãi.",
        btnPrimary: "Yêu Cầu Báo Giá Nhanh",
        btnSecondary: "Liên Hệ Phòng Xuất Khẩu"
      }
    },
    qualityPage: {
      section1: {
        label: "QUY TRÌNH SẢN XUẤT",
        title: "Quy Trình Chế Biến 6 Bước Khép Kín Chuẩn BRCGS",
        desc: "Nhà máy VINAXO vận hành theo quy trình kiểm soát mối nguy nghiêm ngặt, loại bỏ hoàn toàn việc sử dụng đường tinh luyện hay phụ gia tẩy trắng hóa học, giữ trọn vẹn màu sắc, cấu trúc xơ và hàm lượng vitamin tự nhiên.",
        step1Title: "Tuyển Chọn Vùng Trồng & Kiểm Định Đầu Vào",
        step1Desc: "Thu hoạch từ các hợp tác xã liên kết tại Đồng Tháp, Tiền Giang, Vĩnh Long. Đo độ đường Brix tự nhiên, kiểm tra cảm quan độ chín đồng đều và xét nghiệm dư lượng thuốc BVTV trước khi nhập kho.",
        step2Title: "Sơ Chế, Gọt Vỏ & Rửa Khử Trùng Ozone",
        step2Desc: "Hệ thống rửa đa cấp kết hợp sục khí Ozone diệt khuẩn bề mặt. Công nhân trong trang phục bảo hộ phòng sạch gọt vỏ, bỏ hạt và cắt lát định hình với kích thước đồng nhất.",
        step3Title: "Xử Lý Nhiệt Thấp & Ủ Hương Tự Nhiên",
        step3Desc: "Giai đoạn tiền xử lý nhiệt nhẹ nhằm bất hoạt enzyme gây biến đổi màu sắc mà tuyệt đối không dùng chất bảo quản lưu huỳnh (SO2) hay đường tinh luyện nhân tạo.",
        step4Title: "Sấy Dẻo Nhiệt Thấp (~60°C) & Chiên Chân Không",
        step4Desc: "Hệ thống buồng sấy nhiệt thấp đối lưu tuần hoàn giúp thoát hơi ẩm từ từ, giữ nguyên vẹn cấu trúc dẻo mềm, chất xơ và vitamin C. Đối với dòng giòn, áp dụng chiên sấy chân không nhiệt độ thấp.",
        step5Title: "Ly Tâm Tách Dầu & Làm Nguội Phòng Sạch",
        step5Desc: "Sản phẩm chiên chân không được đưa qua máy ly tâm công suất lớn để tách triệt để dầu thừa, đảm bảo độ giòn rụm thanh nhẹ, hàm lượng chất béo cực thấp theo tiêu chuẩn snack lành mạnh.",
        step6Title: "Dò Kim Loại, Đóng Gói Chân Không & Mã Hóa Lô Hàng",
        step6Desc: "100% mẻ sản phẩm đi qua máy dò kim loại tự động. Đóng gói túi zipper tráng màng nhôm đa lớp hoặc nạp khí Nitơ chống oxy hóa. In mã vạch truy xuất nguồn gốc từng nông hộ."
      },
      section2: {
        label: "HẠ TẦNG VÀ CÔNG SUẤT",
        title: "Nhà Máy Chế Biến 4.000 m² Hiện Đại Tại Tiền Giang",
        desc: "Tọa lạc tại Thị trấn Vĩnh Bình, Huyện Gò Công Tây, Tỉnh Tiền Giang, nhà máy VINAXO được xây dựng với số vốn đầu tư giai đoạn đầu 15 tỷ VNĐ, được thiết kế chuyên biệt đáp ứng tiêu chuẩn vệ sinh an toàn thực phẩm xuất khẩu.",
        stat1Val: "1.000+ Tấn",
        stat1Label: "Trái cây tươi thu mua/tháng",
        stat2Val: "70 - 120 Tấn",
        stat2Label: "Thành phẩm sấy dẻo/tháng",
        stat3Val: "Tỷ Lệ 10:1",
        stat3Label: "10 kg quả tươi cho 1 kg sấy dẻo",
        stat4Val: "BRCGS Grade B",
        stat4Label: "Chuẩn an toàn thực phẩm toàn cầu",
        sourceNote: "* Nguồn dữ liệu xác thực: Báo Người Lao Động (02/03/2025) và Báo Đồng Tháp (19/09/2025).",
        imgAlt: "Vùng nguyên liệu nông sản và nhà máy VINAXO Tiền Giang"
      },
      section3: {
        label: "HỆ THỐNG TIÊU CHUẨN",
        title: "Hệ Thống Chứng Nhận Chất Lượng Đã Được Xác Minh",
        desc: "VINAXO cam kết tính minh bạch tuyệt đối trong mọi công bố chất lượng. Toàn bộ chứng nhận dưới đây đã được đối chiếu hồ sơ thực tế và cơ quan chức năng công nhận.",
        brcgsBadge: "ĐÃ XÁC MINH",
        brcgsTitle: "BRCGS Food Safety",
        brcgsSub: "Grade B Benchmark",
        brcgsDesc: "Tiêu chuẩn an toàn thực phẩm toàn cầu do Hiệp hội Bán lẻ Anh Quốc ban hành, là 'giấy thông hành' bắt buộc để xuất khẩu vào các chuỗi siêu thị lớn tại Hoa Kỳ và Châu Âu.",
        ocopBadge: "ĐÃ XÁC MINH • OCOP 3 SAO",
        ocopTitle: "OCOP 3 Sao Tiền Giang",
        ocopSub: "UBND Tỉnh Chứng Nhận",
        ocopDesc: "Công nhận chất lượng nông sản tiêu biểu tỉnh Tiền Giang cho 3 dòng sản phẩm chủ lực: Xoài sấy dẻo, Mít sấy dẻo và Thanh long sấy dẻo.",
        bsciBadge: "ĐANG ÁP DỤNG",
        bsciTitle: "BSCI & Chuỗi Xanh ESG",
        bsciSub: "Tuân Thủ Xã Hội & Môi Trường",
        bsciDesc: "Thực thi trách nhiệm xã hội trong chuỗi cung ứng, điều kiện làm việc công bằng, tiền lương thỏa đáng và cam kết không phá rừng (EUDR) phục vụ khách hàng Bắc Âu.",
        cleanBadge: "TIÊU CHUẨN THUẦN TỰ NHIÊN",
        cleanTitle: "100% Clean Label",
        cleanSub: "Không Phụ Gia Hóa Học",
        cleanDesc: "Cam kết không sử dụng đường tinh luyện nhân tạo, không chất tạo màu tổng hợp, không chất bảo quản hóa học. Giữ nguyên vị ngọt thanh tự nhiên của trái cây chín cây.",
        transparencyTitle: "Ghi Chú Minh Bạch Về Chứng Nhận:",
        transparencyText: "VINAXO tuân thủ nghiêm ngặt nguyên tắc chỉ công bố chứng nhận đã được kiểm chứng thực tế. Các chứng nhận chung như FDA, ISO 22000, HACCP hiện đang trong giai đoạn rà soát và lưu trữ hồ sơ hành chính, phục vụ các hợp đồng thương mại song phương theo yêu cầu cụ thể của từng đối tác nhập khẩu."
      },
      section4: {
        title: "Tham Quan Nhà Máy Hoặc Nhận Hồ Sơ Kiểm Nghiệm",
        desc: "VINAXO trân trọng kính mời các đoàn thanh tra, đối tác thương mại và đại diện chuỗi siêu thị đăng ký lịch tham quan trực tiếp cơ sở chế biến hoặc yêu cầu trọn bộ hồ sơ kiểm định chất lượng.",
        btnPrimary: "Yêu Cầu Hồ Sơ Kiểm Định",
        btnSecondary: "Liên Hệ Bộ Phận Quản Lý Chất Lượng"
      }
    },
    aboutPage: {
      metrics: {
        m1Num: "4.000 m²",
        m1Label: "Quy mô nhà máy sản xuất",
        m1Note: "Khuôn viên nhà máy tại Gò Công Tây, Tiền Giang (Vốn đầu tư 15 tỷ đồng)",
        m1Source: "Nguồn: Báo Nông nghiệp & Môi trường",
        m2Num: "1.000+ Tấn",
        m2Label: "Năng lực thu mua nguyên liệu tươi",
        m2Note: "Thu mua nguyên liệu mùa vụ tại Đồng Tháp, Tiền Giang, Vĩnh Long",
        m2Source: "Nguồn: Báo Đồng Tháp",
        m3Num: "70 - 120 Tấn",
        m3Label: "Sản lượng thành phẩm / tháng",
        m3Note: "Tỷ lệ chế biến 10kg quả tươi ra 1kg sấy dẻo phục vụ xuất khẩu",
        m3Source: "Nguồn: Báo Người Lao Động",
        m4Num: "~70% USA",
        m4Label: "Thị phần xuất khẩu Mỹ",
        m4Note: "Thị trường xuất khẩu chủ lực (cùng ~20% sản lượng sang Châu Âu)",
        m4Source: "Nguồn: Báo Người Lao Động"
      },
      timeline: {
        label: "HÀNH TRÌNH PHÁT TRIỂN",
        title: "Các cột mốc xây dựng & Nâng tầm nông sản",
        desc: "Từ dự án khởi nghiệp tại đồng bằng sông Cửu Long đến thương hiệu trái cây sấy dẻo tự nhiên khẳng định vị thế trên kệ hàng quốc tế.",
        y2018Badge: "Năm 2018",
        y2018Title: "Khởi Nghiệp Sấy Nông Sản",
        y2018Desc: "Ý tưởng khởi nghiệp của chị Hoàng Thị Thu Thảo và anh Nguyễn Anh Khoa bắt đầu từ trăn trở giải quyết đầu ra cho trái cây miền Tây mùa thu hoạch rộ, thử nghiệm công nghệ sấy nhiệt thấp giữ nguyên hương vị quả tươi.",
        y2019Badge: "Năm 2019",
        y2019Title: "Thành Lập Pháp Nhân VINAXO",
        y2019Desc: "Chính thức đăng ký CÔNG TY TNHH VINAXO (Mã số thuế: 1201611681), xây dựng cơ sở chế biến ban đầu tại Thị trấn Vĩnh Bình, Huyện Gò Công Tây, Tỉnh Tiền Giang.",
        y2021Badge: "Năm 2021",
        y2021Title: "Đầu Tư Nhà Máy 15 Tỷ Đồng",
        y2021Desc: "Mở rộng khuôn viên sản xuất 4.000 m², trang bị 6 buồng sấy công nghiệp hiện đại cùng hệ thống kho lạnh trữ quả tươi, nâng năng lực chế biến hàng chục tấn trái cây tươi mỗi ngày.",
        y2023Badge: "Năm 2023",
        y2023Title: "Chuẩn Quốc Tế BRCGS & Xuất Khẩu Mỹ",
        y2023Desc: "Đạt chứng nhận an toàn thực phẩm toàn cầu BRCGS Food Safety Hạng B; mở rộng xuất khẩu mạnh sang thị trường Hoa Kỳ (chiếm ~70% cơ cấu) và Liên minh Châu Âu (~20%).",
        y2024Badge: "Năm 2024",
        y2024Title: "Vinh Danh Nông Dân - Doanh Nhân & OCOP",
        y2024Desc: "Giám đốc Nguyễn Anh Khoa nhận Bằng khen Doanh nhân - Nông dân tiêu biểu của UBND tỉnh Tiền Giang; Chị Hoàng Thị Thu Thảo đạt Giải Nhì Cuộc thi Khởi nghiệp đổi mới sáng tạo; sản phẩm sấy đạt chuẩn OCOP 3 sao.",
        presentBadge: "Hiện Nay",
        presentTitle: "Mở Rộng Chuỗi Cung Ứng B2B Toàn Cầu",
        presentDesc: "Chủ động liên kết bao tiêu hơn 1.000 tấn xoài Đồng Tháp, khóm Tân Phước, thanh long Chợ Gạo, đẩy mạnh gia công OEM cho các chuỗi siêu thị lớn và sàn thương mại nông sản số."
      },
      infrastructure: {
        label: "CƠ SỞ HẠ TẦNG VÀ CÔNG NGHỆ",
        title: "Nhà máy 4.000 m² tại Tiền Giang",
        desc: "Tọa lạc tại Khu phố 5, Thị trấn Vĩnh Bình, Huyện Gò Công Tây, cơ sở sản xuất của VINAXO được quy hoạch đồng bộ theo tiêu chuẩn an toàn thực phẩm quốc tế.",
        feature1Title: "Hệ thống 6 buồng sấy nhiệt thấp (~60°C)",
        feature1Desc: "Kiểm soát độ ẩm nghiêm ngặt, giữ trọn sắc vàng óng tự nhiên của quả tươi, không cần phẩm màu hay đường nhân tạo.",
        feature2Title: "Kho lạnh dự trữ nguyên liệu mùa vụ",
        feature2Desc: "Năng lực trữ nguyên liệu quả tươi mùa thu hoạch rộ để duy trì hoạt động chế biến liên tục đến tận tháng 10 hàng năm, ổn định đơn hàng xuất khẩu.",
        feature3Title: "Dây chuyền chiên chân không tách dầu ly tâm",
        feature3Desc: "Phục vụ các dòng mít sấy giòn xốp tự nhiên, giảm thiểu hàm lượng dầu tối đa, bảo vệ sức khỏe người dùng."
      },
      sourcing: {
        label: "VÙNG NGUYÊN LIỆU ĐBSCL",
        title: "Liên kết nông dân & Chuỗi cung ứng sạch",
        desc: "VINAXO gắn bó chặt chẽ với những vùng chuyên canh cây ăn trái trù phú bậc nhất miền Tây Nam Bộ, tạo sinh kế bền vững cho hàng trăm hộ nông dân.",
        row1Label: "Vựa xoài Đồng Tháp (Cát Chu & Hòa Lộc):",
        row1Val: "Thu mua mùa vụ hơn 1.000 tấn",
        row2Label: "Thủ phủ khóm Tân Phước, Tiền Giang:",
        row2Val: "Cung ứng khóm Queen vị ngọt thanh",
        row3Label: "Vùng thanh long Chợ Gạo, Tiền Giang:",
        row3Val: "Thanh long ruột đỏ giàu betalain",
        row4Label: "Vựa mít Tiền Giang & Hậu Giang:",
        row4Val: "Mít Thái chín cây múi dày thơm ngọt"
      },
      gallery: {
        label: "HÌNH ẢNH THỰC TẾ DOANH NGHIỆP",
        title: "Cơ Sở Chế Biến, Dây Chuyền & Vùng Trồng VINAXO",
        desc: "Hình ảnh ghi nhận thực tế từ nhà máy tại TT. Vĩnh Bình, H. Gò Công Tây, Tiền Giang và các vùng chuyên canh nông sản ĐBSCL.",
        card1Tag: "NHÀ MÁY 4.000 M²",
        card1Title: "Khuôn viên phòng sạch & Buồng sấy nhiệt thấp",
        card1Desc: "Hệ thống 6 buồng sấy nhiệt thấp (~60°C) và kho lạnh dự trữ tại TT. Vĩnh Bình, Tiền Giang, vốn đầu tư giai đoạn đầu 15 tỷ VNĐ.",
        card2Tag: "KIỂM ĐỊNH & ĐÓNG GÓI",
        card2Title: "Dây chuyền dò kim loại & Đóng gói màng ngăn ẩm",
        card2Desc: "Quy trình rà soát kim loại tự động 100% mẻ thành phẩm, đóng túi tráng nhôm nạp khí Nitơ hoặc thùng master carton cho container B2B.",
        card3Tag: "VÙNG NGUYÊN LIỆU ĐBSCL",
        card3Title: "Thu mua bao tiêu xoài & Trái cây mùa vụ",
        card3Desc: "Chủ động thu mua hơn 1.000 tấn xoài Đồng Tháp, khóm Tân Phước, thanh long Chợ Gạo, tạo sinh kế bền vững cho hàng trăm nông hộ."
      },
      process: {
        label: "QUY TRÌNH SẢN XUẤT",
        title: "Quy Trình Chế Biến 6 Bước Khép Kín Chuẩn BRCGS",
        desc: "Từ quả tươi chín cây miệt vườn đến thành phẩm sấy dẻo hảo hạng đạt chuẩn xuất khẩu Hoa Kỳ và Châu Âu.",
        step1Title: "Tuyển Chọn & Đo Độ Brix Đầu Vào",
        step1Desc: "Trái cây tươi thu hoạch từ các hợp tác xã liên kết tại Đồng Tháp, Tiền Giang, Vĩnh Long. Đo độ đường Brix tự nhiên, sàng lọc độ chín đồng đều trước khi nhập kho.",
        step2Title: "Rửa Khử Trùng Ozone & Sơ Chế Phòng Sạch",
        step2Desc: "Hệ thống sục khí Ozone diệt khuẩn vỏ ngoài. Công nhân trang phục bảo hộ phòng sạch gọt vỏ, bỏ hạt và định hình từng lát cắt với kích thước đồng nhất.",
        step3Title: "Tiền Xử Lý Nhiệt Thấp & Ủ Hương Tự Nhiên",
        step3Desc: "Bất hoạt enzyme gây biến đổi màu sắc hoàn toàn tự nhiên, không sử dụng chất tẩy trắng lưu huỳnh (SO2) hay tẩm ướp đường tinh luyện hóa học.",
        step4Title: "Sấy Dẻo Nhiệt Thấp (~60°C) & Chiên Chân Không",
        step4Desc: "Hệ thống 6 buồng sấy nhiệt thấp đối lưu tuần hoàn thoát hơi ẩm từ từ, giữ màu vàng óng, cấu trúc dẻo mềm và vitamin A, C tự nhiên.",
        step5Title: "Ly Tâm Tách Dầu & Làm Nguội Phòng Sạch",
        step5Desc: "Đối với dòng mít sấy, sản phẩm được đưa qua máy ly tâm công suất lớn để tách triệt để dầu thừa, đảm bảo hàm lượng chất béo cực thấp theo chuẩn snack sạch.",
        step6Title: "Dò Kim Loại, Đóng Gói Chân Không & Mã Hóa Lô Hàng",
        step6Desc: "100% mẻ thành phẩm đi qua máy dò kim loại tự động. Đóng gói túi zipper tráng nhôm nạp khí Nitơ hoặc thùng master carton xuất khẩu kèm mã vạch truy xuất.",
        btnQuality: "Xem chi tiết hệ thống quản lý chất lượng"
      },
      certificationsSection: {
        label: "CHỨNG NHẬN & TIÊU CHUẨN XUẤT KHẨU",
        title: "Cam Kết Minh Bạch Về Chất Lượng Quốc Tế",
        desc: "VINAXO tuyệt đối tuân thủ nguyên tắc trung thực trong mọi công bố tiêu chuẩn, được cơ quan quản lý và các tổ chức kiểm định quốc tế xác nhận."
      }
    },
    leadership: {
      label: "BAN LÃNH ĐẠO VINAXO",
      title: "Người kiến tạo giá trị nông sản Việt",
      subtitle: "Đội ngũ sáng lập và điều hành giàu nhiệt huyết, tận tâm vì chất lượng nông sản địa phương và uy tín thương hiệu trên trường quốc tế.",
      khoa: {
        role: "Giám đốc điều hành & Đại diện pháp luật",
        desc: "Doanh nhân - Nông dân tiêu biểu tỉnh Tiền Giang năm 2024. Phụ trách định hướng chiến lược đầu tư công nghệ, mở rộng xưởng 4.000 m² và vận hành chuỗi bao tiêu nông sản miền Tây.",
        stamp: "Xác minh: Báo Đồng Tháp"
      },
      thao: {
        role: "Đồng sáng lập & Phó Giám đốc",
        desc: "Người sáng lập Dự án Trái cây sấy VINAXO, đạt Giải Nhì Cuộc thi Khởi nghiệp đổi mới sáng tạo tỉnh Tiền Giang. Trực tiếp điều hành quy trình R&D và kiểm định chất lượng sản phẩm chuẩn OCOP 3 sao.",
        stamp: "Xác minh: Báo Đồng Tháp"
      },
      cuong: {
        role: "Giám đốc Thương mại & Phát triển Kinh doanh",
        desc: "Đại diện thương mại phụ trách các thị trường xuất khẩu trọng điểm Hoa Kỳ, Châu Âu và Nga; người phát ngôn trên các cơ quan báo chí kinh tế Người Lao Động, CafeF, 24H về chuỗi xuất khẩu nông sản xanh.",
        stamp: "Xác minh: CafeF & NLĐ"
      }
    },
    newsPage: {
      mediaCard: {
        label: "DÀNH CHO BÁO CHÍ",
        title: "Liên Hệ Dành Cho Báo Chí & Truyền Thông",
        desc: "Bộ phận Đối ngoại & Truyền thông VINAXO sẵn sàng cung cấp hình ảnh chất lượng cao, tài liệu giới thiệu công ty (Media Kit), số liệu vùng trồng và sắp xếp lịch phỏng vấn với Ban Lãnh đạo cho các phóng viên, nhà báo và cơ quan truyền thông kinh tế - nông nghiệp.",
        btnInterview: "Gửi Yêu Cầu Phỏng Vấn",
        btnContact: "Xem Thông Tin Liên Hệ",
        boxTitle: "Đầu Mối Phát Ngôn Chính Thức",
        spokespersonLabel: "Người đại diện:",
        spokespersonVal: "Ông Hoàng Mạnh Cường (Giám đốc kinh doanh) / Bà Hoàng Thị Thu Thảo (Phó Giám đốc)",
        emailLabel: "Email:",
        hotlineLabel: "Hotline:",
        copyrightNote: "* Lưu ý bản quyền: Mọi thông tin, bài viết trích dẫn từ các cơ quan báo chí đều giữ nguyên bản quyền của tòa soạn gốc. Nút 'Đọc bài báo gốc' sẽ dẫn người đọc tới đúng trang tin chính thống."
      }
    },
    modal: {
      productDetail: {
        specSheetTitle: "Thông Số Kỹ Thuật B2B",
        originLabel: "Vùng nguyên liệu:",
        ingredientsLabel: "Thành phần:",
        processLabel: "Phương pháp chế biến:",
        moistureLabel: "Độ ẩm tiêu chuẩn:",
        shelfLifeLabel: "Hạn sử dụng:",
        storageLabel: "Bảo quản:",
        packagingLabel: "Quy cách đóng gói:",
        certificationsLabel: "Tiêu chuẩn & Chứng nhận:",
        requestQuoteBtn: "Yêu cầu báo giá sản phẩm này",
        closeBtn: "Đóng"
      }
    },
    footer: {
      tagline: "Hương Vị Tự Nhiên | Vươn Tầm Quốc Tế",
      companyName: "CÔNG TY TNHH VINAXO",
      companyBio: "Công ty TNHH VINAXO hoạt động trong lĩnh vực chế biến trái cây sấy và nông sản Việt Nam, cung cấp sản phẩm cho thị trường trong nước và quốc tế, hướng đến chất lượng và hợp tác bền vững.",
      quickLinksHeading: "LIÊN KẾT NHANH",
      contactHeading: "THÔNG TIN LIÊN HỆ",
      developedHeading: "PHÁT TRIỂN BỞI",
      taxCodeLabel: "Mã số thuế",
      taxCode: "1201611681",
      address: "Khu phố 5, Thị trấn Vĩnh Bình, Huyện Gò Công Tây, Tỉnh Tiền Giang, Việt Nam",
      phone: "0907 494 177 (+84 907 494 177)",
      email: "thaovinaxo@gmail.com",
      website: "https://vinaxo.net",
      sonaiTitle: "Công Nghệ Trí Tuệ Nhân Tạo",
      sonaiDesc: "Website Designed & Developed by SONAI",
      privacy: "Chính sách bảo mật",
      terms: "Điều khoản sử dụng",
      sitemap: "Sơ đồ trang",
      rights: "© 2026 CÔNG TY TNHH VINAXO. Bản quyền được bảo lưu."
    }
  }
};

/**
 * Verified Product Showcase Data
 * Authentic products verified through OCOP certification and press records
 */
export const productsData = [
  {
    id: "dried-mango",
    slug: "dried-mango",
    category: "mango",
    imageWebp: "assets/images/prod_mango.webp",
    imageJpg: "assets/images/prod_mango.jpg",
    verified: true,
    ocop: "3-Star OCOP",
    specs: {
      moisture: "< 15%",
      brix: "65° - 70° Brix",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Cool, dry place (20 - 25°C), away from direct sunlight",
      storageVi: "Nơi khô ráo, thoáng mát (20 - 25°C), tránh ánh nắng trực tiếp",
      ingredientsEn: "100% Fresh Mekong Delta mango (Cat Chu & Hoa Loc), zero added sugar, preservative-free",
      ingredientsVi: "100% Xoài tươi tuyển chọn (Xoài Cát Chu & Cát Hòa Lộc), không đường tinh luyện, không chất bảo quản",
      processEn: "Low-temperature convective hot air drying (~60°C) retaining natural golden hue, fiber, and vitamins A & C",
      processVi: "Sấy dẻo nhiệt thấp tuần hoàn (~60°C) bảo toàn màu vàng óng, cấu trúc dẻo thơm và vitamin A, C tự nhiên",
      packagingEn: "Zip pouch 100g, 250g, 500g / Master carton 5kg, 10kg with N2 flushing / OEM Private Label",
      packagingVi: "Túi zip 100g, 250g, 500g / Thùng carton xuất khẩu 5kg, 10kg nạp khí Nitơ / OEM nhãn riêng",
      certificationsEn: "3-Star OCOP, BRCGS Grade B Facility, BSCI Social Compliance",
      certificationsVi: "OCOP 3 Sao Tiền Giang, Nhà máy chuẩn BRCGS Grade B, Tuân thủ BSCI"
    },
    en: {
      name: "Naturally Soft-Dried Mango",
      desc: "Authentic tropical sweetness, gentle chewy texture, no added sugar.",
      origin: "Dong Thap & Tien Giang Orchards",
      features: "OCOP 3-Star certified. Carefully sliced from premium Cat Chu and selected mangoes. Low-temperature dried (~60°C) to preserve bright natural color, dietary fiber, and vitamins A & C."
    },
    vi: {
      name: "Xoài sấy dẻo tự nhiên",
      desc: "Ngọt thanh tự nhiên, dẻo mềm mọng vị, không thêm đường.",
      origin: "Vùng xoài Đồng Tháp & Tiền Giang",
      features: "Sản phẩm đạt chuẩn OCOP 3 sao. Chế biến từ xoài Cát Chu và xoài tuyển chọn ĐBSCL. Công nghệ sấy dẻo nhiệt thấp (~60°C) giữ trọn sắc vàng óng, cấu trúc dẻo thơm và vitamin A, C tự nhiên."
    }
  },
  {
    id: "dried-jackfruit",
    slug: "dried-jackfruit",
    category: "jackfruit",
    imageWebp: "assets/images/prod_mixed.webp",
    imageJpg: "assets/images/prod_mixed.jpg",
    verified: true,
    ocop: "3-Star OCOP",
    specs: {
      moisture: "< 14%",
      brix: "60° - 65° Brix",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Cool, dry environment, keep tightly sealed after opening",
      storageVi: "Nơi khô ráo thoáng mát, đóng kín miệng túi sau khi mở",
      ingredientsEn: "100% Tree-ripened Thai jackfruit, zero cholesterol, no artificial colorings",
      ingredientsVi: "100% Mít Thái tươi chín cây, không cholesterol, không phẩm màu",
      processEn: "Low-temperature vacuum drying & high-speed centrifugal oil separation",
      processVi: "Sấy dẻo nhiệt thấp và chiên sấy chân không kết hợp ly tâm tách dầu triệt để",
      packagingEn: "Zip pouch 100g, 250g, 500g / Export Master carton 5kg, 10kg",
      packagingVi: "Túi zip 100g, 250g, 500g / Thùng carton xuất khẩu 5kg, 10kg",
      certificationsEn: "3-Star OCOP, BRCGS Grade B Facility, Clean Label",
      certificationsVi: "OCOP 3 Sao Tiền Giang, Nhà máy chuẩn BRCGS Grade B, Clean Label"
    },
    en: {
      name: "Soft-Dried & Vacuum Jackfruit",
      desc: "Intense tropical aroma, thick honeyed slices, nutrient-dense.",
      origin: "Tien Giang & Hau Giang Farms",
      features: "OCOP 3-Star certified. Thick, fragrant jackfruit segments processed via vacuum drying and centrifugal separation, delivering rich natural sweetness with zero cholesterol."
    },
    vi: {
      name: "Mít sấy dẻo & sấy chân không",
      desc: "Hương thơm nồng nàn, múi mít dày ngọt đậm đà tự nhiên.",
      origin: "Vựa mít Tiền Giang & Hậu Giang",
      features: "Sản phẩm đạt chuẩn OCOP 3 sao. Tuyển chọn từng múi mít tươi dày dặn, sấy công nghệ cao và tách dầu ly tâm, giữ vị ngọt thanh tự nhiên của mít chín cây mà không ngấy dầu."
    }
  },
  {
    id: "dried-dragon-fruit",
    slug: "dried-dragon-fruit",
    category: "dragon",
    imageWebp: "assets/images/prod_dragonfruit.webp",
    imageJpg: "assets/images/prod_dragonfruit.jpg",
    verified: true,
    ocop: "3-Star OCOP",
    specs: {
      moisture: "< 16%",
      brix: "50° - 55° Brix",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Store in ambient cool conditions, avoid high humidity",
      storageVi: "Bảo quản nơi khô mát, tránh độ ẩm cao và ánh nắng",
      ingredientsEn: "100% Fresh Cho Gao red & white dragon fruit, no added sugar",
      ingredientsVi: "100% Thanh long ruột đỏ & ruột trắng Chợ Gạo, không thêm đường",
      processEn: "Gentle dehydration preserving vibrant betalain antioxidants and crunchy seeds",
      processVi: "Sấy dẻo nhiệt thấp giữ nguyên sắc tím đỏ betalain, chất xơ và hạt giòn tự nhiên",
      packagingEn: "Zip pouch 100g, 250g, 500g / Master carton 5kg, 10kg",
      packagingVi: "Túi zip 100g, 250g, 500g / Thùng carton xuất khẩu 5kg, 10kg",
      certificationsEn: "3-Star OCOP, BRCGS Grade B Facility, 100% Clean Label",
      certificationsVi: "OCOP 3 Sao Tiền Giang, Nhà máy chuẩn BRCGS Grade B, Clean Label"
    },
    en: {
      name: "Soft-Dried Dragon Fruit",
      desc: "Striking natural magenta hue, rich in antioxidants & dietary fiber.",
      origin: "Cho Gao, Tien Giang Province",
      features: "OCOP 3-Star certified. Made from red and white flesh dragon fruit from Tien Giang's specialized growing regions. Crunchy seeds, mild sweetness, packed with betalain polyphenols."
    },
    vi: {
      name: "Thanh long sấy dẻo",
      desc: "Sắc đỏ tím rực rỡ tự nhiên, dồi dào chất chống oxy hóa.",
      origin: "Vùng chuyên canh Chợ Gạo, Tiền Giang",
      features: "Sản phẩm đạt chuẩn OCOP 3 sao. Được chế biến từ thanh long ruột đỏ và ruột trắng đặc sản Tiền Giang. Hạt giòn nhẹ vui miệng, vị ngọt dịu thanh tao, giàu chất xơ và polyphenol tự nhiên."
    }
  },
  {
    id: "dried-pineapple",
    slug: "dried-pineapple",
    category: "pineapple",
    imageWebp: "assets/images/prod_pineapple.webp",
    imageJpg: "assets/images/prod_pineapple.jpg",
    verified: true,
    ocop: "Verified Line",
    specs: {
      moisture: "< 15%",
      brix: "55° - 60° Brix",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Cool, dry warehouse conditions (18 - 24°C)",
      storageVi: "Nơi khô ráo thoáng mát (18 - 24°C)",
      ingredientsEn: "100% Fresh Queen pineapple, preservative-free, zero added color",
      ingredientsVi: "100% Khóm Queen tươi Tân Phước, không chất bảo quản, không phẩm màu",
      processEn: "Ozone sanitization, precision slicing, and low-heat drying preserving Bromelain",
      processVi: "Rửa ozone, gọt vỏ cắt lát và sấy nhiệt thấp bảo toàn enzyme Bromelain",
      packagingEn: "Zip pouch 100g, 250g, 500g / Master carton 5kg, 10kg",
      packagingVi: "Túi zip 100g, 250g, 500g / Thùng carton xuất khẩu 5kg, 10kg",
      certificationsEn: "BRCGS Grade B Facility, BSCI Green Supply Chain",
      certificationsVi: "Nhà máy chuẩn BRCGS Grade B, Chuỗi cung ứng sạch BSCI"
    },
    en: {
      name: "Naturally Soft-Dried Pineapple",
      desc: "Tangy-sweet balance, golden slices, naturally rich in bromelain.",
      origin: "Tan Phuoc Pineapple Hub, Tien Giang",
      features: "Fresh Queen pineapples sourced directly from the Tan Phuoc agricultural hub. Soft-dried to a moist, chewy bite that pairs vibrant acidity with lingering natural honey notes."
    },
    vi: {
      name: "Thơm (Dứa) sấy dẻo",
      desc: "Chua ngọt cân bằng, màu vàng ươm mọng mật, giàu bromelain.",
      origin: "Vùng khóm Tân Phước, Tiền Giang",
      features: "Nguyên liệu khóm Queen tươi tuyển chọn từ thủ phủ khóm Tân Phước. Quy trình sấy dẻo giữ được độ ẩm mềm mọng, vị chua thanh ngọt hậu sảng khoái và hàm lượng enzyme bromelain cao."
    }
  },
  {
    id: "dried-banana",
    slug: "dried-banana",
    category: "banana",
    imageWebp: "assets/images/prod_banana.webp",
    imageJpg: "assets/images/prod_banana.jpg",
    verified: true,
    ocop: "Verified Line",
    specs: {
      moisture: "< 18%",
      brix: "65° - 72° Brix",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Cool, dry place, sealed packaging",
      storageVi: "Nơi khô mát, đóng kín sau khi sử dụng",
      ingredientsEn: "100% Naturally honey-ripened Mekong bananas, zero added sugar",
      ingredientsVi: "100% Chuối xiêm/chuối già chín cây tự nhiên, không tẩm ướp đường",
      processEn: "Clean-room peeling, slicing and gentle convective low-temperature dehydration",
      processVi: "Sơ chế phòng sạch, sấy nhiệt thấp khép kín lên mật tự nhiên",
      packagingEn: "Zip pouch 100g, 250g, 500g / Master carton 5kg, 10kg",
      packagingVi: "Túi zip 100g, 250g, 500g / Thùng carton xuất khẩu 5kg, 10kg",
      certificationsEn: "BRCGS Grade B Facility, 100% Natural Clean Label",
      certificationsVi: "Nhà máy chuẩn BRCGS Grade B, 100% Thuần tự nhiên"
    },
    en: {
      name: "Naturally Soft-Dried Banana",
      desc: "Rich honeyed aroma, chewy bite, natural potassium and healthy energy.",
      origin: "Tien Giang & Vinh Long Orchards",
      features: "Traditional Mekong Delta bananas naturally dehydrated without added syrup or sugar. Rich in dietary potassium, natural fructose, and vitamins, ideal for sports nutrition and wholesome snacking."
    },
    vi: {
      name: "Chuối sấy dẻo tự nhiên",
      desc: "Thơm ngọt dẻo mật, bổ sung kali và năng lượng tự nhiên.",
      origin: "Vùng trồng chuối Tiền Giang & Vĩnh Long",
      features: "Được tuyển chọn từ chuối chín tự nhiên của miệt vườn miền Tây. Quá trình sấy nhiệt thấp giúp chuối lên mật dẻo dai tự nhiên mà không cần thêm đường, giàu khoáng chất kali và chất xơ."
    }
  },
  {
    id: "chocolate-coated-energy-bar",
    slug: "chocolate-coated-energy-bar",
    category: "energy-bar",
    imageWebp: "assets/images/news/dried-fruit-export.webp",
    imageJpg: "assets/images/news/dried-fruit-export.jpg",
    verified: true,
    ocop: "Innovation Line",
    specs: {
      moisture: "< 10%",
      brix: "55° - 60° Brix",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Store at 18 - 22°C, protect from heat & direct light",
      storageVi: "Bảo quản ở 18 - 22°C, tránh nhiệt độ cao làm chảy sô-cô-la",
      ingredientsEn: "VINAXO soft-dried fruit, single-origin dark chocolate, EUDR-compliant cocoa",
      ingredientsVi: "Trái cây sấy dẻo VINAXO, sô-cô-la đen nguyên chất, cacao chuẩn EUDR",
      processEn: "Cold-enrobed technology & cold-pressed nutrient-dense fruit bar formatting",
      processVi: "Công nghệ phủ sô-cô-la lạnh và ép thanh năng lượng trái cây giàu dưỡng chất",
      packagingEn: "Flow-wrap bar 40g, 50g / Retail box 12 bars / Export Master carton",
      packagingVi: "Thanh gói 40g, 50g / Hộp bán lẻ 12 thanh / Thùng carton xuất khẩu",
      certificationsEn: "ESG Aligned, BRCGS Grade B Facility, EUDR Compliant",
      certificationsVi: "Chuẩn thích ứng ESG, Nhà máy BRCGS Grade B, Tuân thủ EUDR Châu Âu"
    },
    en: {
      name: "Chocolate-Coated Fruits & Fruit Energy Bars",
      desc: "Innovative value-added line crafted for European export standards.",
      origin: "VINAXO R&D & Processing Facility",
      features: "Premium dried fruit enrobed in fine chocolate with EUDR-compliant cocoa inputs, alongside 100% natural fruit essence energy bars developed for athletic and health-conscious European markets."
    },
    vi: {
      name: "Trái cây sấy nhúng Sô-cô-la & Thanh năng lượng",
      desc: "Dòng sản phẩm đổi mới sáng tạo cao cấp theo tiêu chuẩn Châu Âu.",
      origin: "Trung tâm R&D và Nhà máy VINAXO",
      features: "Sự kết hợp tinh tế giữa trái cây sấy dẻo tự nhiên và sô-cô-la nguyên chất với nguồn nguyên liệu cacao đáp ứng quy định chống phá rừng EUDR của EU, cùng dòng thanh năng lượng trái cây tự nhiên tiện lợi."
    }
  }
];

/**
 * Authentic News & Press Articles Data
 * Every single article below is verified with exact original URL, publication date,
 * accredited source, and structured summary.
 * Delineated into:
 * - category: 'press' (Báo chí nói về VINAXO - interviews, articles, executive quotes, export analysis)
 * - category: 'company' (Tin tức doanh nghiệp - factory operations, raw fruit procurement, events)
 * - badgeType: 'quote' | 'interview' | 'operation' | 'event'
 */
export const newsData = [
  {
    id: "press-cafef-natural-fruits",
    category: "press",
    badgeType: "quote",
    badgeTextVi: "Trích dẫn phát biểu",
    badgeTextEn: "Executive Quote",
    source: "CafeF",
    sourceUrl: "https://cafef.vn/rau-qua-che-bien-cua-viet-nam-len-ngoi-188251017063840426.chn",
    publishedAt: "2025-10-17",
    dateEn: "Oct 17, 2025",
    dateVi: "17/10/2025",
    verified: true,
    personQuoted: {
      name: "Hoàng Mạnh Cường",
      titleVi: "Giám đốc kinh doanh Công ty TNHH Vinaxo",
      titleEn: "Commercial Director, Vinaxo Co., Ltd."
    },
    imageWebp: "assets/images/news/dried-fruit-export.webp",
    imageJpg: "assets/images/news/dried-fruit-export.jpg",
    en: {
      title: "VINAXO on Natural Dried Fruit Trends in Export Markets",
      sourceBadge: "CafeF • Economic Press",
      summary: "In CafeF's report on Vietnam's rising processed fruit exports, Mr. Hoang Manh Cuong, Commercial Director of Vinaxo, highlighted the growing global demand for 'natural dried fruits'. Modern consumers in the US and international markets increasingly favor healthy snacks with no added sugar and zero chemical preservatives, preserving the authentic fragrance and nutrients of tropical fruits.",
      readMore: "Read Original Article"
    },
    vi: {
      title: "VINAXO chia sẻ về xu hướng trái cây sấy tự nhiên trên thị trường quốc tế",
      sourceBadge: "CafeF • Chuyên trang Kinh tế",
      summary: "Trong bài viết của CafeF về sự lên ngôi của ngành rau quả chế biến Việt Nam, ông Hoàng Mạnh Cường - Giám đốc kinh doanh Công ty TNHH Vinaxo nhấn mạnh xu hướng 'trái cây sấy tự nhiên' (natural dried fruit) đang chiếm ưu thế tại thị trường Mỹ. Người tiêu dùng ngày càng ưa chuộng các sản phẩm không thêm đường, không chất bảo quản, giữ nguyên hương vị và dinh dưỡng tự nhiên.",
      readMore: "Đọc bài báo gốc"
    }
  },
  {
    id: "press-nld-eu-green-policy",
    category: "press",
    badgeType: "quote",
    badgeTextVi: "Trích dẫn phát biểu",
    badgeTextEn: "Executive Quote",
    source: "Báo Người Lao Động",
    sourceUrl: "https://nld.com.vn/thich-ung-voi-chinh-sach-xanh-chau-au-196250302203515859.htm",
    publishedAt: "2025-03-02",
    dateEn: "Mar 02, 2025",
    dateVi: "02/03/2025",
    verified: true,
    personQuoted: {
      name: "Hoàng Mạnh Cường",
      titleVi: "Giám đốc kinh doanh Công ty TNHH Vinaxo (Tiền Giang)",
      titleEn: "Commercial Director, Vinaxo Co., Ltd."
    },
    imageWebp: "assets/images/news/eu-green-policy.webp",
    imageJpg: "assets/images/news/eu-green-policy.jpg",
    en: {
      title: "VINAXO Adapts to EU Green Policies, ESG & BRCGS Standards",
      sourceBadge: "Người Lao Động • National Press",
      summary: "Bao Nguoi Lao Dong highlights Vinaxo's export roadmap: while the US accounts for ~70% of export share, Europe represents ~20% of sales with valued German partners. To meet rigorous European requirements, Vinaxo's factory has achieved BRCGS Food Safety Grade B, while actively implementing ESG practices, BSCI social compliance, and EUDR deforestation-free ingredient standards.",
      readMore: "Read Original Article"
    },
    vi: {
      title: "VINAXO thích ứng với chính sách xanh Châu Âu và chuẩn an toàn thực phẩm BRCGS",
      sourceBadge: "Người Lao Động • Báo Quốc Gia",
      summary: "Bài báo trên Người Lao Động phản ánh chiến lược của Vinaxo khi thích ứng với tiêu chuẩn xanh của EU. Hiện thị trường Mỹ chiếm ~70% sản lượng xuất khẩu, còn Châu Âu chiếm ~20% doanh số với nhiều đối tác Đức. Nhà máy Vinaxo đã đạt chứng nhận an toàn thực phẩm quốc tế BRCGS Grade B, đồng thời triển khai tiêu chuẩn ESG, trách nhiệm xã hội BSCI và quy định EUDR.",
      readMore: "Đọc bài báo gốc"
    }
  },
  {
    id: "press-nld-mango-sourcing",
    category: "company",
    badgeType: "operation",
    badgeTextVi: "Thu mua mùa vụ & Dự trữ",
    badgeTextEn: "Procurement & Storage",
    source: "Báo Người Lao Động / CafeF / 24H",
    sourceUrl: "https://nld.com.vn/xoai-re-hiem-co-nha-may-mua-tru-den-thang-10-196260524115321407.htm",
    secondaryUrls: [
      { name: "CafeF", url: "https://cafef.vn/xoai-re-hiem-co-nha-may-mua-tru-den-thang-10-188260524151759491.chn" },
      { name: "24H", url: "https://www.24h.com.vn/thi-truong-tieu-dung/xoai-re-hiem-co-nha-may-mua-tru-den-thang-10-c52a1764397.html" }
    ],
    publishedAt: "2026-05-24",
    dateEn: "May 24, 2026",
    dateVi: "24/05/2026",
    verified: true,
    personQuoted: {
      name: "Hoàng Mạnh Cường",
      titleVi: "Giám đốc kinh doanh Công ty TNHH Vinaxo",
      titleEn: "Commercial Director, Vinaxo Co., Ltd."
    },
    imageWebp: "assets/images/news/mango-procurement.webp",
    imageJpg: "assets/images/news/mango-procurement.jpg",
    en: {
      title: "VINAXO Strengthens Mango Procurement & Processing Storage",
      sourceBadge: "Người Lao Động / CafeF / 24H",
      summary: "During the main harvest season, Vinaxo actively procures tens of thousands of tons of fresh mangoes from concentrated Mekong Delta farming belts. By deploying large cold-storage capacity, Vinaxo stores and processes raw materials continuously through October, stabilizing farmer incomes and ensuring uninterrupted supply for international export contracts.",
      readMore: "Read Original Article"
    },
    vi: {
      title: "VINAXO chủ động nguồn nguyên liệu xoài và dự trữ chế biến quanh năm",
      sourceBadge: "Người Lao Động / CafeF / 24H",
      summary: "Vào vụ thu hoạch rộ, Vinaxo chủ động thu mua lượng lớn xoài tươi từ các vùng chuyên canh Đồng bằng Sông Cửu Long. Nhờ hệ thống kho lạnh và năng lực chế biến sâu, nhà máy trữ nguyên liệu để sản xuất liên tục đến tận tháng 10, vừa giúp nhà vườn ổn định đầu ra, vừa đảm bảo nguồn cung dồi dào cho các đơn hàng xuất khẩu quốc tế.",
      readMore: "Đọc bài báo gốc"
    }
  },
  {
    id: "press-24h-tet-oem",
    category: "company",
    badgeType: "operation",
    badgeTextVi: "Hoạt động sản xuất nhà máy",
    badgeTextEn: "Factory Production & OEM",
    source: "Báo 24H",
    sourceUrl: "https://www.24h.com.vn/thi-truong-tieu-dung/hang-tet-bat-dau-len-ke-c52a1719457.html",
    publishedAt: "2024-11-19",
    dateEn: "Nov 19, 2024",
    dateVi: "19/11/2024",
    verified: true,
    personQuoted: {
      name: "Hoàng Mạnh Cường",
      titleVi: "Giám đốc kinh doanh Công ty TNHH Vinaxo",
      titleEn: "Commercial Director, Vinaxo Co., Ltd."
    },
    imageWebp: "assets/images/news/tet-oem-production.webp",
    imageJpg: "assets/images/news/tet-oem-production.jpg",
    en: {
      title: "Tet Holiday Orders & Transparent OEM Processing at VINAXO",
      sourceBadge: "Báo 24H • Consumer Market",
      summary: "Reporting on year-end consumer preparations, 24H noted that Vinaxo actively manufactures dried fruits for export to the US and Russia while processing OEM orders for domestic retail chains and digital creators. Contracts maintain full transparency, clearly displaying production origins at Vinaxo's processing facility to protect consumer rights.",
      readMore: "Read Original Article"
    },
    vi: {
      title: "Đơn hàng trái cây sấy phục vụ mùa Tết và năng lực gia công OEM minh bạch",
      sourceBadge: "Báo 24H • Thị trường Tiêu dùng",
      summary: "Ghi nhận thị trường hàng Tết trên 24H cho biết Vinaxo xuất khẩu mạnh sang Mỹ, Nga và gia công OEM cho các hệ thống bán lẻ, nhà sáng tạo nội dung. Doanh nghiệp thực hiện nghiêm ngặt việc minh bạch thông tin sản xuất, ghi rõ nguồn gốc xuất xứ tại xưởng Vinaxo để người tiêu dùng hoàn toàn yên tâm về chất lượng.",
      readMore: "Đọc bài báo gốc"
    }
  },
  {
    id: "press-dong-thap-thu-thao",
    category: "press",
    badgeType: "interview",
    badgeTextVi: "Phỏng vấn độc quyền",
    badgeTextEn: "Exclusive Interview",
    source: "Báo Đồng Tháp",
    sourceUrl: "https://baodongthap.vn/chi-hoang-thi-thu-thao-dua-san-pham-trai-cay-say-vuon-xa-a231001.html",
    publishedAt: "2025-09-19",
    dateEn: "Sep 19, 2025",
    dateVi: "19/09/2025",
    verified: true,
    personQuoted: {
      name: "Hoàng Thị Thu Thảo",
      titleVi: "Đồng sáng lập & Tổng Giám đốc Công ty TNHH VINAXO",
      titleEn: "Co-Founder & General Director, VINAXO Co., Ltd."
    },
    imageWebp: "assets/images/news/vinaxo-company-story.webp",
    imageJpg: "assets/images/news/vinaxo-company-story.jpg",
    en: {
      title: "Bringing Vietnamese Dried Fruits to the World: The Story of VINAXO",
      sourceBadge: "Báo Đồng Tháp • Economic News",
      summary: "Bao Dong Thap profiles Ms. Hoang Thị Thu Thao, co-founder of VINAXO. With a mission to solve 'bumper harvest, dropping price' dilemmas, Vinaxo procures over 1,000 tons of fresh fruits monthly with an exact 10:1 dehydration ratio, exporting ~100 tons of finished soft-dried products monthly to the US, Russia, and Korea, generating jobs for nearly 500 workers across the network.",
      readMore: "Read Original Article"
    },
    vi: {
      title: "Chị Hoàng Thị Thu Thảo: Đưa sản phẩm trái cây sấy vươn xa",
      sourceBadge: "Báo Đồng Tháp • Kinh tế Xã hội",
      summary: "Bài báo khắc họa câu chuyện khởi nghiệp truyền cảm hứng của chị Hoàng Thị Thu Thảo. Đồng hành cùng nông dân giải quyết tình trạng 'được mùa, rớt giá', Vinaxo thu mua hơn 1.000 tấn trái cây tươi mỗi tháng (tỷ lệ 10 kg tươi cho 1 kg thành phẩm sấy), xuất khẩu ~100 tấn thành phẩm/tháng sang Mỹ, Nga, Hàn Quốc và tạo việc làm cho gần 500 lao động.",
      readMore: "Đọc bài báo gốc"
    }
  },
  {
    id: "press-thanh-nien-digital-trade",
    category: "company",
    badgeType: "event",
    badgeTextVi: "Sự kiện & Trải nghiệm nhà máy",
    badgeTextEn: "Factory Tour & Event",
    source: "Báo Thanh Niên",
    sourceUrl: "https://thanhnien.vn/tiktoker-ve-tan-vuon-ho-tro-nong-dan-ban-nong-san-dip-tet-18524010619344326.htm",
    publishedAt: "2024-01-06",
    dateEn: "Jan 06, 2024",
    dateVi: "06/01/2024",
    verified: true,
    personQuoted: {
      name: "Hoàng Mạnh Cường",
      titleVi: "Đại diện Công ty TNHH Vinaxo",
      titleEn: "Representative, Vinaxo Co., Ltd."
    },
    imageWebp: "assets/images/news/agricultural-digital-marketing.webp",
    imageJpg: "assets/images/news/agricultural-digital-marketing.jpg",
    en: {
      title: "Promoting Agricultural Produce via Digital Commerce at VINAXO Facility",
      sourceBadge: "Báo Thanh Niên • National Daily",
      summary: "Bao Thanh Nien reports on digital creators and TikTokers visiting agricultural orchards and touring Vinaxo's processing facility in Go Cong Tay, Tien Giang. The event connected local farming communities with digital trade channels, showcasing firsthand the modern, hygienic drying processes of Vinaxo to consumers nationwide.",
      readMore: "Read Original Article"
    },
    vi: {
      title: "Quảng bá nông sản và trải nghiệm dây chuyền sấy trái cây qua nền tảng số",
      sourceBadge: "Báo Thanh Niên • Đời sống Nông nghiệp",
      summary: "Báo Thanh Niên đưa tin về đoàn nhà sáng tạo nội dung số về tận vườn và ghé thăm nhà máy chế biến của Vinaxo tại huyện Gò Công Tây, Tiền Giang. Hoạt động giúp kết nối nông dân với các kênh thương mại số, đồng thời minh chứng quy trình chế biến khép kín, an toàn vệ sinh của trái cây sấy dẻo Vinaxo đến đông đảo người tiêu dùng.",
      readMore: "Đọc bài báo gốc"
    }
  },
  {
    id: "press-sggp-green-logistics",
    category: "press",
    badgeType: "quote",
    badgeTextVi: "Thông tin xuất khẩu & Logistics",
    badgeTextEn: "Export & Logistics Analysis",
    source: "Báo Sài Gòn Giải Phóng",
    sourceUrl: "https://www.sggp.org.vn/logistics-xanh-xu-huong-tat-yeu-post695588.html",
    publishedAt: "2023-06-30",
    dateEn: "Jun 30, 2023",
    dateVi: "30/06/2023",
    verified: true,
    personQuoted: {
      name: "Hoàng Mạnh Cường",
      titleVi: "Giám đốc Công ty TNHH Vinaxo",
      titleEn: "Director, Vinaxo Co., Ltd."
    },
    imageWebp: "assets/images/news/green-logistics.webp",
    imageJpg: "assets/images/news/green-logistics.jpg",
    en: {
      title: "Green Logistics: Vital Strategy for Soft-Dried Fruit Exporters",
      sourceBadge: "Báo Sài Gòn Giải Phóng",
      summary: "In a specialized report on export logistics, Mr. Hoang Manh Cuong stated that Vinaxo exports an average of 120 tons of soft-dried fruit finished products monthly to Europe and the United States. He analyzed maritime freight cost dynamics and advocated for greener supply chain solutions to enhance the global competitiveness of Vietnamese agricultural goods.",
      readMore: "Read Original Article"
    },
    vi: {
      title: "Logistics xanh - xu hướng tất yếu cho xuất khẩu nông sản sấy dẻo",
      sourceBadge: "Báo Sài Gòn Giải Phóng • Kinh tế",
      summary: "Trong bài phân tích của Báo SGGP về năng lực logistics xuất khẩu, ông Hoàng Mạnh Cường cho biết công ty xuất khẩu trung bình khoảng 120 tấn thành phẩm trái cây sấy dẻo mỗi tháng sang thị trường châu Âu và Hoa Kỳ. Bài viết nêu rõ những thách thức về chi phí vận tải biển quốc tế và sự cần thiết của các giải pháp logistics xanh nhằm nâng cao năng lực cạnh tranh cho nông sản Việt.",
      readMore: "Đọc bài báo gốc"
    }
  },
  {
    id: "press-nnmt-processing-facility",
    category: "company",
    badgeType: "operation",
    badgeTextVi: "Cơ sở sản xuất & Công nghệ",
    badgeTextEn: "Factory & Infrastructure",
    source: "Báo Nông nghiệp và Môi trường",
    sourceUrl: "https://nongnghiepmoitruong.vn/moi-ngay-che-bien-hang-chuc-tan-trai-cay-giai-quyet-doi-cho-truoc-dich-covid-19-d292346.html",
    publishedAt: "2021-08-20",
    dateEn: "Aug 20, 2021",
    dateVi: "20/08/2021",
    verified: true,
    personQuoted: {
      name: "Nguyễn Anh Khoa",
      titleVi: "Giám đốc Công ty TNHH VinaXo",
      titleEn: "Managing Director, VinaXo Co., Ltd."
    },
    imageWebp: "assets/images/news/fruit-processing.webp",
    imageJpg: "assets/images/news/fruit-processing.jpg",
    en: {
      title: "Modern 4,000 m² Facility Enhances Post-Harvest Fruit Processing",
      sourceBadge: "Báo Nông Nghiệp & Môi Trường",
      summary: "Detailing Vinaxo's industrial production, the report describes a 4,000 m² factory equipped with 6 high-tech dehydrators and cold storage in Go Cong Tay, Tien Giang. Managing Director Nguyen Anh Khoa explained how deep processing increases fruit value tenfold compared to fresh produce, salvaging oversized harvest and establishing supply lines to the US, Russia, and Europe.",
      readMore: "Read Original Article"
    },
    vi: {
      title: "Nhà máy chế biến 4.000 m² nâng tầm giá trị nông sản sau thu hoạch",
      sourceBadge: "Báo Nông Nghiệp & Môi Trường",
      summary: "Bài báo ghi nhận cơ sở sản xuất 4.000 m² với 6 máy sấy hiện đại và kho lạnh tại Gò Công Tây, Tiền Giang. Giám đốc Nguyễn Anh Khoa chia sẻ việc chế biến sâu giúp giá trị trái cây tăng gấp 10 lần so với bán tươi, hạn chế thất thoát sau thu hoạch cho nhà vườn và tạo nền tảng vững chắc để nâng tầm quy trình sản xuất đạt các tiêu chuẩn quốc tế khắt khe.",
      readMore: "Đọc bài báo gốc"
    }
  },
  {
    id: "press-dong-thap-khoa-thao",
    category: "company",
    badgeType: "interview",
    badgeTextVi: "Gương doanh nhân & OCOP",
    badgeTextEn: "Enterprise Profile & OCOP",
    source: "Báo Đồng Tháp",
    sourceUrl: "https://baodongthap.vn/gioi-phat-trien-kinh-te-kheo-vun-ven-gia-dinh-a122921.html",
    publishedAt: "2025-06-18",
    dateEn: "Jun 18, 2025",
    dateVi: "18/06/2025",
    verified: true,
    personQuoted: {
      name: "Nguyễn Anh Khoa & Hoàng Thị Thu Thảo",
      titleVi: "Giám đốc & Phó Giám đốc Công ty TNHH Vinaxo",
      titleEn: "Director & Deputy Director, Vinaxo Co., Ltd."
    },
    imageWebp: "assets/images/news/agricultural-production.webp",
    imageJpg: "assets/images/news/agricultural-production.jpg",
    en: {
      title: "Exemplary Agricultural Production & OCOP Certification at VINAXO",
      sourceBadge: "Báo Đồng Tháp • Enterprise Story",
      summary: "Highlighting exemplary enterprise leadership, Bao Dong Thap reports on Mr. Nguyen Anh Khoa (honored as Provincial Exemplary Farmer-Entrepreneur 2024) and Ms. Hoang Thi Thu Thao (Second Prize in Provincial Creative Startup Ideas). The couple built Vinaxo at Quarter 5, Vinh Binh, achieving 3 OCOP-certified products and developing innovative natural fruit energy bars for export.",
      readMore: "Read Original Article"
    },
    vi: {
      title: "Gương điển hình sản xuất kinh doanh giỏi và thành quả sản phẩm OCOP",
      sourceBadge: "Báo Đồng Tháp • Doanh nhân Tiêu biểu",
      summary: "Báo Đồng Tháp biểu dương anh Nguyễn Anh Khoa (vinh dự đạt danh hiệu 'Nông dân sản xuất, kinh doanh giỏi' cấp tỉnh năm 2024) và chị Hoàng Thị Thu Thảo (giải Nhì 'Ý tưởng sáng tạo khởi nghiệp'). Vợ chồng anh chị đã gây dựng Vinaxo tại khu phố 5, thị trấn Vĩnh Bình, đạt 3 chứng nhận OCOP cho sản phẩm sấy dẻo và tiếp tục nghiên cứu thanh năng lượng trái cây tự nhiên xuất khẩu.",
      readMore: "Đọc bài báo gốc"
    }
  }
];
