export interface ComplianceBadge {
  id: string;
  pillLabel: string;
  name: string;
  kindEn: 'Certification' | 'Registration' | 'Audit';
  kindVi: 'Chứng nhận' | 'Đăng ký' | 'Kiểm toán';
  scopeEn: string;
  scopeVi: string;
  isFeaturedRed?: boolean;
  certImageWebp?: string;
  certImageJpg?: string;
  isHalalPlaceholder?: boolean;
}

/**
 * Official 8 compliance pillars & certificates from Vinaxo Brochure 2026 (Pages 1 & 4).
 * Distinguishes Certifications, Governmental Registrations, and Retail/Ethical Audits cleanly.
 */
export const COMPLIANCE_ITEMS: ComplianceBadge[] = [
  {
    id: 'brcgs',
    pillLabel: 'BRCGS',
    name: 'BRCGS Food Safety',
    kindEn: 'Certification',
    kindVi: 'Chứng nhận',
    scopeEn: 'SGS Global Standard Food Safety (Grade B)',
    scopeVi: 'Tiêu chuẩn An toàn Thực phẩm Toàn cầu SGS (Hạng B)',
    isFeaturedRed: true,
    certImageWebp: '/assets/images/certs-2026/cert-brcgs.webp',
    certImageJpg: '/assets/images/certs-2026/cert-brcgs.jpg',
  },
  {
    id: 'fda',
    pillLabel: 'US FDA REGISTERED',
    name: 'US FDA Registered',
    kindEn: 'Registration',
    kindVi: 'Đăng ký',
    scopeEn: 'U.S. FDA Food Facility Registration',
    scopeVi: 'Đăng ký Cơ sở Thực phẩm với FDA Hoa Kỳ',
    certImageWebp: '/assets/images/certs-2026/cert-fda.webp',
    certImageJpg: '/assets/images/certs-2026/cert-fda.jpg',
  },
  {
    id: 'iso22000',
    pillLabel: 'ISO 22000',
    name: 'ISO 22000:2018',
    kindEn: 'Certification',
    kindVi: 'Chứng nhận',
    scopeEn: 'Food Safety Management System (TQC)',
    scopeVi: 'Hệ thống Quản lý An toàn Thực phẩm (TQC)',
    certImageWebp: '/assets/images/certs-2026/cert-iso22000.webp',
    certImageJpg: '/assets/images/certs-2026/cert-iso22000.jpg',
  },
  {
    id: 'haccp',
    pillLabel: 'HACCP',
    name: 'HACCP',
    kindEn: 'Certification',
    kindVi: 'Chứng nhận',
    scopeEn: 'Hazard Analysis & Critical Control Point (TQC)',
    scopeVi: 'Phân tích Mối nguy & Điểm Kiểm soát Tới hạn (TQC)',
    certImageWebp: '/assets/images/certs-2026/cert-haccp.webp',
    certImageJpg: '/assets/images/certs-2026/cert-haccp.jpg',
  },
  {
    id: 'kosher',
    pillLabel: 'KOSHER OU',
    name: 'Kosher (OU)',
    kindEn: 'Certification',
    kindVi: 'Chứng nhận',
    scopeEn: 'Orthodox Union Kosher Certified',
    scopeVi: 'Chứng nhận Thực phẩm Kosher OU',
    certImageWebp: '/assets/images/certs-2026/cert-kosher-ou.webp',
    certImageJpg: '/assets/images/certs-2026/cert-kosher-ou.jpg',
  },
  {
    id: 'smeta',
    pillLabel: 'SMETA',
    name: 'SMETA Ethical Audit',
    kindEn: 'Audit',
    kindVi: 'Kiểm toán',
    scopeEn: 'Sedex Members Ethical Trade Audit (v6.1)',
    scopeVi: 'Kiểm toán Thương mại Đạo đức Sedex SMETA v6.1',
    certImageWebp: '/assets/images/certs-2026/cert-smeta.webp',
    certImageJpg: '/assets/images/certs-2026/cert-smeta.jpg',
  },
  {
    id: 'halal',
    pillLabel: 'HALAL',
    name: 'Halal Certified',
    kindEn: 'Certification',
    kindVi: 'Chứng nhận',
    scopeEn: 'Halal Production Compliance (Full copy on request)',
    scopeVi: 'Chứng nhận Sản xuất Halal (Bản sao cung cấp theo yêu cầu)',
    isHalalPlaceholder: true,
  },
  {
    id: 'costco',
    pillLabel: 'COSTCO GMP AUDIT',
    name: 'Costco GMP Audit',
    kindEn: 'Audit',
    kindVi: 'Kiểm toán',
    scopeEn: 'Retail Supply Chain GMP Verification',
    scopeVi: 'Kiểm toán Thực hành Sản xuất Tốt Chuỗi Costco',
  },
];

