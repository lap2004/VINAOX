export interface SecondaryUrl {
  name: string;
  url: string;
}

export interface PersonQuoted {
  name: string;
  titleVi: string;
  titleEn: string;
}

export interface NewsLocalizedContent {
  title: string;
  sourceBadge: string;
  summary: string;
  readMore: string;
}

export interface NewsItem {
  id: string;
  category: 'press' | 'company';
  badgeType: 'quote' | 'interview' | 'operation' | 'event';
  badgeTextVi: string;
  badgeTextEn: string;
  source: string;
  sourceUrl: string;
  secondaryUrls?: SecondaryUrl[];
  publishedAt: string;
  dateEn: string;
  dateVi: string;
  verified: boolean;
  personQuoted?: PersonQuoted;
  imageWebp: string;
  imageJpg: string;
  en: NewsLocalizedContent;
  vi: NewsLocalizedContent;
}

export const newsData: NewsItem[] = [
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
    imageWebp: "/assets/images/news/dried-fruit-export.webp",
    imageJpg: "/assets/images/news/dried-fruit-export.jpg",
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
    imageWebp: "/assets/images/news/eu-green-policy.webp",
    imageJpg: "/assets/images/news/eu-green-policy.jpg",
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
    imageWebp: "/assets/images/news/mango-procurement.webp",
    imageJpg: "/assets/images/news/mango-procurement.jpg",
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
    imageWebp: "/assets/images/news/tet-oem-production.webp",
    imageJpg: "/assets/images/news/tet-oem-production.jpg",
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
    imageWebp: "/assets/images/news/vinaxo-company-story.webp",
    imageJpg: "/assets/images/news/vinaxo-company-story.jpg",
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
    imageWebp: "/assets/images/news/agricultural-digital-marketing.webp",
    imageJpg: "/assets/images/news/agricultural-digital-marketing.jpg",
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
    imageWebp: "/assets/images/news/green-logistics.webp",
    imageJpg: "/assets/images/news/green-logistics.jpg",
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
    imageWebp: "/assets/images/news/fruit-processing.webp",
    imageJpg: "/assets/images/news/fruit-processing.jpg",
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
    imageWebp: "/assets/images/news/agricultural-production.webp",
    imageJpg: "/assets/images/news/agricultural-production.jpg",
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