export interface BrochureCategory {
  id: string;
  imageWebp: string;
  imageJpg: string;
  titleEn: string;
  titleVi: string;
  summaryEn?: string;
  summaryVi?: string;
  descEn: string;
  descVi: string;
  noAddedSugarFlag?: boolean;
  varietiesEn?: string;
  varietiesVi?: string;
  highlightsEn: string[];
  highlightsVi: string[];
  catalogFilter?: 'soft-dried' | 'chips' | 'nuts-seeds' | 'mixed';
  isOemSpecialty?: boolean;
}

/**
 * Exact 6 Official Product Lines from Vinaxo Brochure 2026 (Page 2: OUR PRODUCT RANGE).
 * Uses verified high-resolution cohesive studio photography across all six families.
 */
export const BROCHURE_CATEGORIES: BrochureCategory[] = [
  {
    id: 'soft-dried-fruit',
    imageWebp: '/assets/images/hero_fruits.webp',
    imageJpg: '/assets/images/hero_fruits.jpg',
    titleEn: 'Soft Dried Fruit',
    titleVi: 'Trái Cây Sấy Dẻo',
    descEn: 'Gently air-dried for a tender, chewy bite and vivid natural colour.',
    descVi: 'Sấy nhẹ giữ nguyên cấu trúc dẻo mềm, vị ngọt thanh và màu sắc nhiệt đới rực rỡ tự nhiên.',
    varietiesEn: 'Varieties: mango, jackfruit, pineapple, papaya, banana, guava, dragon fruit, passion fruit, young coconut.',
    varietiesVi: 'Các loại: xoài, mít, khóm (dứa), đu đủ, chuối, ổi, thanh long, chanh dây, dừa non.',
    highlightsEn: ['Mango & Jackfruit', 'Pineapple & Papaya', 'Red Dragon Fruit', 'Passion Fruit & Coconut'],
    highlightsVi: ['Xoài & Mít', 'Thơm & Đu đủ', 'Thanh long đỏ', 'Chanh dây & Dừa non'],
    catalogFilter: 'soft-dried',
  },
  {
    id: 'natural-dried-fruit',
    imageWebp: '/images/products/soft-dried-mango.webp',
    imageJpg: '/images/products/soft-dried-mango.jpg',
    titleEn: 'Natural Dried Fruit',
    titleVi: 'Trái Cây Sấy Tự Nhiên',
    noAddedSugarFlag: true,
    summaryEn: 'Ripe fruit dried in its own natural sweetness — nothing added, nothing taken away.',
    summaryVi: 'Trái cây chín tự nhiên được sấy nguyên bản — không thêm đường, không chất bảo quản.',
    descEn: 'Ripe fruit dried in its own natural sweetness — nothing added, nothing taken away. A clean-label choice for health-conscious shoppers.',
    descVi: 'Trái cây chín tự nhiên được sấy nguyên bản — không thêm đường, không phụ gia, lựa chọn nhãn sạch (Clean-Label) lý tưởng.',
    highlightsEn: ['100% Pure Fruit', 'Zero Added Sugar', 'Clean Label Choice', 'Chips & Natural Slices'],
    highlightsVi: ['100% Trái cây thuần', 'Không thêm đường', 'Chuẩn Nhãn Sạch', 'Sấy dẻo & giòn tự nhiên'],
    catalogFilter: 'chips',
  },
  {
    id: 'honey-infused-dried-fruit',
    imageWebp: '/images/categories/honey-infused-fruit.webp',
    imageJpg: '/images/categories/honey-infused-fruit.jpg',
    titleEn: 'Honey-Infused Dried Fruit',
    titleVi: 'Trái Cây Sấy Tẩm Mật Ong',
    noAddedSugarFlag: true,
    descEn: 'Naturally dried fruit finished with pure honey for a gentle, well-rounded sweetness and a soft, glossy texture.',
    descVi: 'Trái cây sấy tự nhiên kết hợp cùng mật ong nguyên chất, tạo vị ngọt dịu thanh và độ bóng mềm hấp dẫn.',
    highlightsEn: ['Pure Natural Honey', 'No Refined Sugar', 'Soft Glossy Finish', 'OEM Formulations'],
    highlightsVi: ['Mật ong nguyên chất', 'Không đường tinh luyện', 'Bề mặt dẻo óng mượt', 'Gia công OEM'],
    isOemSpecialty: true,
  },
  {
    id: 'chocolate-dipped-dried-fruit',
    imageWebp: '/images/categories/chocolate-dipped-fruit.webp',
    imageJpg: '/images/categories/chocolate-dipped-fruit.jpg',
    titleEn: 'Chocolate-Dipped Dried Fruit',
    titleVi: 'Trái Cây Sấy Nhúng Sô-Cô-La',
    descEn: 'Tropical dried fruit half-dipped in smooth chocolate — an indulgent treat that pairs fruity tang with rich cocoa.',
    descVi: 'Lát trái cây nhiệt đới nhúng nửa sô-cô-la mịn màng — hòa quyện vị chua ngọt trái cây với hương ca cao đậm đà.',
    highlightsEn: ['Half-Dipped Mango', 'Dark & Milk Cocoa', 'Retail Gift Packs', 'Private Label Ready'],
    highlightsVi: ['Xoài nhúng sô-cô-la', 'Cacao đen & sữa', 'Bao bì quà tặng', 'Gia công Nhãn riêng'],
    isOemSpecialty: true,
  },
  {
    id: 'fruit-and-nut-balls',
    imageWebp: '/images/categories/fruit-nut-balls.webp',
    imageJpg: '/images/categories/fruit-nut-balls.jpg',
    titleEn: 'Fruit & Nut Balls',
    titleVi: 'Viên Năng Lượng Trái Cây & Hạt',
    descEn: 'Bite-sized balls of dried tropical fruit — available plain or blended with wholesome nuts for a satisfying, energy-rich snack.',
    descVi: 'Viên snack nhỏ gọn từ trái cây nhiệt đới sấy — phiên bản thuần vị hoặc phối trộn hạt dinh dưỡng giàu năng lượng.',
    highlightsEn: ['Bite-Sized Energy', 'Plain or Nut Blend', 'Cashew & Macadamia', 'Custom Portion Packs'],
    highlightsVi: ['Viên snack tiện lợi', 'Thuần vị hoặc mix hạt', 'Điều & Mắc ca', 'Đóng gói theo yêu cầu'],
    catalogFilter: 'nuts-seeds',
  },
  {
    id: 'granola',
    imageWebp: '/images/categories/granola.webp',
    imageJpg: '/images/categories/granola.jpg',
    titleEn: 'Granola',
    titleVi: 'Granola Trái Cây & Hạt',
    descEn: 'Crunchy clusters of oats, dried tropical fruit and nuts — ideal for breakfast bowls, yogurt toppings and snacking.',
    descVi: 'Yến mạch nướng giòn kết hợp cùng trái cây nhiệt đới sấy và các loại hạt — hoàn hảo cho bữa sáng và ăn vặt lành mạnh.',
    highlightsEn: ['Baked Oat Clusters', 'Tropical Fruit Cubes', 'Cashew, Walnut & Lotus', 'Retail & Bulk Packs'],
    highlightsVi: ['Yến mạch giòn xốp', 'Trái cây sấy hạt lựu', 'Điều, Óc chó & Hạt sen', 'Đóng gói bán lẻ & xá'],
    catalogFilter: 'nuts-seeds',
  },
];

export interface FactoryImageItem {
  id: string;
  imageWebp: string;
  imageJpg: string;
  captionEn: string;
  captionVi: string;
  tagEn: string;
  tagVi: string;
}

/**
 * Official 4 Factory Photographs extracted directly from Vinaxo Brochure 2026 (Page 3: INSIDE OUR FACTORY).
 */
export const FACTORY_GALLERY: FactoryImageItem[] = [
  {
    id: 'sorting-hall-main',
    imageWebp: '/assets/images/factory-2026/factory-featured.webp',
    imageJpg: '/assets/images/factory-2026/factory-featured.jpg',
    tagEn: 'INSIDE OUR FACTORY • 25,000 M² COMPLEX',
    tagVi: 'TRONG NHÀ MÁY VINAXO • 25.000 M²',
    captionEn: 'High-capacity tropical fruit sorting and preparation floor operated under unified cleanroom PPE and food safety zoning.',
    captionVi: 'Khu phân loại và chế biến quy mô lớn với quy trình kiểm soát đồng phục vô trùng, phân vùng khép kín đạt chuẩn quốc tế.',
  },
  {
    id: 'processing-line-cleanroom',
    imageWebp: '/assets/images/factory-2026/factory-sub-1.webp',
    imageJpg: '/assets/images/factory-2026/factory-sub-1.jpg',
    tagEn: 'HYGIENIC TRAY RACKING',
    tagVi: 'XẾP KHAY & SẤY VÔ TRÙNG',
    captionEn: 'Cleanroom staging line where calibrated slices are arranged onto ventilated drying racks for even dehydration.',
    captionVi: 'Khu vực sắp xếp lát trái cây lên dàn khay sấy tiêu chuẩn để đảm bảo nhiệt lượng đối lưu đồng đều.',
  },
  {
    id: 'dehydration-rack-corridor',
    imageWebp: '/assets/images/factory-2026/factory-sub-2.webp',
    imageJpg: '/assets/images/factory-2026/factory-sub-2.jpg',
    tagEn: 'DRYING INFRASTRUCTURE',
    tagVi: 'HỆ THỐNG KHAY SẤY CÔNG NGHIỆP',
    captionEn: 'Sanitary floor stocked with food-grade multi-tier drying trolleys supporting 300 tons monthly export capacity.',
    captionVi: 'Hệ thống xe đẩy khay sấy đa tầng chuẩn thực phẩm phục vụ công suất 300 tấn thành phẩm mỗi tháng.',
  },
  {
    id: 'raw-washing-prep',
    imageWebp: '/assets/images/factory-2026/factory-sub-3.webp',
    imageJpg: '/assets/images/factory-2026/factory-sub-3.jpg',
    tagEn: 'WASHING & INITIAL PREP',
    tagVi: 'RỬA SẠCH & SƠ CHẾ ĐẦU VÀO',
    captionEn: 'Controlled pre-wash and hand-trimming stations safeguarding fresh tropical fruit purity prior to dehydration.',
    captionVi: 'Công đoạn rửa làm sạch và xử lý nguyên liệu tươi nghiêm ngặt trước khi đưa vào buồng sấy.',
  },
];

/**
 * Exact 3 Quality Promise Pillars from Vinaxo Brochure 2026 (Page 3: OUR QUALITY PROMISE).
 */
export const QUALITY_PROMISE_CARDS = [
  {
    number: '01',
    titleEn: 'Approved samples first',
    titleVi: 'Mẫu chuẩn được duyệt trước',
    descEn: 'A standard sample is submitted for approval before mass production and again before shipment.',
    descVi: 'Mẫu tiêu chuẩn được gửi để đối tác kiểm tra và phê duyệt trước khi sản xuất đại trà và đối chiếu lại trước khi xuất hàng.',
  },
  {
    number: '02',
    titleEn: 'Certified processes',
    titleVi: 'Quy trình đạt chứng nhận',
    descEn: 'Every stage follows internationally recognised systems including BRCGS, ISO 22000 and HACCP.',
    descVi: 'Mọi công đoạn đều tuân thủ nghiêm ngặt các hệ thống quản lý chất lượng quốc tế bao gồm BRCGS, ISO 22000 và HACCP.',
  },
  {
    number: '03',
    titleEn: 'Open to inspection',
    titleVi: 'Sẵn sàng kiểm định độc lập',
    descEn: 'Third-party inspection is welcome at any stage of production.',
    descVi: 'Chúng tôi luôn chào đón các đơn vị giám định độc lập kiểm tra tại bất kỳ công đoạn nào trong quá trình sản xuất.',
  },
];

export interface BrochureFaqItem {
  id: string;
  qEn: string;
  qVi: string;
  aEn: string;
  aVi: string;
}

/**
 * Exact 4 Frequently Asked Questions from Vinaxo Brochure 2026 (Page 4).
 */
export const BROCHURE_FAQS: BrochureFaqItem[] = [
  {
    id: 'moq',
    qEn: 'What is your minimum order quantity?',
    qVi: 'Số lượng đặt hàng tối thiểu (MOQ) là bao nhiêu?',
    aEn: 'MOQ varies by product, from 200 kg to 1 ton.',
    aVi: 'MOQ linh hoạt tùy theo từng dòng sản phẩm, khởi điểm từ 200 kg đến 1 tấn.',
  },
  {
    id: 'oem',
    qEn: 'Do you offer OEM / ODM services?',
    qVi: 'VINAXO có nhận gia công OEM / ODM nhãn riêng không?',
    aEn: 'Yes. Share your specifications with our sales team and we will tailor recipe, packaging and labelling to your needs.',
    aVi: 'Có. Quý đối tác chỉ cần chia sẻ yêu cầu cụ thể cho đội ngũ kinh doanh, chúng tôi sẽ tùy chỉnh công thức, quy cách đóng gói và nhãn mác theo đúng thương hiệu của bạn.',
  },
  {
    id: 'samples',
    qEn: 'Can I request samples?',
    qVi: 'Tôi có thể yêu cầu gửi mẫu thử sản phẩm không?',
    aEn: 'Certainly. Complimentary samples are available for your evaluation.',
    aVi: 'Hoàn toàn được. VINAXO luôn sẵn sàng cung cấp mẫu thử miễn phí để quý khách hàng trực tiếp đánh giá chất lượng.',
  },
  {
    id: 'leadtime',
    qEn: 'What is your lead time?',
    qVi: 'Thời gian sản xuất và giao hàng (Lead time) mất bao lâu?',
    aEn: 'Typically 2 to 4 weeks, depending on order volume, packaging and any special requirements.',
    aVi: 'Thông thường từ 2 đến 4 tuần, tùy thuộc vào khối lượng đơn hàng, quy cách đóng gói và các yêu cầu đặc biệt khác.',
  },
];
