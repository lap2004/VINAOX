import { CATALOG_CATEGORIES, type CatalogCategoryDefinition } from '../shared/catalogCategories.js';

export type CertificationScopeType =
  | 'product'
  | 'facility'
  | 'management-system'
  | 'registration'
  | 'audit';

export interface ProductCertificationRef {
  certificateId: string;
  nameVi: string;
  nameEn: string;
  nameKo?: string;
  nameZh?: string;
  scopeType: CertificationScopeType;
  scopeVi: string;
  scopeEn: string;
  scopeKo?: string;
  scopeZh?: string;
  documentUrl?: string;
}

export interface LocalizedLabel {
  vi: string;
  en: string;
  ko?: string;
  zh?: string;
}

export interface ProductFeatureItem {
  id: string;
  label: LocalizedLabel;
}

export interface ProductSpecs {
  moisture: string;
  brix: string;
  sizeOrWeightVi?: string;
  sizeOrWeightEn?: string;
  sizeOrWeightKo?: string;
  sizeOrWeightZh?: string;
  shelfLifeEn: string;
  shelfLifeVi: string;
  shelfLifeKo?: string;
  shelfLifeZh?: string;
  storageEn: string;
  storageVi: string;
  storageKo?: string;
  storageZh?: string;
  ingredientsEn: string;
  ingredientsVi: string;
  ingredientsKo?: string;
  ingredientsZh?: string;
  processEn: string;
  processVi: string;
  processKo?: string;
  processZh?: string;
  packagingEn: string;
  packagingVi: string;
  packagingKo?: string;
  packagingZh?: string;
  certificationsEn: string;
  certificationsVi: string;
  certificationsKo?: string;
  certificationsZh?: string;
}

export interface ProductLocalizedContent {
  name: string;
  desc: string;
  origin: string;
  features: string;
}

export type ProductCategory = 'soft-dried' | 'chips' | 'nuts-seeds' | 'mixed';

export interface ProductItem {
  id: string;
  slug: string;
  aliases?: string[];
  name: string;
  nameVi: string;
  nameKo?: string;
  nameZh?: string;
  category: ProductCategory;
  categoryLabelEn: string;
  categoryLabelVi: string;
  categoryLabelKo?: string;
  categoryLabelZh?: string;
  image: string;
  imageWebp: string;
  imageJpg: string;
  shortDescription: string;
  shortDescriptionVi: string;
  shortDescriptionKo?: string;
  shortDescriptionZh?: string;
  description: string;
  descriptionVi: string;
  descriptionKo?: string;
  descriptionZh?: string;
  origin?: string;
  originVi?: string;
  originKo?: string;
  originZh?: string;
  certifications?: string[];
  productCertifications?: ProductCertificationRef[];
  productFeatures?: ProductFeatureItem[];
  verified: boolean;
  ocop: string;
  specs: ProductSpecs;
  en: ProductLocalizedContent;
  vi: ProductLocalizedContent;
  ko?: ProductLocalizedContent;
  zh?: ProductLocalizedContent;
  seoTitleVi?: string;
  seoTitleEn?: string;
  seoDescriptionVi?: string;
  seoDescriptionEn?: string;
  imageAltVi?: string;
  imageAltEn?: string;
  published?: boolean;
  status?: 'published' | 'draft';
  // Compatibility aliases between snake_case CMS models and camelCase site models
  name_vi?: string;
  name_en?: string;
  name_ko?: string;
  name_zh?: string;
  description_vi?: string;
  description_en?: string;
  description_ko?: string;
  description_zh?: string;
  origin_vi?: string;
  origin_en?: string;
  origin_ko?: string;
  origin_zh?: string;
  shelf_life?: string;
  packaging?: string;
  order?: number;
  featured?: boolean;
  featuredOrder?: number;
}

const BASE_PRODUCTS_DATA: ProductItem[] = [
  // 01 — Soft Dried Red Dragonfruit
  {
    id: "soft-dried-red-dragonfruit",
    slug: "soft-dried-red-dragonfruit",
    aliases: ["dried-dragon-fruit"],
    name: "Soft Dried Red Dragonfruit",
    nameVi: "Thanh long ruột đỏ sấy dẻo",
    category: "soft-dried",
    categoryLabelEn: "Soft-Dried Fruits",
    categoryLabelVi: "Trái cây sấy dẻo",
    image: "/images/products/soft-dried-red-dragonfruit.webp",
    imageWebp: "/images/products/soft-dried-red-dragonfruit.webp",
    imageJpg: "/images/products/soft-dried-red-dragonfruit.jpg",
    shortDescription: "Vibrant ruby-red slices with gentle natural sweetness and characteristic crunchy seeds.",
    shortDescriptionVi: "Sắc đỏ tím tự nhiên, vị ngọt thanh dịu nhẹ hòa quyện cùng hạt giòn li ti đặc trưng.",
    description: "Sourced from Cho Gao, Tien Giang, our red dragonfruit is gently low-temperature dehydrated to retain its natural vibrant color, rich betacyanin antioxidants, dietary fiber, and authentic tropical taste without artificial coloring or added sugar.",
    descriptionVi: "Được tuyển chọn từ vùng chuyên canh thanh long ruột đỏ Chợ Gạo (Tiền Giang). Quy trình sấy dẻo nhiệt thấp tuần hoàn giúp giữ trọn sắc đỏ tím tự nhiên, hàm lượng betacyanin chống oxy hóa và vị ngọt thanh nhẹ tự nhiên không qua phẩm màu.",
    origin: "Cho Gao, Tien Giang Orchards",
    originVi: "Vùng trồng Chợ Gạo, Tiền Giang",
    certifications: ["OCOP 3-Star Tien Giang", "BRCGS Facility", "Clean Label"],
    verified: true,
    ocop: "3-Star OCOP",
    specs: {
      moisture: "< 16%",
      brix: "50° - 55° Brix",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Cool, dry place (20 - 25°C), away from direct sunlight",
      storageVi: "Nơi khô ráo, thoáng mát (20 - 25°C), tránh ánh nắng trực tiếp",
      ingredientsEn: "100% Fresh Cho Gao Red Flesh Dragon Fruit, zero added sugar, no artificial color",
      ingredientsVi: "100% Thanh long ruột đỏ Chợ Gạo tươi chín cây, không phẩm màu, không chất bảo quản",
      processEn: "Low-temperature convective heat-pump drying (~50 - 55°C) preserving natural ruby anthocyanin pigments",
      processVi: "Sấy bơm nhiệt nhiệt độ thấp tuần hoàn (~50 - 55°C) bảo toàn sắc tố tự nhiên và vi chất",
      packagingEn: "Zip pouch 100g, 250g, 500g / Master export carton 5kg, 10kg with N2 flushing / OEM",
      packagingVi: "Túi zip 100g, 250g, 500g / Thùng carton xuất khẩu 5kg, 10kg nạp khí Nitơ / OEM",
      certificationsEn: "3-Star OCOP Tien Giang, BRCGS Grade B Facility, Clean Label",
      certificationsVi: "OCOP 3 Sao Tiền Giang, Nhà máy chuẩn BRCGS Grade B, Clean Label"
    },
    en: {
      name: "Soft Dried Red Dragonfruit",
      desc: "Vibrant ruby-red slices with gentle natural sweetness and characteristic crunchy seeds.",
      origin: "Cho Gao, Tien Giang Orchards",
      features: "OCOP 3-Star certified. Premium red-flesh dragon fruit from Cho Gao, Tien Giang. Gently dehydrated to preserve natural color, betacyanin antioxidants, and fiber."
    },
    vi: {
      name: "Thanh long ruột đỏ sấy dẻo",
      desc: "Sắc đỏ tím tự nhiên, vị ngọt thanh dịu nhẹ hòa quyện cùng hạt giòn li ti đặc trưng.",
      origin: "Vùng trồng Chợ Gạo, Tiền Giang",
      features: "Sản phẩm đạt chuẩn OCOP 3 sao Tiền Giang. Nguyên liệu thanh long ruột đỏ tươi Chợ Gạo, công nghệ sấy nhiệt thấp bảo tồn sắc tím đỏ tự nhiên, giàu chất chống oxy hóa và vitamin C."
    }
  },

  // 02 — Banana Chips
  {
    id: "banana-chips",
    slug: "banana-chips",
    aliases: ["dried-banana"],
    name: "Banana Chips",
    nameVi: "Chuối sấy giòn",
    category: "chips",
    categoryLabelEn: "Fruit Chips",
    categoryLabelVi: "Trái cây sấy giòn",
    image: "/images/products/banana-chips.webp",
    imageWebp: "/images/products/banana-chips.webp",
    imageJpg: "/images/products/banana-chips.jpg",
    shortDescription: "Golden, crispy banana slices with natural honeyed fragrance and light crunch.",
    shortDescriptionVi: "Lát chuối vàng ươm, giòn rụm thơm lừng hương chuối chín tự nhiên.",
    description: "Prepared from ripe Mekong Delta bananas, modern crisping technology ensures an irresistibly crunchy texture while preserving the fruit's natural sweetness, potassium, and wholesome minerals.",
    descriptionVi: "Được chế biến từ chuối chín tự nhiên của vùng đồng bằng sông Cửu Long. Công nghệ sấy giòn hiện đại giúp từng lát chuối giữ độ giòn xốp tự nhiên, mùi thơm ngọt ngào đặc trưng và giàu kali.",
    origin: "Mekong Delta Orchards",
    originVi: "Vùng chuối ĐBSCL",
    certifications: ["BRCGS Facility", "Clean Label", "Export Standard"],
    verified: true,
    ocop: "Export Standard",
    specs: {
      moisture: "< 5%",
      brix: "Natural banana sweetness",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Cool, dry place, seal tightly after opening",
      storageVi: "Nơi khô ráo thoáng mát, giữ kín miệng túi sau khi mở",
      ingredientsEn: "100% Selected ripe banana, refined vegetable oil",
      ingredientsVi: "100% Chuối chín tự nhiên tuyển chọn, dầu thực vật tinh luyện",
      processEn: "Low-temperature vacuum crisping with high-efficiency centrifugal de-oiling",
      processVi: "Chiên sấy chân không nhiệt thấp kết hợp ly tâm tách dầu triệt để",
      packagingEn: "Zip pouch 100g, 250g, 500g / Bulk carton 10kg",
      packagingVi: "Túi zip 100g, 250g, 500g / Thùng xá 10kg",
      certificationsEn: "BRCGS Grade B Facility, Clean Label, Export Quality",
      certificationsVi: "Nhà máy chuẩn BRCGS Grade B, Clean Label, Đạt chuẩn xuất khẩu"
    },
    en: {
      name: "Banana Chips",
      desc: "Golden, crispy banana slices with natural honeyed fragrance and light crunch.",
      origin: "Mekong Delta Orchards",
      features: "Naturally sweet and crunchy. Processed with advanced vacuum technology to retain rich potassium, dietary fiber, and natural banana aroma."
    },
    vi: {
      name: "Chuối sấy giòn",
      desc: "Lát chuối vàng ươm, giòn rụm thơm lừng hương chuối chín tự nhiên.",
      origin: "Vùng chuối ĐBSCL",
      features: "Chế biến từ chuối chín cây ĐBSCL. Sấy chân không nhiệt thấp giữ vị ngọt dịu tự nhiên, giòn tan, giàu kali và chất xơ có lợi cho sức khỏe."
    }
  },

  // 03 — Cashew
  {
    id: "cashew",
    slug: "cashew",
    name: "Cashew",
    nameVi: "Hạt điều",
    category: "nuts-seeds",
    categoryLabelEn: "Nuts & Seeds",
    categoryLabelVi: "Hạt dinh dưỡng",
    image: "/images/products/cashew.webp",
    imageWebp: "/images/products/cashew.webp",
    imageJpg: "/images/products/cashew.jpg",
    shortDescription: "Premium roasted Vietnamese cashews, delightfully crunchy with a buttery nutty finish.",
    shortDescriptionVi: "Hạt điều Bình Phước tuyển chọn, rang thơm bùi béo ngậy tự nhiên.",
    description: "Renowned globally for superior flavor and texture, our Binh Phuoc whole cashews are carefully roasted to golden perfection, packed with heart-healthy monounsaturated fats, protein, and essential minerals.",
    descriptionVi: "Hạt điều chuẩn xuất khẩu từ thủ phủ Bình Phước. Từng mẻ hạt được phân loại kích thước đều đặn, rang chín tới giữ trọn độ giòn, béo bùi tự nhiên, dồi dào chất béo không bão hòa và khoáng chất.",
    origin: "Binh Phuoc, Vietnam",
    originVi: "Bình Phước, Việt Nam",
    certifications: ["BRCGS Facility", "ISO 22000", "Export Standard"],
    verified: true,
    ocop: "Export Standard",
    specs: {
      moisture: "< 5%",
      brix: "Natural nutty flavor",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Store in a cool, dry place away from heat and moisture",
      storageVi: "Bảo quản nơi khô ráo, thoáng mát, tránh nhiệt độ cao và ẩm ướt",
      ingredientsEn: "100% Grade A Vietnamese Cashew Kernels (W240 / W320)",
      ingredientsVi: "100% Nhân hạt điều Bình Phước chuẩn loại A (W240 / W320)",
      processEn: "Gentle hot-air roasting under controlled thermal curve without excessive oil",
      processVi: "Rang sấy nhiệt phong tuần hoàn kiểm soát nhiệt độ, không chiên ngập dầu",
      packagingEn: "Vacuum pouch / Nitrogen-flushed can 250g, 500g / Bulk vacuum box 10kg, 22.68kg",
      packagingVi: "Túi hút chân không / Lon nạp khí Nitơ 250g, 500g / Thùng chân không 10kg, 22.68kg",
      certificationsEn: "BRCGS Facility, ISO 22000:2018, HACCP Certified",
      certificationsVi: "Nhà máy chuẩn BRCGS, ISO 22000:2018, Đạt chuẩn HACCP"
    },
    en: {
      name: "Vietnamese Roasted Cashew",
      desc: "Premium roasted Vietnamese cashews, delightfully crunchy with a buttery nutty finish.",
      origin: "Binh Phuoc, Vietnam",
      features: "Sourced from the famous Binh Phuoc cashew terroir. Whole kernels roasted to perfection, delivering rich plant proteins, zinc, and healthy unsaturated fatty acids."
    },
    vi: {
      name: "Hạt điều Bình Phước",
      desc: "Hạt điều Bình Phước tuyển chọn, rang thơm bùi béo ngậy tự nhiên.",
      origin: "Bình Phước, Việt Nam",
      features: "Hạt điều loại 1 xuất xứ Bình Phước. Hạt chắc mẩy, rang sấy công nghệ cao giữ trọn độ ngậy béo, thơm ngon đặc trưng và dồi dào dinh dưỡng."
    }
  },

  // 04 — Soft Dried Jackfruit
  {
    id: "soft-dried-jackfruit",
    slug: "soft-dried-jackfruit",
    aliases: ["dried-jackfruit"],
    name: "Soft Dried Jackfruit",
    nameVi: "Mít sấy dẻo",
    category: "soft-dried",
    categoryLabelEn: "Soft-Dried Fruits",
    categoryLabelVi: "Trái cây sấy dẻo",
    image: "/images/products/soft-dried-jackfruit.webp",
    imageWebp: "/images/products/soft-dried-jackfruit.webp",
    imageJpg: "/images/products/soft-dried-jackfruit.jpg",
    shortDescription: "Thick golden Thai jackfruit segments, naturally fragrant with a soft, chewy texture.",
    shortDescriptionVi: "Múi mít vàng óng ả, thơm nồng nàn hương mít nhiệt đới, dẻo mềm mọng vị.",
    description: "Prepared from premium Thai jackfruit harvested in Tien Giang and Hau Giang orchards. Low-temperature convective drying preserves the authentic sweet aroma, succulent chewy texture, and natural vitamins.",
    descriptionVi: "Tuyển chọn từ giống mít Thái tươi chín cây tại Tiền Giang và Hậu Giang. Công nghệ sấy dẻo nhiệt thấp tuần hoàn giữ nguyên màu vàng óng, thớ mít dẻo mềm thơm ngát và vị ngọt tự nhiên không qua ướp đường.",
    origin: "Tien Giang & Hau Giang Orchards",
    originVi: "Vùng mít Tiền Giang & Hậu Giang",
    certifications: ["OCOP 3-Star Tien Giang", "BRCGS Facility", "BSCI"],
    verified: true,
    ocop: "3-Star OCOP",
    specs: {
      moisture: "< 15%",
      brix: "60° - 65° Brix",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Cool, dry environment, keep tightly sealed after opening",
      storageVi: "Nơi khô ráo thoáng mát, đóng kín miệng túi sau khi mở",
      ingredientsEn: "100% Tree-ripened Thai jackfruit, zero cholesterol, no artificial preservatives",
      ingredientsVi: "100% Mít Thái tươi chín cây tuyển chọn, không cholesterol, không phẩm màu",
      processEn: "Gentle low-temperature convective drying (~55 - 60°C) preserving juicy fibers",
      processVi: "Sấy dẻo nhiệt thấp tuần hoàn (~55 - 60°C) bảo toàn thớ múi dẻo thơm tự nhiên",
      packagingEn: "Zip pouch 100g, 250g, 500g / Export Master carton 5kg, 10kg",
      packagingVi: "Túi zip 100g, 250g, 500g / Thùng carton xuất khẩu 5kg, 10kg",
      certificationsEn: "3-Star OCOP Tien Giang, BRCGS Grade B Facility, Clean Label",
      certificationsVi: "OCOP 3 Sao Tiền Giang, Nhà máy chuẩn BRCGS Grade B, Clean Label"
    },
    en: {
      name: "Naturally Soft-Dried Jackfruit",
      desc: "Thick golden Thai jackfruit segments, naturally fragrant with a soft, chewy texture.",
      origin: "Tien Giang & Hau Giang Orchards",
      features: "OCOP 3-Star certified. Tree-ripened Thai jackfruit from Mekong riverbanks. Dehydrated at low temperatures to lock in juicy texture and rich tropical aroma."
    },
    vi: {
      name: "Mít sấy dẻo tự nhiên",
      desc: "Múi mít vàng óng ả, thơm nồng nàn hương mít nhiệt đới, dẻo mềm mọng vị.",
      origin: "Vùng mít Tiền Giang & Hậu Giang",
      features: "Sản phẩm OCOP 3 sao Tiền Giang. Tuyển chọn từ mít Thái chín cây ĐBSCL, công nghệ sấy dẻo nhiệt thấp giúp giữ trọn màu vàng tươi, độ ngọt thanh mát và thớ mít dẻo ngon."
    }
  },

  // 05 — Mango Chips
  {
    id: "mango-chips",
    slug: "mango-chips",
    name: "Mango Chips",
    nameVi: "Xoài sấy giòn",
    category: "chips",
    categoryLabelEn: "Fruit Chips",
    categoryLabelVi: "Trái cây sấy giòn",
    image: "/images/products/mango-chips.webp",
    imageWebp: "/images/products/mango-chips.webp",
    imageJpg: "/images/products/mango-chips.jpg",
    shortDescription: "Crisp and airy mango slices delivering an enticing sweet-tart tropical burst.",
    shortDescriptionVi: "Lát xoài giòn tan, vị chua ngọt hài hòa bùng nổ hương vị nhiệt đới.",
    description: "Crafted from fresh Mekong Delta mangoes, our mango chips undergo high-precision vacuum crisping that produces a clean, brittle snap while retaining true mango flavor and vibrant sunny color.",
    descriptionVi: "Được sản xuất từ xoài tươi đồng bằng sông Cửu Long. Quy trình chiên sấy chân không hiện đại tạo nên lát xoài giòn xốp hấp dẫn, vị chua ngọt tự nhiên hài hòa và màu vàng tươi đẹp mắt.",
    origin: "Mekong Delta Orchards",
    originVi: "Vùng xoài ĐBSCL",
    certifications: ["BRCGS Facility", "Clean Label", "Export Standard"],
    verified: true,
    ocop: "Export Standard",
    specs: {
      moisture: "< 5%",
      brix: "Natural mango sweet-tart profile",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Store in a dry, cool place; reseal immediately after use",
      storageVi: "Bảo quản nơi khô mát; đóng kín khóa zip ngay sau khi sử dụng",
      ingredientsEn: "Fresh selected mango (98%), refined vegetable oil",
      ingredientsVi: "Xoài tươi tuyển chọn (98%), dầu thực vật tinh luyện",
      processEn: "Low-temperature vacuum crisping with centrifugal oil extraction",
      processVi: "Sấy chân không nhiệt thấp kết hợp công nghệ ly tâm tách dầu",
      packagingEn: "Aluminium foil zip pouch 50g, 100g, 200g / Master carton 10kg",
      packagingVi: "Túi nhôm zipper 50g, 100g, 200g / Thùng carton xuất khẩu 10kg",
      certificationsEn: "BRCGS Facility, Clean Label, Export Standard",
      certificationsVi: "Nhà máy chuẩn BRCGS, Clean Label, Tiêu chuẩn xuất khẩu"
    },
    en: {
      name: "Crispy Mango Chips",
      desc: "Crisp and airy mango slices delivering an enticing sweet-tart tropical burst.",
      origin: "Mekong Delta Orchards",
      features: "Carefully produced from fresh Mekong mangoes. Light, crispy texture with vibrant natural golden color and refreshing sweet-tart taste."
    },
    vi: {
      name: "Xoài sấy giòn",
      desc: "Lát xoài giòn tan, vị chua ngọt hài hòa bùng nổ hương vị nhiệt đới.",
      origin: "Vùng xoài ĐBSCL",
      features: "Được sản xuất từ xoài tươi ĐBSCL. Từng lát xoài giòn tan rụm, lưu giữ trọn vẹn hương vị chua ngọt nhiệt đới độc đáo mà không ngấy dầu."
    }
  },

  // 06 — Macadamia Nuts
  {
    id: "macadamia-nuts",
    slug: "macadamia-nuts",
    name: "Macadamia Nuts",
    nameVi: "Hạt mắc ca",
    category: "nuts-seeds",
    categoryLabelEn: "Nuts & Seeds",
    categoryLabelVi: "Hạt dinh dưỡng",
    image: "/images/products/macadamia-nuts.webp",
    imageWebp: "/images/products/macadamia-nuts.webp",
    imageJpg: "/images/products/macadamia-nuts.jpg",
    shortDescription: "Central Highlands macadamia nuts, naturally creamy and rich in essential fatty acids.",
    shortDescriptionVi: "Mắc ca Tây Nguyên nứt vỏ tự nhiên, nhân tròn đầy, béo ngậy thanh tao.",
    description: "Harvested from volcanic basalt soil in Vietnam's Central Highlands, our premium macadamias feature smooth, creamy kernels packed with heart-healthy monounsaturated fats and essential antioxidants.",
    descriptionVi: "Hạt mắc ca thượng hạng sinh trưởng trên đất đỏ bazan màu mỡ vùng Tây Nguyên. Hạt được sấy nứt vỏ tự nhiên, nhân trắng ngà tròn trịa, béo bùi thanh thoát và dồi dào axit béo Omega-7 quý giá.",
    origin: "Central Highlands, Vietnam",
    originVi: "Tây Nguyên, Việt Nam",
    certifications: ["Premium Grade", "ISO 22000", "Clean Label"],
    verified: true,
    ocop: "Premium Grade",
    specs: {
      moisture: "< 3%",
      brix: "Rich buttery profile",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Cool, dry place away from heat and light",
      storageVi: "Nơi thoáng mát, khô ráo, tránh ánh sáng trực tiếp",
      ingredientsEn: "100% In-shell cracked Vietnamese Macadamia Nuts (with shell-opening key)",
      ingredientsVi: "100% Hạt mắc ca nứt vỏ Tây Nguyên tuyển chọn (kèm dụng cụ tách vỏ)",
      processEn: "Low-temperature multi-stage hot-air drying to preserve delicate healthy oils",
      processVi: "Sấy nhiệt thấp đa tầng kiểm soát độ ẩm, bảo toàn trọn vẹn tinh dầu quý",
      packagingEn: "Zip pouch / PET jar 250g, 500g / Master carton 10kg",
      packagingVi: "Túi zip / Hộp PET 250g, 500g / Thùng xuất khẩu 10kg",
      certificationsEn: "ISO 22000:2018, HACCP, Clean Label",
      certificationsVi: "ISO 22000:2018, HACCP, Clean Label"
    },
    en: {
      name: "Vietnamese Macadamia Nuts",
      desc: "Central Highlands macadamia nuts, naturally creamy and rich in essential fatty acids.",
      origin: "Central Highlands, Vietnam",
      features: "Grown in high-altitude volcanic basalt soils. Shells are mechanically cracked for effortless peeling, revealing fresh, buttery, nutrient-dense kernels."
    },
    vi: {
      name: "Hạt mắc ca Tây Nguyên",
      desc: "Mắc ca Tây Nguyên nứt vỏ tự nhiên, nhân tròn đầy, béo ngậy thanh tao.",
      origin: "Tây Nguyên, Việt Nam",
      features: "Vùng nguyên liệu đại ngàn Tây Nguyên. Hạt sấy nứt vỏ dễ tách, giữ nguyên độ tươi mới, nhân giòn bùi ngậy béo tự nhiên và giàu dưỡng chất cho tim mạch."
    }
  },

  // 07 — Soft Dried Mango
  {
    id: "soft-dried-mango",
    slug: "soft-dried-mango",
    aliases: ["dried-mango"],
    name: "Soft Dried Mango",
    nameVi: "Xoài sấy dẻo",
    category: "soft-dried",
    categoryLabelEn: "Soft-Dried Fruits",
    categoryLabelVi: "Trái cây sấy dẻo",
    image: "/images/products/soft-dried-mango.webp",
    imageWebp: "/images/products/soft-dried-mango.webp",
    imageJpg: "/images/products/soft-dried-mango.jpg",
    shortDescription: "Premium Cat Chu and Hoa Loc mangoes, gently dehydrated with a soft, chewy texture.",
    shortDescriptionVi: "Tuyển chọn từ xoài Cát Chu & Cát Hòa Lộc, dẻo mềm mọng vị, ngọt thanh tự nhiên.",
    description: "Carefully sourced from Dong Thap and Tien Giang orchards, using premium Cat Chu and Cat Hoa Loc varieties. Low-temperature convective drying (~60°C) locks in the sunny golden color, chewy succulent texture, and rich vitamins A & C without added refined sugar.",
    descriptionVi: "Được tuyển chọn từ giống xoài danh tiếng Cát Chu và Cát Hòa Lộc tại vựa xoài Đồng Tháp và Tiền Giang. Công nghệ sấy dẻo nhiệt thấp tuần hoàn (~60°C) giúp giữ nguyên sắc vàng óng ả, cấu trúc dẻo thơm mọng vị và hàm lượng vitamin A, C tự nhiên.",
    origin: "Dong Thap & Tien Giang Orchards",
    originVi: "Vùng xoài Đồng Tháp & Tiền Giang",
    certifications: ["OCOP 3-Star Tien Giang", "BRCGS Grade B Facility", "BSCI"],
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
      certificationsEn: "3-Star OCOP Tien Giang, BRCGS Grade B Facility, BSCI Social Compliance",
      certificationsVi: "OCOP 3 Sao Tiền Giang, Nhà máy chuẩn BRCGS Grade B, Tuân thủ BSCI"
    },
    en: {
      name: "Naturally Soft-Dried Mango",
      desc: "Premium Cat Chu and Hoa Loc mangoes, gently dehydrated with a soft, chewy texture.",
      origin: "Dong Thap & Tien Giang Orchards",
      features: "OCOP 3-Star certified. Carefully sliced from premium Cat Chu and selected mangoes. Low-temperature dried (~60°C) to preserve bright natural color, dietary fiber, and vitamins A & C."
    },
    vi: {
      name: "Xoài sấy dẻo tự nhiên",
      desc: "Tuyển chọn từ xoài Cát Chu & Cát Hòa Lộc, dẻo mềm mọng vị, ngọt thanh tự nhiên.",
      origin: "Vùng xoài Đồng Tháp & Tiền Giang",
      features: "Sản phẩm đạt chuẩn OCOP 3 sao Tiền Giang. Chế biến từ xoài Cát Chu và Cát Hòa Lộc ĐBSCL. Công nghệ sấy dẻo nhiệt thấp (~60°C) giữ trọn sắc vàng óng, cấu trúc dẻo thơm và vitamin A, C tự nhiên."
    }
  },

  // 08 — Jackfruit Chips
  {
    id: "jackfruit-chips",
    slug: "jackfruit-chips",
    name: "Jackfruit Chips",
    nameVi: "Mít sấy giòn",
    category: "chips",
    categoryLabelEn: "Fruit Chips",
    categoryLabelVi: "Trái cây sấy giòn",
    image: "/images/products/jackfruit-chips.webp",
    imageWebp: "/images/products/jackfruit-chips.webp",
    imageJpg: "/images/products/jackfruit-chips.jpg",
    shortDescription: "Crispy golden jackfruit chips with rich tropical sweetness and signature aroma.",
    shortDescriptionVi: "Múi mít vàng ruộm giòn tan, thơm nức hương vị nhiệt đới ngọt ngào đặc trưng.",
    description: "Made from fresh ripe Thai jackfruit sourced from Tien Giang. Advanced vacuum frying and centrifugal oil extraction deliver an exceptionally crispy crunch with zero excess oil, capturing full authentic jackfruit flavor.",
    descriptionVi: "Được sản xuất từ múi mít Thái tươi chín cây tại Tiền Giang. Công nghệ chiên sấy chân không kết hợp ly tâm tách dầu triệt để giúp từng múi mít giòn rụm, ngọt đậm đà tự nhiên mà không hề ngấy.",
    origin: "Tien Giang, Vietnam",
    originVi: "Tiền Giang, Việt Nam",
    certifications: ["BRCGS Facility", "Clean Label", "Export Standard"],
    verified: true,
    ocop: "Export Standard",
    specs: {
      moisture: "< 5%",
      brix: "Natural jackfruit sweetness",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Cool, dry place, seal tightly after opening",
      storageVi: "Bảo quản nơi khô ráo thoáng mát, đậy kín sau khi mở bao bì",
      ingredientsEn: "Fresh ripe Thai jackfruit (98%), refined vegetable oil",
      ingredientsVi: "Mít Thái tươi chín cây (98%), dầu thực vật tinh luyện",
      processEn: "Low-temperature vacuum drying with high-speed centrifugal oil separation",
      processVi: "Chiên sấy chân không nhiệt thấp và ly tâm tách dầu công nghệ cao",
      packagingEn: "Zip pouch 100g, 250g, 500g / Bulk master carton 10kg",
      packagingVi: "Túi zip 100g, 250g, 500g / Thùng carton xuất khẩu 10kg",
      certificationsEn: "BRCGS Grade B Facility, Clean Label, Export Standard",
      certificationsVi: "Nhà máy chuẩn BRCGS Grade B, Clean Label, Tiêu chuẩn xuất khẩu"
    },
    en: {
      name: "Crispy Jackfruit Chips",
      desc: "Crispy golden jackfruit chips with rich tropical sweetness and signature aroma.",
      origin: "Tien Giang, Vietnam",
      features: "Prepared from ripe Tien Giang Thai jackfruit. Ultra-crispy bite with irresistible natural fragrance, zero cholesterol, and low fat."
    },
    vi: {
      name: "Mít sấy giòn",
      desc: "Múi mít vàng ruộm giòn tan, thơm nức hương vị nhiệt đới ngọt ngào đặc trưng.",
      origin: "Tiền Giang, Việt Nam",
      features: "Chế biến từ mít Thái tươi chín cây Tiền Giang. Công nghệ sấy giòn hiện đại giữ trọn sắc vàng tự nhiên, hương thơm ngát và độ giòn xốp mê ly."
    }
  },

  // 09 — Walnuts
  {
    id: "walnuts",
    slug: "walnuts",
    name: "Walnuts",
    nameVi: "Hạt óc chó",
    category: "nuts-seeds",
    categoryLabelEn: "Nuts & Seeds",
    categoryLabelVi: "Hạt dinh dưỡng",
    image: "/images/products/walnuts.webp",
    imageWebp: "/images/products/walnuts.webp",
    imageJpg: "/images/products/walnuts.jpg",
    shortDescription: "Nutritious whole walnut halves, gently roasted with a subtle nutty crunch.",
    shortDescriptionVi: "Nhân quả óc chó tuyển chọn hạt to đều, giòn bùi và giàu dưỡng chất vàng cho trí não.",
    description: "Carefully sorted and lightly roasted walnut halves providing clean, nutty richness. Abundant in plant-based Omega-3 ALA, polyphenols, and essential minerals for daily wellness.",
    descriptionVi: "Nhân óc chó tuyển chọn đồng đều kích thước, được xử lý nhiệt nhẹ để giữ độ giòn thơm tự nhiên mà không làm biến tính các axit béo quý. Dồi dào Omega-3 thực vật, chất chống oxy hóa và khoáng chất.",
    origin: "Selected Premium Grade",
    originVi: "Nguồn nguyên liệu chọn lọc cao cấp",
    certifications: ["Premium Grade", "ISO 22000", "Clean Label"],
    verified: true,
    ocop: "Premium Grade",
    specs: {
      moisture: "< 5%",
      brix: "Natural nutty profile",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Cool, dry place (15 - 20°C); refrigerate after opening to preserve freshness",
      storageVi: "Nơi khô mát (15 - 20°C); nên để ngăn mát sau khi mở để giữ độ tươi ngon",
      ingredientsEn: "100% Selected Premium Walnut Kernels (Light Halves 80%)",
      ingredientsVi: "100% Nhân quả óc chó tuyển chọn (Nửa hạt nguyên vẹn)",
      processEn: "Low-temperature thermal convection drying to stabilize omega fatty acids",
      processVi: "Sấy đối lưu nhiệt thấp bảo toàn vi chất và chống ôi dầu",
      packagingEn: "Nitrogen-flushed foil pouch / Tin 200g, 400g / Master carton 10kg",
      packagingVi: "Túi nhôm nạp khí Nitơ / Lon 200g, 400g / Thùng carton 10kg",
      certificationsEn: "ISO 22000, HACCP, Clean Label",
      certificationsVi: "ISO 22000, HACCP, Clean Label"
    },
    en: {
      name: "Premium Walnut Kernels",
      desc: "Nutritious whole walnut halves, gently roasted with a subtle nutty crunch.",
      origin: "Selected Premium Grade",
      features: "Selected whole halves packed with plant-derived Omega-3 (ALA), vitamin E, and polyphenols. Perfectly roasted for snacking and premium culinary use."
    },
    vi: {
      name: "Hạt óc chó cao cấp",
      desc: "Nhân quả óc chó tuyển chọn hạt to đều, giòn bùi và giàu dưỡng chất vàng cho trí não.",
      origin: "Nguồn nguyên liệu chọn lọc cao cấp",
      features: "Hạt óc chó nhân nguyên nửa hạt cao cấp. Rang sấy nhiệt thấp bảo vệ lượng Omega-3 và chất chống oxy hóa dồi dào, vị bùi béo tự nhiên."
    }
  },

  // 10 — Soft Dried Papaya
  {
    id: "soft-dried-papaya",
    slug: "soft-dried-papaya",
    name: "Soft Dried Papaya",
    nameVi: "Đu đủ sấy dẻo",
    category: "soft-dried",
    categoryLabelEn: "Soft-Dried Fruits",
    categoryLabelVi: "Trái cây sấy dẻo",
    image: "/images/products/soft-dried-papaya.webp",
    imageWebp: "/images/products/soft-dried-papaya.webp",
    imageJpg: "/images/products/soft-dried-papaya.jpg",
    shortDescription: "Tender, succulent papaya slices glowing with natural orange-red hue and mild sweetness.",
    shortDescriptionVi: "Từng lát đu đủ mềm dẻo mọng nước, sắc cam đỏ tự nhiên cùng vị ngọt dịu thanh mát.",
    description: "Sourced from fertile Mekong Delta alluvial soil, our ripe papayas are gently low-temperature dehydrated to preserve their luscious color, dietary fiber, beta-carotene, and natural digestive papain enzymes.",
    descriptionVi: "Tuyển chọn từ những trái đu đủ chín cây trên vùng đất phù sa trù phú ĐBSCL. Công nghệ sấy dẻo nhiệt thấp giúp lát đu đủ giữ trọn sắc cam đỏ rực rỡ, độ dẻo mềm mọng vị, giàu beta-carotene và enzym papain tự nhiên.",
    origin: "Mekong Delta Orchards",
    originVi: "Vùng trồng ĐBSCL",
    certifications: ["BRCGS Facility", "Clean Label", "Export Standard"],
    verified: true,
    ocop: "Export Standard",
    specs: {
      moisture: "< 16%",
      brix: "55° - 60° Brix",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Cool, dry place (20 - 25°C), away from direct sunlight",
      storageVi: "Nơi khô ráo, thoáng mát (20 - 25°C), tránh ánh nắng trực tiếp",
      ingredientsEn: "100% Ripe Mekong Delta Papaya, zero artificial colors, preservative-free",
      ingredientsVi: "100% Đu đủ chín cây ĐBSCL tươi ngon, không phẩm màu hóa học, không chất bảo quản",
      processEn: "Low-temperature convective heat-pump drying preserving beta-carotene and texture",
      processVi: "Sấy bơm nhiệt tuần hoàn nhiệt độ thấp bảo toàn sắc tố carotenoid và cấu trúc dẻo",
      packagingEn: "Zip pouch 100g, 250g, 500g / Master export carton 5kg, 10kg",
      packagingVi: "Túi zip 100g, 250g, 500g / Thùng carton xuất khẩu 5kg, 10kg",
      certificationsEn: "BRCGS Facility, Clean Label, Export Standard",
      certificationsVi: "Nhà máy chuẩn BRCGS, Clean Label, Tiêu chuẩn xuất khẩu"
    },
    en: {
      name: "Naturally Soft-Dried Papaya",
      desc: "Tender, succulent papaya slices glowing with natural orange-red hue and mild sweetness.",
      origin: "Mekong Delta Orchards",
      features: "Grown in nutrient-rich Mekong alluvial orchards. Gently dehydrated to preserve natural carotenoids, digestive enzymes, and pleasant fruity chew."
    },
    vi: {
      name: "Đu đủ sấy dẻo tự nhiên",
      desc: "Từng lát đu đủ mềm dẻo mọng nước, sắc cam đỏ tự nhiên cùng vị ngọt dịu thanh mát.",
      origin: "Vùng trồng ĐBSCL",
      features: "Thu hoạch từ đu đủ chín tươi ĐBSCL. Sấy dẻo nhiệt thấp bảo toàn vi chất dinh dưỡng, sắc cam tự nhiên bắt mắt, vị ngọt thanh và thớ dẻo thơm hấp dẫn."
    }
  },

  // 11 — Mix Fruits and Vegetables
  {
    id: "mix-fruits-and-vegetables",
    slug: "mix-fruits-and-vegetables",
    aliases: ["mixed-fruits-vegetables"],
    name: "Mix Fruits and Vegetables",
    nameVi: "Trái cây và rau củ sấy thập cẩm",
    category: "mixed",
    categoryLabelEn: "Mixed Products",
    categoryLabelVi: "Trái cây & rau củ sấy thập cẩm",
    image: "/images/products/mix-fruits-and-vegetables.webp",
    imageWebp: "/images/products/mix-fruits-and-vegetables.webp",
    imageJpg: "/images/products/mix-fruits-and-vegetables.jpg",
    shortDescription: "A colorful medley of crispy jackfruit, banana, sweet potatoes, taro, carrot, and green beans.",
    shortDescriptionVi: "Bản hòa tấu sắc màu giòn rụm từ mít, chuối, khoai lang vàng, khoai môn, cà rốt và đậu bắp.",
    description: "A wholesome blend of Vietnamese tropical fruits and highland root vegetables. Vacuum crisping delivers an enjoyable multi-texture snacking experience loaded with dietary fiber, vibrant natural colors, and zero artificial flavorings.",
    descriptionVi: "Sự kết hợp hoàn hảo giữa các loại trái cây nhiệt đới trứ danh và củ quả tươi nông sản Việt Nam. Công nghệ sấy chân không hiện đại tạo nên món ăn vặt giòn tan đa dạng hương vị, giàu chất xơ và hoàn toàn tự nhiên.",
    origin: "Mekong Delta & Da Lat Highlands",
    originVi: "ĐBSCL & Nông sản Đà Lạt",
    certifications: ["BRCGS Facility", "Clean Label", "Export Standard"],
    verified: true,
    ocop: "Export Standard",
    specs: {
      moisture: "< 5%",
      brix: "Natural mixed produce sweetness",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Cool, dry place; seal tightly after opening",
      storageVi: "Nơi khô mát, buộc kín miệng túi sau khi sử dụng để giữ độ giòn",
      ingredientsEn: "Jackfruit, banana, sweet potato, purple sweet potato, taro, carrot, green beans, vegetable oil",
      ingredientsVi: "Mít, chuối, khoai lang vàng, khoai lang tím, khoai môn, cà rốt, đậu bắp, dầu thực vật",
      processEn: "Low-temperature vacuum drying with high-speed centrifugal oil separation",
      processVi: "Chiên sấy chân không nhiệt thấp kết hợp công nghệ ly tâm tách dầu",
      packagingEn: "Zip pouch 150g, 250g, 500g / Master carton 10kg",
      packagingVi: "Túi zip 150g, 250g, 500g / Thùng carton 10kg",
      certificationsEn: "BRCGS Facility, Clean Label, Export Standard",
      certificationsVi: "Nhà máy chuẩn BRCGS, Clean Label, Đạt chuẩn xuất khẩu"
    },
    en: {
      name: "Mixed Dried Fruits & Vegetables",
      desc: "A colorful medley of crispy jackfruit, banana, sweet potatoes, taro, carrot, and green beans.",
      origin: "Mekong Delta & Da Lat Highlands",
      features: "A premium assortment of Vietnamese agricultural produce. Crispy, fiber-rich, and free from artificial flavorings or synthetic colorants."
    },
    vi: {
      name: "Trái cây & rau củ sấy thập cẩm",
      desc: "Bản hòa tấu sắc màu giòn rụm từ mít, chuối, khoai lang vàng, khoai môn, cà rốt và đậu bắp.",
      origin: "ĐBSCL & Nông sản Đà Lạt",
      features: "Tổng hòa tinh hoa nông sản Việt Nam. Từng miếng sấy giòn xốp tự nhiên, màu sắc bắt mắt, dồi dào chất xơ và vitamin có lợi cho sức khỏe."
    }
  },

  // 12 — Lotus Seeds
  {
    id: "lotus-seeds",
    slug: "lotus-seeds",
    name: "Lotus Seeds",
    nameVi: "Hạt sen",
    category: "nuts-seeds",
    categoryLabelEn: "Nuts & Seeds",
    categoryLabelVi: "Hạt dinh dưỡng",
    image: "/images/products/lotus-seeds.webp",
    imageWebp: "/images/products/lotus-seeds.webp",
    imageJpg: "/images/products/lotus-seeds.jpg",
    shortDescription: "Renowned Dong Thap lotus seeds, gently dried to a crisp bite with subtle nutty sweetness.",
    shortDescriptionVi: "Đặc sản hạt sen Đồng Tháp, sấy giòn bùi xốp, vị ngọt thanh tự nhiên thanh lọc cơ thể.",
    description: "Harvested from the pristine lotus heartland of Dong Thap, Vietnam. Delicately dried to produce a light, powdery crispness and soothing sweet-nutty flavor, packed with plant protein and calming traditional nutritional qualities.",
    descriptionVi: "Được thu hoạch từ thủ phủ sen Đồng Tháp danh tiếng. Từng hạt sen tròn mẩy được bóc vỏ, tách tâm và sấy giòn xốp nhẹ tênh, vị ngọt bùi thanh tao tự nhiên, giàu protein thực vật và khoáng chất an thần bổ dưỡng.",
    origin: "Dong Thap, Vietnam",
    originVi: "Đồng Tháp, Việt Nam",
    certifications: ["Dong Thap Specialty", "BRCGS Facility", "Clean Label"],
    verified: true,
    ocop: "Dong Thap Specialty",
    specs: {
      moisture: "< 6%",
      brix: "Delicate nutty sweetness",
      shelfLifeEn: "12 Months",
      shelfLifeVi: "12 Tháng",
      storageEn: "Store in a cool, dry place away from moisture and direct light",
      storageVi: "Bảo quản nơi khô ráo, thoáng mát, tránh ẩm ướt và ánh sáng trực tiếp",
      ingredientsEn: "100% Selected Dong Thap Lotus Seeds, zero artificial preservatives",
      ingredientsVi: "100% Hạt sen Đồng Tháp tươi tuyển chọn, không chất bảo quản",
      processEn: "Low-temperature vacuum drying preserving porous texture and delicate amino acids",
      processVi: "Sấy chân không nhiệt thấp giữ nguyên độ xốp giòn và dưỡng chất quý",
      packagingEn: "Zip pouch / Can 150g, 250g, 500g / Master carton 10kg",
      packagingVi: "Túi zip / Lon nắp nhôm 150g, 250g, 500g / Thùng carton 10kg",
      certificationsEn: "Dong Thap Geographic Specialty, BRCGS Facility, Clean Label",
      certificationsVi: "Đặc sản Đồng Tháp, Nhà máy chuẩn BRCGS, Clean Label"
    },
    en: {
      name: "Crispy Dong Thap Lotus Seeds",
      desc: "Renowned Dong Thap lotus seeds, gently dried to a crisp bite with subtle nutty sweetness.",
      origin: "Dong Thap, Vietnam",
      features: "Sourced from the famous lotus fields of Dong Thap. Crisp, light, and naturally sweet, celebrated for calming properties and pure nutritional value."
    },
    vi: {
      name: "Hạt sen sấy giòn Đồng Tháp",
      desc: "Đặc sản hạt sen Đồng Tháp, sấy giòn bùi xốp, vị ngọt thanh tự nhiên thanh lọc cơ thể.",
      origin: "Đồng Tháp, Việt Nam",
      features: "Đặc sản trứ danh từ đất sen hồng Đồng Tháp. Hạt sen sấy giòn xốp, thơm bùi thanh nhã, dồi dào dinh dưỡng bồi bổ sức khỏe."
    }
  }
];

import type { Language } from '../i18n/localize.js';

export const CATEGORY_LABELS: Record<ProductCategory, { vi: string; en: string; ko: string; zh: string }> =
  CATALOG_CATEGORIES.reduce(
    (
      acc: Record<ProductCategory, { vi: string; en: string; ko: string; zh: string }>,
      cat: CatalogCategoryDefinition
    ) => {
      acc[cat.id] = {
        vi: cat.name.vi,
        en: cat.name.en,
        ko: cat.name.ko || cat.name.en,
        zh: cat.name.zh || cat.name.en,
      };
      return acc;
    },
    {} as Record<ProductCategory, { vi: string; en: string; ko: string; zh: string }>
  );

export function getCategoryDefaultLabel(category: ProductCategory, lang: Language): string {
  const cat = CATEGORY_LABELS[category];
  if (!cat) return category;
  if (lang === 'vi') return cat.vi;
  if (lang === 'ko') return cat.ko;
  if (lang === 'zh-CN') return cat.zh;
  return cat.en;
}

export function hasApplicableBrix(brix?: string): boolean {
  if (!brix || typeof brix !== 'string') return false;
  const trimmed = brix.trim();
  return trimmed.length > 0 && (trimmed.includes('Brix') || trimmed.includes('°'));
}

function normalizeForDedupe(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s\u00A0]+/g, ' ')
    .replace(/[.,;:!?()[\]"'“”‘’•\-–—]/g, '')
    .trim();
}

/**
 * Prevents duplicate narrative paragraphs in cards and Product Detail Modal:
 * returns '' when secondary text duplicates or is contained within primary text.
 */
export function dedupeNarrative(primary?: string, secondary?: string): string {
  const p = (primary || '').trim();
  const s = (secondary || '').trim();
  if (!s) return '';
  if (!p) return s;
  const np = normalizeForDedupe(p);
  const ns = normalizeForDedupe(s);
  if (!ns || np === ns || np.includes(ns) || ns.includes(np)) {
    return '';
  }
  return s;
}

export const OCOP_3_STAR_CERT: ProductCertificationRef = {
  certificateId: 'ocop-3-star',
  nameVi: 'OCOP 3 Sao Tiền Giang',
  nameEn: '3-Star OCOP Tien Giang',
  nameKo: '베트남 OCOP 3성급 (띠엔장)',
  nameZh: '前江省 OCOP 三星认证',
  scopeType: 'product',
  scopeVi: 'Chứng nhận sản phẩm OCOP cấp tỉnh',
  scopeEn: 'Provincial Product Certification',
  scopeKo: '성(省) 정부 공식 제품 인증',
  scopeZh: '省级一乡一品产品认证'
};

interface ProductCatalogMeta {
  verifiedCerts: ProductCertificationRef[];
  features: ProductFeatureItem[];
  ocopLabel: string;
  brixOverride?: string;
  ko?: { name: string; shortDesc: string; desc: string; origin: string };
  zh?: { name: string; shortDesc: string; desc: string; origin: string };
}

const PRODUCT_CATALOG_META: Record<string, ProductCatalogMeta> = {
  'soft-dried-red-dragonfruit': {
    verifiedCerts: [OCOP_3_STAR_CERT],
    ocopLabel: '3-Star OCOP',
    features: [
      {
        id: 'soft-drying',
        label: {
          vi: 'Sấy dẻo nhiệt thấp (~50–55°C)',
          en: 'Low-heat drying (~50–55°C)',
          ko: '저온 순환 건조 (~50–55°C)',
          zh: '低温循环软烘 (~50–55°C)'
        }
      },
      {
        id: 'cho-gao-origin',
        label: {
          vi: 'Vùng trồng Chợ Gạo (Tiền Giang)',
          en: 'Cho Gao, Tien Giang origin',
          ko: '띠엔장성 쩌가오 특화 산지',
          zh: '前江省鹅贡核心产区'
        }
      },
      {
        id: 'no-colorant',
        label: {
          vi: 'Không phẩm màu & chất bảo quản',
          en: 'No artificial color or preservatives',
          ko: '인공 색소·방부제 무첨가',
          zh: '无人工色素与防腐剂'
        }
      }
    ],
    ko: {
      name: '소프트 건적색 용과',
      shortDesc: '선명한 천연 자줏빛과 은은한 단맛, 톡톡 씹히는 씨앗의 식감이 특징입니다.',
      desc: '띠엔장성 쩌가오(Cho Gao) 전문 산지의 적색 용과를 엄선해 저온 순환 건조 공법으로 가공했습니다. 인공 색소 없이 천연 자줏빛 색감과 베타시아닌 항산화 성분을 온전히 보존했습니다.',
      origin: '띠엔장성 쩌가오 농장'
    },
    zh: {
      name: '软烘红心火龙果干',
      shortDesc: '天然宝石红紫切片，清甜柔和，保留火龙果籽独特脆爽口感。',
      desc: '严选前江省鹅贡（Cho Gao）核心产区红心火龙果，采用低温热风循环软烘工艺，不添加人工色素，保留天然紫红色泽、甜菜红素与膳食纤维。',
      origin: '前江省鹅贡种植基地'
    }
  },
  'banana-chips': {
    verifiedCerts: [],
    ocopLabel: '',
    brixOverride: '',
    features: [
      {
        id: 'vacuum-crisp',
        label: {
          vi: 'Sấy giòn chân không & ly tâm tách dầu',
          en: 'Vacuum crisping & centrifugal de-oiling',
          ko: '저온 진공 크리스핑 & 원심 탈유',
          zh: '低温真空脆化与离心脱油'
        }
      },
      {
        id: 'low-moisture',
        label: {
          vi: 'Độ ẩm < 5%',
          en: 'Moisture < 5%',
          ko: '수분 함량 < 5%',
          zh: '水分含量 < 5%'
        }
      },
      {
        id: 'mekong-banana',
        label: {
          vi: 'Chuối chín ĐBSCL',
          en: 'Ripe Mekong Delta banana',
          ko: '메콩 델타 완숙 바나나',
          zh: '湄公河三角洲成熟香蕉'
        }
      }
    ],
    ko: {
      name: '바나나 칩',
      shortDesc: '황금빛 바삭한 슬라이스와 은은한 자연 바나나 향을 담았습니다.',
      desc: '메콩 델타산 완숙 바나나를 저온 진공 크리스핑 및 원심 탈유 공정으로 가공하여 바삭한 식감과 바나나 고유의 풍미를 살렸습니다.',
      origin: '베트남 메콩 델타'
    },
    zh: {
      name: '香脆香蕉片',
      shortDesc: '金黄酥脆香蕉切片，散发浓郁天然蕉香与轻盈脆感。',
      desc: '选用湄公河三角洲成熟香蕉，采用低温真空脆化结合离心脱油工艺制成，口感酥脆爽口，保留香蕉天然风味与钾元素。',
      origin: '越南湄公河三角洲'
    }
  },
  cashew: {
    verifiedCerts: [],
    ocopLabel: '',
    brixOverride: '',
    features: [
      {
        id: 'binh-phuoc-grade-a',
        label: {
          vi: 'Hạt điều Bình Phước (W240 / W320)',
          en: 'Binh Phuoc Grade A (W240 / W320)',
          ko: '빈프억 A등급 캐슈넛 (W240/W320)',
          zh: '平福省 A 级腰果仁 (W240/W320)'
        }
      },
      {
        id: 'hot-air-roast',
        label: {
          vi: 'Rang nhiệt phong kiểm soát nhiệt độ',
          en: 'Controlled hot-air roasting',
          ko: '정밀 온도 제어 열풍 로스팅',
          zh: '精准控温热风烘焙'
        }
      },
      {
        id: 'vacuum-n2',
        label: {
          vi: 'Hút chân không / Nạp khí Nitơ',
          en: 'Vacuum / Nitrogen-flushed pack',
          ko: '진공 및 질소 충전 포장',
          zh: '真空 / 充氮保鲜包装'
        }
      }
    ],
    ko: {
      name: '베트남 로스트 캐슈넛',
      shortDesc: '빈프억산 엄선 캐슈넛 커널을 고소하고 바삭하게 로스팅했습니다.',
      desc: '베트남 캐슈넛 주산지 빈프억에서 엄선한 W240/W320 규격 커널을 정밀 온도 제어 열풍으로 로스팅하여 고소한 풍미와 바삭한 식감을 구현했습니다.',
      origin: '베트남 빈프억성'
    },
    zh: {
      name: '越南烘焙腰果仁',
      shortDesc: '严选平福省优质腰果仁，控温轻柔烘焙，香脆醇厚。',
      desc: '来自越南腰果核心产区平福省的 W240 / W320 规格全仁腰果，经控温热风轻柔烘焙，不经油炸即可保持酥脆奶香与丰富植物蛋白。',
      origin: '越南平福省'
    }
  },
  'soft-dried-jackfruit': {
    verifiedCerts: [OCOP_3_STAR_CERT],
    ocopLabel: '3-Star OCOP',
    features: [
      {
        id: 'soft-drying-jf',
        label: {
          vi: 'Sấy dẻo nhiệt thấp (~55–60°C)',
          en: 'Low-heat drying (~55–60°C)',
          ko: '저온 열풍 건조 (~55–60°C)',
          zh: '低温热风软烘 (~55–60°C)'
        }
      },
      {
        id: 'thai-jackfruit',
        label: {
          vi: 'Mít Thái Tiền Giang & Hậu Giang',
          en: 'Tien Giang & Hau Giang Thai Jackfruit',
          ko: '띠엔장·하우장 완숙 잭프루트',
          zh: '前江与后江树熟泰种菠萝蜜'
        }
      },
      {
        id: 'no-preservatives-jf',
        label: {
          vi: 'Không phẩm màu & chất bảo quản',
          en: 'No colorants or preservatives',
          ko: '인공 색소·방부제 무첨가',
          zh: '无色素与防腐剂'
        }
      }
    ],
    ko: {
      name: '천연 소프트 건잭프루트',
      shortDesc: '두툼한 황금빛 태국 품종 잭프루트 과육에 진한 열대 향과 쫄깃한 식감을 담았습니다.',
      desc: '띠엔장·하우장 과수원에서 수확한 완숙 잭프루트를 ~55–60°C 저온 순환 건조하여 황금빛 색감과 부드럽고 쫄깃한 과육 섬유질을 보존했습니다.',
      origin: '띠엔장 & 하우장 과수원'
    },
    zh: {
      name: '天然软烘菠萝蜜干',
      shortDesc: '果肉厚实的金黄泰种菠萝蜜瓣，香气浓郁、口感柔韧多汁。',
      desc: '严选前江与后江省树熟泰种菠萝蜜，采用 ~55–60°C 低温热风循环软烘工艺，保留天然金黄色泽与饱满柔韧纤维。',
      origin: '前江与后江省果园'
    }
  },
  'mango-chips': {
    verifiedCerts: [],
    ocopLabel: '',
    brixOverride: '',
    features: [
      {
        id: 'vacuum-mango',
        label: {
          vi: 'Sấy giòn chân không & ly tâm tách dầu',
          en: 'Vacuum crisping & centrifugal de-oiling',
          ko: '진공 크리스핑 & 원심 탈유',
          zh: '真空脆化与离心脱油'
        }
      },
      {
        id: 'low-moisture-mango',
        label: {
          vi: 'Độ ẩm < 5%',
          en: 'Moisture < 5%',
          ko: '수분 함량 < 5%',
          zh: '水分含量 < 5%'
        }
      },
      {
        id: 'aluminum-foil-pack',
        label: {
          vi: 'Đóng túi nhôm zipper chống ẩm',
          en: 'Moisture-barrier foil zipper pouch',
          ko: '방습 알루미늄 지퍼 파우치',
          zh: '防潮铝箔自封袋包装'
        }
      }
    ],
    ko: {
      name: '크리스피 망고 칩',
      shortDesc: '상큼 달콤한 열대 망고 풍미가 살아 있는 가볍고 바삭한 슬라이스입니다.',
      desc: '메콩 델타산 신선 망고를 정밀 진공 건조 및 원심 탈유 공정으로 가공하여 선명한 황금빛과 깔끔하게 바삭한 식감을 구현했습니다.',
      origin: '베트남 메콩 델타'
    },
    zh: {
      name: '香脆芒果干片',
      shortDesc: '轻盈酥脆的芒果切片，带来清甜微酸的热带风味体验。',
      desc: '采用湄公河三角洲新鲜芒果，经精准低温真空脆化与离心脱油处理，入口爽脆不油腻，留存天然金黄色泽。',
      origin: '越南湄公河三角洲'
    }
  },
  'macadamia-nuts': {
    verifiedCerts: [],
    ocopLabel: '',
    brixOverride: '',
    features: [
      {
        id: 'central-highlands-macca',
        label: {
          vi: 'Mắc ca nứt vỏ Tây Nguyên',
          en: 'Central Highlands in-shell cracked macadamia',
          ko: '중부고원 크랙 인쉘 마카다미아',
          zh: '西原带壳开口夏威夷果'
        }
      },
      {
        id: 'multistage-dry',
        label: {
          vi: 'Sấy nhiệt thấp đa tầng (< 3% ẩm)',
          en: 'Multi-stage low-heat drying (< 3% moisture)',
          ko: '다단계 저온 건조 (수분 < 3%)',
          zh: '多段低温烘干（水分 < 3%）'
        }
      },
      {
        id: 'opener-included',
        label: {
          vi: 'Kèm dụng cụ tách vỏ tiện lợi',
          en: 'Shell-opening key included',
          ko: '전용 껍질 오프너 동봉',
          zh: '附赠便捷开果器'
        }
      }
    ],
    ko: {
      name: '베트남 마카다미아 너트',
      shortDesc: '베트남 중부고원 화산토에서 재배한 크리미하고 고소한 인쉘 마카다미아입니다.',
      desc: '중부고원 적색 현무암 토양에서 자란 마카다미아를 다단계 저온 열풍 건조로 수분 3% 미만으로 관리해 신선한 견과 오일과 부드러운 크리미 풍미를 유지했습니다.',
      origin: '베트남 중부고원 (떠이응우옌)'
    },
    zh: {
      name: '越南带壳夏威夷果',
      shortDesc: '产自西原火山红壤，果仁圆润饱满、奶香醇厚细腻。',
      desc: '生长于越南西原肥沃红壤区的优质夏威夷果，经开口处理及多段低温热风干燥将水分控制在 3% 以下，完整留存天然果仁油脂与酥脆奶香。',
      origin: '越南西原产区'
    }
  },
  'soft-dried-mango': {
    verifiedCerts: [OCOP_3_STAR_CERT],
    ocopLabel: '3-Star OCOP',
    features: [
      {
        id: 'cat-chu-hoa-loc',
        label: {
          vi: 'Xoài Cát Chu & Cát Hòa Lộc',
          en: 'Cat Chu & Hoa Loc mangoes',
          ko: '깟추 & 호아록 품종 망고',
          zh: 'Cat Chu 与 Hoa Loc 芒果'
        }
      },
      {
        id: 'soft-drying-mango',
        label: {
          vi: 'Sấy dẻo nhiệt thấp (~60°C)',
          en: 'Low-heat drying (~60°C)',
          ko: '저온 열풍 건조 (~60°C)',
          zh: '低温循环软烘 (~60°C)'
        }
      },
      {
        id: 'no-sugar-preservative-mango',
        label: {
          vi: 'Không đường tinh luyện & không chất bảo quản',
          en: 'Zero added refined sugar & preservative-free',
          ko: '정제당·방부제 무첨가',
          zh: '不添加精制蔗糖、无防腐剂'
        }
      }
    ],
    ko: {
      name: '천연 소프트 건망고',
      shortDesc: '깟추(Cat Chu)·호아록(Hoa Loc) 품종 망고 본연의 쫄깃한 식감과 달콤함을 살렸습니다.',
      desc: '동탑·띠엔장 대표 산지의 깟추 및 호아록 망고를 엄선해 약 60°C 저온 순환 건조 공법으로 가공했습니다. 정제당 첨가 없이 황금빛 색감과 비타민 A·C를 유지합니다.',
      origin: '동탑 & 띠엔장 과수원'
    },
    zh: {
      name: '天然软烘芒果干',
      shortDesc: '精选 Cat Chu 与 Hoa Loc 优质芒果，软糯多汁、果香醇正。',
      desc: '精选同塔省与前江省名优 Cat Chu 及 Hoa Loc 芒果，采用约 60°C 低温热风循环工艺干燥，不添加精制糖，保留自然金黄色泽及维生素 A、C。',
      origin: '同塔省与前江省果园'
    }
  },
  'jackfruit-chips': {
    verifiedCerts: [],
    ocopLabel: '',
    brixOverride: '',
    features: [
      {
        id: 'tien-giang-thai-jf',
        label: {
          vi: 'Mít Thái chín cây Tiền Giang',
          en: 'Tree-ripened Tien Giang Thai jackfruit',
          ko: '띠엔장 완숙 태국 품종 잭프루트',
          zh: '前江省树熟泰种菠萝蜜'
        }
      },
      {
        id: 'vacuum-jf-chips',
        label: {
          vi: 'Sấy chân không & ly tâm tách dầu',
          en: 'Vacuum crisping & centrifugal de-oiling',
          ko: '저온 진공 건조 & 고속 원심 탈유',
          zh: '低温真空干燥与高速离心脱油'
        }
      },
      {
        id: 'low-moisture-jf',
        label: {
          vi: 'Độ ẩm < 5%',
          en: 'Moisture < 5%',
          ko: '수분 함량 < 5%',
          zh: '水分含量 < 5%'
        }
      }
    ],
    ko: {
      name: '크리스피 잭프루트 칩',
      shortDesc: '바삭하게 튀겨낸 황금빛 잭프루트 칩으로 풍부한 열대 과일 향을 즐길 수 있습니다.',
      desc: '띠엔장산 완숙 태국 품종 잭프루트를 저온 진공 건조 및 고속 원심 탈유 공정으로 가공해 잔여 유분 없이 깔끔하고 바삭한 식감을 구현했습니다.',
      origin: '베트남 띠엔장성'
    },
    zh: {
      name: '香脆菠萝蜜片',
      shortDesc: '金黄酥脆的菠萝蜜果瓣，饱含浓郁热带果香。',
      desc: '采用前江省树熟泰种菠萝蜜，经低温真空干燥及高速离心脱油处理，入口松脆香甜不油腻。',
      origin: '越南前江省'
    }
  },
  walnuts: {
    verifiedCerts: [],
    ocopLabel: '',
    brixOverride: '',
    features: [
      {
        id: 'walnut-halves',
        label: {
          vi: 'Nhân nửa hạt (Light Halves 80%)',
          en: 'Selected walnut halves (80%)',
          ko: '엄선 반쪽 원물 호두 커널 (80%)',
          zh: '精选完整半仁核桃仁 (Light Halves 80%)'
        }
      },
      {
        id: 'gentle-convection-walnut',
        label: {
          vi: 'Sấy đối lưu nhiệt thấp giữ axit béo',
          en: 'Low-heat convection drying',
          ko: '저온 열풍 순환 건조',
          zh: '低温热对流烘干工艺'
        }
      },
      {
        id: 'omega-3-ala',
        label: {
          vi: 'Giàu Omega-3 thực vật tự nhiên',
          en: 'Naturally rich in plant Omega-3 ALA',
          ko: '천연 식물성 오메가-3 ALA 함유',
          zh: '富含天然植物性 Omega-3 (ALA)'
        }
      }
    ],
    ko: {
      name: '프리미엄 호두 커널',
      shortDesc: '크기가 균일한 반쪽 원물 호두를 가볍게 로스팅해 담백하고 바삭한 식감을 살렸습니다.',
      desc: '균일하게 선별한 라이트 하프 80% 등급 호두를 저온 열풍 순환 건조하여 오메가-3 지방산과 폴리페놀을 안정적으로 보존했습니다.',
      origin: '엄선된 프리미엄 원물'
    },
    zh: {
      name: '精选优质核桃仁',
      shortDesc: '颗粒匀称的完整半仁核桃，轻度低温烘烤，清香酥脆。',
      desc: '严选 80% 半仁完整核桃仁（Light Halves），采用低温热对流工艺干燥，减少油脂氧化，保留天然植物 Omega-3 ALA 与多酚成分。',
      origin: '精选优质原料'
    }
  },
  'soft-dried-papaya': {
    verifiedCerts: [],
    ocopLabel: '',
    features: [
      {
        id: 'papaya-mekong',
        label: {
          vi: 'Đu đủ chín cây vùng phù sa ĐBSCL',
          en: 'Mekong Delta alluvial-soil ripe papaya',
          ko: '메콩 델타 충적토 완숙 파파야',
          zh: '湄公河三角洲树熟木瓜'
        }
      },
      {
        id: 'heat-pump-papaya',
        label: {
          vi: 'Sấy bơm nhiệt nhiệt độ thấp',
          en: 'Low-heat convective heat-pump drying',
          ko: '저온 히트펌프 순환 건조',
          zh: '低温热泵循环干燥工艺'
        }
      },
      {
        id: 'no-color-papaya',
        label: {
          vi: 'Không phẩm màu & chất bảo quản',
          en: 'No artificial color or preservatives',
          ko: '인공 색소·방부제 무첨가',
          zh: '无人工色素与防腐剂'
        }
      }
    ],
    ko: {
      name: '천연 소프트 건파파야',
      shortDesc: '선명한 주황빛을 띤 부드럽고 쫄깃한 파파야 슬라이스로 은은한 단맛을 선사합니다.',
      desc: '메콩 델타 비옥한 토양에서 재배한 완숙 파파야를 저온 히트펌프 건조로 가공하여 천연 베타카로틴 색감과 부드러운 과육 식감을 유지했습니다.',
      origin: '베트남 메콩 델타'
    },
    zh: {
      name: '天然软烘木瓜干',
      shortDesc: '散发自然橙红光泽的柔韧木瓜片，清甜可口、质地柔润。',
      desc: '严选湄公河三角洲冲积土壤产区树熟木瓜，采用低温热泵循环干燥，保留天然 β-胡萝卜素、膳食纤维与柔韧咀嚼感。',
      origin: '越南湄公河三角洲'
    }
  },
  'mix-fruits-and-vegetables': {
    verifiedCerts: [],
    ocopLabel: '',
    brixOverride: '',
    features: [
      {
        id: 'multi-produce-blend',
        label: {
          vi: '7+ loại trái cây & củ quả (Mít, chuối, khoai, cà rốt, đậu bắp)',
          en: 'Multi-produce blend (Jackfruit, banana, sweet potato, taro, carrot, okra)',
          ko: '다양한 열대 과일·뿌리채소 조합',
          zh: '多种热带果干与根茎蔬果组合'
        }
      },
      {
        id: 'vacuum-mixed',
        label: {
          vi: 'Sấy chân không & ly tâm tách dầu',
          en: 'Vacuum crisping & centrifugal de-oiling',
          ko: '저온 진공 건조 & 원심 탈유',
          zh: '低温真空干燥与离心脱油'
        }
      },
      {
        id: 'no-artificial-flavor-mix',
        label: {
          vi: 'Không hương liệu & phẩm màu tổng hợp',
          en: 'No artificial flavorings or colorants',
          ko: '합성 향료·착색료 무첨가',
          zh: '无人工香精与合成色素'
        }
      }
    ],
    ko: {
      name: '모듬 과일·채소 칩',
      shortDesc: '잭프루트, 바나나, 고구마, 토란, 당근 등이 어우러진 다채롭고 바삭한 스낵입니다.',
      desc: '메콩 델타 열대 과일과 달랏 고산 채소를 저온 진공 건조로 가공해 다채로운 색감과 가볍고 바삭한 식감, 풍부한 식이섬유를 함께 담았습니다.',
      origin: '메콩 델타 & 달랏 고원'
    },
    zh: {
      name: '综合果蔬脆片',
      shortDesc: '汇集菠萝蜜、香蕉、红薯、紫薯、芋头、胡萝卜与秋葵的多彩酥脆组合。',
      desc: '甄选湄公河三角洲热带水果与大叻高原根茎蔬菜，采用低温真空脆化与离心脱油工艺，不添加人工香精与色素，口感多元爽脆。',
      origin: '湄公河三角洲与大叻高原'
    }
  },
  'lotus-seeds': {
    verifiedCerts: [],
    ocopLabel: '',
    brixOverride: '',
    features: [
      {
        id: 'dong-thap-specialty',
        label: {
          vi: 'Đặc sản vùng sen Đồng Tháp',
          en: 'Dong Thap geographic specialty',
          ko: '동탑성 지역 특산 원물',
          zh: '同塔省莲乡特色产区原料'
        }
      },
      {
        id: 'porous-crisp-lotus',
        label: {
          vi: 'Sấy chân không giòn xốp (< 6% ẩm)',
          en: 'Vacuum-dried crisp porous texture (< 6% moisture)',
          ko: '진공 건조 다공성 바삭한 식감 (< 6% 수분)',
          zh: '真空干燥酥松多孔口感（水分 < 6%）'
        }
      },
      {
        id: 'no-preservatives-lotus',
        label: {
          vi: 'Không chất bảo quản',
          en: 'Preservative-free',
          ko: '보존료 무첨가',
          zh: '无防腐剂添加'
        }
      }
    ],
    ko: {
      name: '크리스피 동탑 연자육',
      shortDesc: '동탑성산 엄선 연자육을 부드럽고 바삭하게 건조해 담백하고 은은한 단맛을 살렸습니다.',
      desc: '베트남 최대 연꽃 산지 동탑성에서 수확한 연자육의 껍질과 심을 제거한 뒤 저온 진공 건조해 가볍고 포슬포슬한 바삭함과 고소한 풍미를 구현했습니다.',
      origin: '베트남 동탑성'
    },
    zh: {
      name: '同塔香脆莲子',
      shortDesc: '严选同塔省莲子去壳去芯，低温烘焙成清甜酥松口感。',
      desc: '产自越南莲乡同塔省的饱满莲子，经精细去皮去芯与低温真空干燥，口感轻盈酥松、清香回甘，天然富含植物蛋白。',
      origin: '越南同塔省'
    }
  }
};

function mergeSpecsCleanly(
  baseSpecs: ProductSpecs,
  cmsSpecs: Partial<ProductSpecs> | undefined,
  cmsRaw: any,
  meta: ProductCatalogMeta | undefined,
  isNewCmsOnlyProduct: boolean
): ProductSpecs {
  const pickSpec = (cmsVal: unknown, baseVal: string) => {
    if (typeof cmsVal === 'string' && cmsVal.trim()) return cmsVal.trim();
    return isNewCmsOnlyProduct ? '' : baseVal;
  };
  const brixFromCms = typeof cmsSpecs?.brix === 'string' ? cmsSpecs.brix : (typeof cmsRaw?.specs_brix === 'string' ? cmsRaw.specs_brix : undefined);
  const resolvedBrix =
    meta?.brixOverride !== undefined
      ? meta.brixOverride
      : pickSpec(brixFromCms, baseSpecs.brix);

  return {
    moisture: pickSpec(cmsSpecs?.moisture ?? cmsRaw?.specs_moisture, baseSpecs.moisture),
    brix: hasApplicableBrix(resolvedBrix) ? resolvedBrix : '',
    ...(cmsSpecs?.sizeOrWeightVi || baseSpecs.sizeOrWeightVi
      ? { sizeOrWeightVi: pickSpec(cmsSpecs?.sizeOrWeightVi, baseSpecs.sizeOrWeightVi || '') }
      : {}),
    ...(cmsSpecs?.sizeOrWeightEn || baseSpecs.sizeOrWeightEn
      ? { sizeOrWeightEn: pickSpec(cmsSpecs?.sizeOrWeightEn, baseSpecs.sizeOrWeightEn || '') }
      : {}),
    ...(cmsSpecs?.sizeOrWeightKo || baseSpecs.sizeOrWeightKo
      ? { sizeOrWeightKo: pickSpec(cmsSpecs?.sizeOrWeightKo, baseSpecs.sizeOrWeightKo || '') }
      : {}),
    ...(cmsSpecs?.sizeOrWeightZh || baseSpecs.sizeOrWeightZh
      ? { sizeOrWeightZh: pickSpec(cmsSpecs?.sizeOrWeightZh, baseSpecs.sizeOrWeightZh || '') }
      : {}),
    shelfLifeEn: pickSpec(cmsSpecs?.shelfLifeEn, baseSpecs.shelfLifeEn),
    shelfLifeVi: pickSpec(cmsSpecs?.shelfLifeVi ?? cmsRaw?.shelf_life, baseSpecs.shelfLifeVi),
    shelfLifeKo: pickSpec(cmsSpecs?.shelfLifeKo, baseSpecs.shelfLifeKo || ''),
    shelfLifeZh: pickSpec(cmsSpecs?.shelfLifeZh, baseSpecs.shelfLifeZh || ''),
    storageEn: pickSpec(cmsSpecs?.storageEn, baseSpecs.storageEn),
    storageVi: pickSpec(cmsSpecs?.storageVi, baseSpecs.storageVi),
    storageKo: pickSpec(cmsSpecs?.storageKo, baseSpecs.storageKo || ''),
    storageZh: pickSpec(cmsSpecs?.storageZh, baseSpecs.storageZh || ''),
    ingredientsEn: pickSpec(cmsSpecs?.ingredientsEn, baseSpecs.ingredientsEn),
    ingredientsVi: pickSpec(cmsSpecs?.ingredientsVi ?? cmsRaw?.specs_ingredients_vi, baseSpecs.ingredientsVi),
    ingredientsKo: pickSpec(cmsSpecs?.ingredientsKo, baseSpecs.ingredientsKo || ''),
    ingredientsZh: pickSpec(cmsSpecs?.ingredientsZh, baseSpecs.ingredientsZh || ''),
    processEn: pickSpec(cmsSpecs?.processEn, baseSpecs.processEn),
    processVi: pickSpec(cmsSpecs?.processVi ?? cmsRaw?.specs_process_vi, baseSpecs.processVi),
    processKo: pickSpec(cmsSpecs?.processKo, baseSpecs.processKo || ''),
    processZh: pickSpec(cmsSpecs?.processZh, baseSpecs.processZh || ''),
    packagingEn: pickSpec(cmsSpecs?.packagingEn, baseSpecs.packagingEn),
    packagingVi: pickSpec(cmsSpecs?.packagingVi ?? cmsRaw?.packaging, baseSpecs.packagingVi),
    packagingKo: pickSpec(cmsSpecs?.packagingKo, baseSpecs.packagingKo || ''),
    packagingZh: pickSpec(cmsSpecs?.packagingZh, baseSpecs.packagingZh || ''),
    certificationsEn: pickSpec(cmsSpecs?.certificationsEn, baseSpecs.certificationsEn),
    certificationsVi: pickSpec(cmsSpecs?.certificationsVi ?? cmsRaw?.specs_cert_vi, baseSpecs.certificationsVi),
    certificationsKo: pickSpec(cmsSpecs?.certificationsKo, baseSpecs.certificationsKo || ''),
    certificationsZh: pickSpec(cmsSpecs?.certificationsZh, baseSpecs.certificationsZh || ''),
  };
}

const PRODUCT_SPECS_I18N: Record<string, { ko: Partial<ProductSpecs>; zh: Partial<ProductSpecs> }> = {
  'soft-dried-red-dragonfruit': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 곳 보관 (20 - 25°C), 직사광선 회피',
      ingredientsKo: '100% 띠엔장성 쩌가오산 신선 적색 용과, 설탕 무첨가, 인공 색소 무첨가',
      processKo: '저온 순환 히트펌프 건조 (~50 - 55°C)로 천연 베타시아닌 색소와 영양소 보존',
      packagingKo: '지퍼 파우치 100g, 250g, 500g / 질소 충전 수출 마스터 카톤 5kg, 10kg / OEM',
      certificationsKo: '베트남 OCOP 3성급'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处储存（20 - 25°C），避免阳光直射',
      ingredientsZh: '100% 鹅贡产区新鲜红心火龙果，不添加精制糖，无人工色素',
      processZh: '低温热泵循环干燥（约 50 - 55°C），完整保留天然甜菜红素与营养成分',
      packagingZh: '自封袋 100g、250g、500g / 充氮出口纸箱 5kg、10kg / OEM 贴牌',
      certificationsZh: '越南 OCOP 三星级'
    }
  },
  'banana-chips': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 곳 보관, 개봉 후 밀봉',
      ingredientsKo: '100% 엄선된 완숙 바나나, 정제 식물성 유지',
      processKo: '저온 진공 크리스핑 및 고효율 원심 탈유 공정',
      packagingKo: '지퍼 파우치 100g, 250g, 500g / 벌크 카톤 10kg',
      certificationsKo: ''
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '置于阴凉干燥处保存，开封后请密封',
      ingredientsZh: '100% 精选成熟香蕉、精炼植物油',
      processZh: '低温真空脆化及高效离心脱油工艺',
      packagingZh: '自封袋 100g、250g、500g / 散装纸箱 10kg',
      certificationsZh: ''
    }
  },
  cashew: {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '열기와 습기를 피해 서늘하고 건조한 곳에 보관',
      ingredientsKo: '100% Grade A 베트남산 캐슈넛 커널 (W240 / W320)',
      processKo: '과도한 유분 없이 정밀 열풍 커브 로스팅',
      packagingKo: '진공 파우치 / 질소 충전 캔 250g, 500g / 벌크 진공 박스 10kg, 22.68kg',
      certificationsKo: ''
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '远离高温和潮湿，置于阴凉干燥处储存',
      ingredientsZh: '100% A级越南腰果仁（W240 / W320）',
      processZh: '控温曲线轻柔热风烘焙，无多余油脂',
      packagingZh: '真空袋 / 充氮罐 250g、500g / 出口真空大箱 10kg、22.68kg',
      certificationsZh: ''
    }
  },
  'soft-dried-jackfruit': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 환경, 개봉 후 밀봉 보관',
      ingredientsKo: '100% 나무에서 완숙한 태국 품종 잭프루트, 무콜레스테롤, 무방부제',
      processKo: '저온 순환 열풍 건조 (~55 - 60°C)로 촉촉한 과육 섬유질 보존',
      packagingKo: '지퍼 파우치 100g, 250g, 500g / 수출 마스터 카톤 5kg, 10kg',
      certificationsKo: '베트남 OCOP 3성급'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处储存，开封后请密封保存',
      ingredientsZh: '100% 树熟泰国种菠萝蜜，零胆固醇，无人工防腐剂',
      processZh: '低温热风循环软烘（约 55 - 60°C），保留饱满果肉纤维',
      packagingZh: '自封袋 100g、250g、500g / 出口纸箱 5kg、10kg',
      certificationsZh: '越南 OCOP 三星级'
    }
  },
  'mango-chips': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '건조하고 서늘한 곳 보관, 개봉 후 즉시 밀봉',
      ingredientsKo: '엄선된 신선 망고 (98%), 정제 식물성 유지',
      processKo: '저온 진공 크리스핑 및 원심 탈유 공정',
      packagingKo: '알루미늄 지퍼 파우치 50g, 100g, 200g / 마스터 카톤 10kg',
      certificationsKo: ''
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处保存；开封后请立即密封',
      ingredientsZh: '新鲜精选芒果（98%）、精炼植物油',
      processZh: '低温真空脆化及离心脱油技术',
      packagingZh: '铝箔自封袋 50g、100g、200g / 出口纸箱 10kg',
      certificationsZh: ''
    }
  },
  'macadamia-nuts': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '열기와 직사광선을 피해 서늘하고 건조한 곳에 보관',
      ingredientsKo: '100% 베트남산 크랙 인쉘 마카다미아 너트 (오프너 포함)',
      processKo: '불포화지방산 보존을 위한 저온 다단계 열풍 건조',
      packagingKo: '지퍼 파우치 / PET 용기 250g, 500g / 마스터 카톤 10kg',
      certificationsKo: ''
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '避热避光，置于阴凉干燥处储存',
      ingredientsZh: '100% 越南带壳开口夏威夷果（附赠开果器）',
      processZh: '低温多段热风干燥工艺，锁住珍贵健康油脂',
      packagingZh: '自封袋 / PET 罐 250g、500g / 出口纸箱 10kg',
      certificationsZh: ''
    }
  },
  'soft-dried-mango': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 곳 보관 (20 - 25°C), 직사광선 회피',
      ingredientsKo: '100% 메콩 델타산 신선 망고 (깟추 & 호아록 품종), 설탕 무첨가, 무방부제',
      processKo: '저온 순환 열풍 건조 (~60°C)로 황금빛 색감, 식이섬유 및 비타민 A·C 유지',
      packagingKo: '지퍼 파우치 100g, 250g, 500g / 질소 충전 마스터 카톤 5kg, 10kg / OEM PB',
      certificationsKo: '베트남 OCOP 3성급'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处储存（20 - 25°C），避免阳光直射',
      ingredientsZh: '100% 湄公河三角洲新鲜芒果（Cat Chu & Hoa Loc），不添加蔗糖，无防腐剂',
      processZh: '低温热风循环干燥（约 60°C），保留天然金黄色泽、膳食纤维与维生素 A、C',
      packagingZh: '自封袋 100g、250g、500g / 充氮出口纸箱 5kg、10kg / OEM 贴牌',
      certificationsZh: '越南 OCOP 三星级'
    }
  },
  'jackfruit-chips': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 곳 보관, 개봉 후 밀봉',
      ingredientsKo: '신선 완숙 태국 품종 잭프루트 (98%), 정제 식물성 유지',
      processKo: '저온 진공 건조 및 고속 원심 유분 분리 공정',
      packagingKo: '지퍼 파우치 100g, 250g, 500g / 벌크 마스터 카톤 10kg',
      certificationsKo: ''
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处储存，开封后请密封',
      ingredientsZh: '新鲜树熟泰国种菠萝蜜（98%）、精炼植物油',
      processZh: '低温真空干燥及高速离心脱油工艺',
      packagingZh: '自封袋 100g、250g、500g / 出口大箱 10kg',
      certificationsZh: ''
    }
  },
  walnuts: {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 곳(15 - 20°C) 보관; 개봉 후 냉장 보관 권장',
      ingredientsKo: '100% 엄선된 프리미엄 호두 커널 (라이트 하프 80%)',
      processKo: '오메가 지방산 산패 방지를 위한 저온 열풍 순환 건조',
      packagingKo: '질소 충전 호일 파우치 / 캔 200g, 400g / 마스터 카톤 10kg',
      certificationsKo: ''
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处（15 - 20°C）保存；开封后建议冷藏保鲜',
      ingredientsZh: '100% 精选优质核桃仁（Light Halves 80%）',
      processZh: '低温热对流干燥以稳定 Omega 脂肪酸活性',
      packagingZh: '充氮铝箔袋 / 罐装 200g、400g / 出口纸箱 10kg',
      certificationsZh: ''
    }
  },
  'soft-dried-papaya': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 곳 보관 (20 - 25°C), 직사광선 회피',
      ingredientsKo: '100% 메콩 델타산 완숙 파파야, 인공 색소 무첨가, 무방부제',
      processKo: '베타카로틴과 식감을 보존하는 저온 순환 히트펌프 건조',
      packagingKo: '지퍼 파우치 100g, 250g, 500g / 수출 마스터 카톤 5kg, 10kg',
      certificationsKo: ''
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处储存（20 - 25°C），避免阳光直射',
      ingredientsZh: '100% 湄公河三角洲成熟木瓜，无人工色素，无防腐剂',
      processZh: '低温热泵循环干燥，保留 β-胡萝卜素与柔韧口感',
      packagingZh: '自封袋 100g、250g、500g / 出口纸箱 5kg、10kg',
      certificationsZh: ''
    }
  },
  'mix-fruits-and-vegetables': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 곳 보관, 개봉 후 밀봉',
      ingredientsKo: '잭프루트, 바나나, 고구마, 자색고구마, 토란, 당근, 풋강낭콩, 식물성 유지',
      processKo: '저온 진공 건조 및 고속 원심 유분 분리 공정',
      packagingKo: '지퍼 파우치 150g, 250g, 500g / 마스터 카톤 10kg',
      certificationsKo: ''
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处保存，开封后请密封',
      ingredientsZh: '菠萝蜜、香蕉、红薯、紫薯、芋头、胡萝卜、四季豆、植物油',
      processZh: '低温真空干燥及高速离心脱油工艺',
      packagingZh: '自封袋 150g、250g、500g / 出口纸箱 10kg',
      certificationsZh: ''
    }
  },
  'lotus-seeds': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '습기와 직사광선을 피해 서늘하고 건조한 곳에 보관',
      ingredientsKo: '100% 엄선된 동탑성 연자육, 인공 방부제 무첨가',
      processKo: '다공성 바삭한 식감과 아미노산을 유지하는 저온 진공 건조',
      packagingKo: '지퍼 파우치 / 캔 150g, 250g, 500g / 마스터 카톤 10kg',
      certificationsKo: ''
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '防潮避光，置于阴凉干燥处储存',
      ingredientsZh: '100% 精选同塔省莲子，无人工防腐剂',
      processZh: '低温真空干燥，保留酥松多孔口感与天然氨基酸',
      packagingZh: '自封袋 / 罐装 150g、250g、500g / 出口纸箱 10kg',
      certificationsZh: ''
    }
  }
};

// Dynamically merge with content/products/*.json from CMS at build time
let productCmsModules: Record<string, any> = {};
try {
  productCmsModules = (import.meta as any).glob('/content/products/*.json', { eager: true });
} catch {
  productCmsModules = {};
}
const cmsProductMap = new Map<string, any>();
for (const mod of Object.values(productCmsModules)) {
  const p = (mod as any)?.default || mod;
  if (p?.slug) cmsProductMap.set(p.slug, p);
  if (p?.id) cmsProductMap.set(p.id, p);
}

function buildProductFromBaseAndCms(base: ProductItem, cms: any, idx: number, isCmsOnly = false): ProductItem {
  const key = base.slug || base.id;
  const meta = PRODUCT_CATALOG_META[key];
  const specI18n = PRODUCT_SPECS_I18N[key];
  const category = (cms?.category as ProductCategory) || base.category || 'soft-dried';
  const cats = CATEGORY_LABELS[category] || CATEGORY_LABELS['soft-dried'];

  const baseSpecsWithI18n: ProductSpecs = {
    ...base.specs,
    ...(specI18n?.ko || {}),
    ...(specI18n?.zh || {}),
  };

  const nameVi = (cms?.name_vi || cms?.nameVi || base.nameVi || '').trim();
  const nameEn = (cms?.name_en || cms?.name || base.name || nameVi).trim();
  const nameKo = (cms?.name_ko || cms?.nameKo || cms?.ko?.name || meta?.ko?.name || nameEn).trim();
  const nameZh = (cms?.name_zh || cms?.nameZh || cms?.zh?.name || meta?.zh?.name || nameEn).trim();

  // Keep short summary and full narrative distinct without copying fullDesc into both slots unnecessarily
  const fullDescVi = (cms?.description_vi || cms?.descriptionVi || base.descriptionVi || '').trim();
  const shortDescVi = (cms?.shortDescriptionVi || base.shortDescriptionVi || fullDescVi).trim();

  const fullDescEn = (cms?.description_en || cms?.description || base.description || '').trim();
  const shortDescEn = (cms?.shortDescription || base.shortDescription || fullDescEn).trim();

  const fullDescKo = (cms?.description_ko || cms?.descriptionKo || cms?.ko?.desc || meta?.ko?.desc || fullDescEn).trim();
  const shortDescKo = (cms?.shortDescriptionKo || meta?.ko?.shortDesc || fullDescKo).trim();

  const fullDescZh = (cms?.description_zh || cms?.descriptionZh || cms?.zh?.desc || meta?.zh?.desc || fullDescEn).trim();
  const shortDescZh = (cms?.shortDescriptionZh || meta?.zh?.shortDesc || fullDescZh).trim();

  const originVi = (cms?.origin_vi || cms?.originVi || base.originVi || '').trim();
  const originEn = (cms?.origin_en || cms?.origin || base.origin || '').trim();
  const originKo = (cms?.origin_ko || cms?.originKo || cms?.ko?.origin || meta?.ko?.origin || originEn).trim();
  const originZh = (cms?.origin_zh || cms?.originZh || cms?.zh?.origin || meta?.zh?.origin || originEn).trim();

  const rawImg = (cms?.image || cms?.imageWebp || base.imageWebp || base.image || '/images/products/placeholder.webp').trim();
  const imgWebp = (cms?.imageWebp || (rawImg.endsWith('.jpg') || rawImg.endsWith('.jpeg') ? rawImg.replace(/\.jpe?g$/, '.webp') : rawImg)).trim();
  const imgJpg = (cms?.imageJpg || (rawImg.endsWith('.webp') ? rawImg.replace(/\.webp$/, '.jpg') : rawImg)).trim();

  const verifiedCerts = Array.isArray(cms?.productCertifications)
    ? cms.productCertifications
    : (meta?.verifiedCerts ?? []);

  const productFeatures = Array.isArray(cms?.productFeatures) && cms.productFeatures.length > 0
    ? cms.productFeatures
    : (meta?.features ?? []);

  const ocopLabel = typeof cms?.ocop === 'string'
    ? (verifiedCerts.length > 0 ? cms.ocop : '')
    : (meta ? meta.ocopLabel : base.ocop);

  const mergedSpecs = mergeSpecsCleanly(baseSpecsWithI18n, cms?.specs, cms, meta, isCmsOnly);

  const published = cms?.published !== undefined ? Boolean(cms.published) : cms?.status !== 'draft';

  return {
    ...base,
    nameVi,
    name: nameEn,
    nameKo,
    nameZh,
    category,
    categoryLabelEn: cats.en,
    categoryLabelVi: cats.vi,
    categoryLabelKo: cats.ko,
    categoryLabelZh: cats.zh,
    image: rawImg,
    imageWebp: imgWebp,
    imageJpg: imgJpg,
    shortDescriptionVi: shortDescVi,
    descriptionVi: fullDescVi || shortDescVi,
    shortDescription: shortDescEn,
    description: fullDescEn || shortDescEn,
    shortDescriptionKo: shortDescKo,
    descriptionKo: fullDescKo,
    shortDescriptionZh: shortDescZh,
    descriptionZh: fullDescZh,
    originVi,
    origin: originEn,
    originKo,
    originZh,
    ocop: ocopLabel,
    certifications: Array.isArray(cms?.certifications) ? cms.certifications : base.certifications,
    productCertifications: verifiedCerts,
    productFeatures,
    specs: mergedSpecs,
    en: {
      name: nameEn,
      desc: shortDescEn || fullDescEn,
      origin: originEn,
      features: dedupeNarrative(fullDescEn || shortDescEn, cms?.en?.features || base.en.features)
    },
    vi: {
      name: nameVi,
      desc: shortDescVi || fullDescVi,
      origin: originVi,
      features: dedupeNarrative(fullDescVi || shortDescVi, cms?.vi?.features || base.vi.features)
    },
    ko: {
      name: nameKo,
      desc: shortDescKo || fullDescKo,
      origin: originKo,
      features: dedupeNarrative(fullDescKo || shortDescKo, cms?.ko?.features)
    },
    zh: {
      name: nameZh,
      desc: shortDescZh || fullDescZh,
      origin: originZh,
      features: dedupeNarrative(fullDescZh || shortDescZh, cms?.zh?.features)
    },
    ...(cms?.seoTitleVi ? { seoTitleVi: cms.seoTitleVi } : {}),
    ...(cms?.seoTitleEn ? { seoTitleEn: cms.seoTitleEn } : {}),
    ...(cms?.seoDescriptionVi ? { seoDescriptionVi: cms.seoDescriptionVi } : {}),
    ...(cms?.seoDescriptionEn ? { seoDescriptionEn: cms.seoDescriptionEn } : {}),
    ...(cms?.imageAltVi ? { imageAltVi: cms.imageAltVi } : {}),
    ...(cms?.imageAltEn ? { imageAltEn: cms.imageAltEn } : {}),
    published,
    status: published ? 'published' : 'draft',
    order: Number(cms?.order) || base.order || idx + 1,
    featured: cms?.featured !== undefined ? Boolean(cms.featured) : Boolean(base.featured),
    ...(Number.isFinite(Number(cms?.featuredOrder)) && Number(cms?.featuredOrder) > 0
      ? { featuredOrder: Math.floor(Number(cms.featuredOrder)) }
      : {}),
  };
}

const baseSlugSet = new Set<string>(BASE_PRODUCTS_DATA.map((b) => b.slug));

const mergedBaseProducts: ProductItem[] = BASE_PRODUCTS_DATA.map((base, idx) => {
  const cms = cmsProductMap.get(base.slug) || cmsProductMap.get(base.id);
  return buildProductFromBaseAndCms(base, cms, idx, false);
});

const extraCmsProducts: ProductItem[] = [];
const seenExtraSlugs = new Set<string>();
for (const cms of cmsProductMap.values()) {
  const slug = String(cms?.slug || cms?.id || '').trim();
  if (!slug || baseSlugSet.has(slug) || seenExtraSlugs.has(slug)) continue;
  seenExtraSlugs.add(slug);
  const emptyBase: ProductItem = {
    id: slug,
    slug,
    name: cms.name || cms.name_en || cms.name_vi || slug,
    nameVi: cms.nameVi || cms.name_vi || slug,
    category: cms.category || 'soft-dried',
    categoryLabelEn: '',
    categoryLabelVi: '',
    image: cms.image || '/images/products/placeholder.webp',
    imageWebp: cms.imageWebp || cms.image || '/images/products/placeholder.webp',
    imageJpg: cms.imageJpg || cms.image || '/images/products/placeholder.webp',
    shortDescription: '',
    shortDescriptionVi: '',
    description: '',
    descriptionVi: '',
    verified: true,
    ocop: '',
    specs: {
      moisture: '',
      brix: '',
      shelfLifeEn: '',
      shelfLifeVi: '',
      storageEn: '',
      storageVi: '',
      ingredientsEn: '',
      ingredientsVi: '',
      processEn: '',
      processVi: '',
      packagingEn: '',
      packagingVi: '',
      certificationsEn: '',
      certificationsVi: ''
    },
    en: { name: '', desc: '', origin: '', features: '' },
    vi: { name: '', desc: '', origin: '', features: '' }
  };
  extraCmsProducts.push(buildProductFromBaseAndCms(emptyBase, cms, 100 + extraCmsProducts.length, true));
}

export const productsData: ProductItem[] = [...mergedBaseProducts, ...extraCmsProducts]
  .filter((p) => p.published !== false && p.status !== 'draft')
  .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));

export function getProductFeatureLabel(feature: ProductFeatureItem, lang: Language): string {
  if (!feature?.label) return '';
  if (lang === 'vi') return feature.label.vi || feature.label.en || '';
  if (lang === 'ko') return feature.label.ko || feature.label.en || feature.label.vi || '';
  if (lang === 'zh-CN') return feature.label.zh || feature.label.en || feature.label.vi || '';
  return feature.label.en || feature.label.vi || '';
}

export function getProductLocalized(product: ProductItem, lang: Language): {
  name: string;
  shortDesc: string;
  desc: string;
  features: string;
  highlight: string;
  origin: string;
  categoryLabel: string;
  imageAlt: string;
  productCertifications: ProductCertificationRef[];
  productFeatures: ProductFeatureItem[];
} {
  const cat = CATEGORY_LABELS[product.category];
  const certs = product.productCertifications ?? [];
  const pFeatures = product.productFeatures ?? [];

  if (lang === 'vi') {
    const desc = (product.descriptionVi || product.shortDescriptionVi || product.vi.desc || '').trim();
    const shortDesc = (product.shortDescriptionVi || product.vi.desc || desc).trim();
    const highlight = dedupeNarrative(desc, product.vi.features);
    const name = product.nameVi || product.vi.name;
    return {
      name,
      shortDesc,
      desc,
      features: highlight,
      highlight,
      origin: product.originVi || product.vi.origin || '',
      categoryLabel: cat?.vi || product.categoryLabelVi,
      imageAlt: product.imageAltVi || name,
      productCertifications: certs,
      productFeatures: pFeatures
    };
  }
  if (lang === 'ko') {
    const desc = (product.descriptionKo || product.ko?.desc || product.description || product.en.desc || '').trim();
    const shortDesc = (product.shortDescriptionKo || product.ko?.desc || desc).trim();
    const highlight = dedupeNarrative(desc, product.ko?.features);
    const name = product.nameKo || product.ko?.name || product.name;
    return {
      name,
      shortDesc,
      desc,
      features: highlight,
      highlight,
      origin: product.originKo || product.ko?.origin || product.origin || product.en.origin || '',
      categoryLabel: cat?.ko || product.categoryLabelKo || product.categoryLabelEn,
      imageAlt: name,
      productCertifications: certs,
      productFeatures: pFeatures
    };
  }
  if (lang === 'zh-CN') {
    const desc = (product.descriptionZh || product.zh?.desc || product.description || product.en.desc || '').trim();
    const shortDesc = (product.shortDescriptionZh || product.zh?.desc || desc).trim();
    const highlight = dedupeNarrative(desc, product.zh?.features);
    const name = product.nameZh || product.zh?.name || product.name;
    return {
      name,
      shortDesc,
      desc,
      features: highlight,
      highlight,
      origin: product.originZh || product.zh?.origin || product.origin || product.en.origin || '',
      categoryLabel: cat?.zh || product.categoryLabelZh || product.categoryLabelEn,
      imageAlt: name,
      productCertifications: certs,
      productFeatures: pFeatures
    };
  }
  const desc = (product.description || product.shortDescription || product.en.desc || '').trim();
  const shortDesc = (product.shortDescription || product.en.desc || desc).trim();
  const highlight = dedupeNarrative(desc, product.en.features);
  const name = product.name || product.en.name;
  return {
    name,
    shortDesc,
    desc,
    features: highlight,
    highlight,
    origin: product.origin || product.en.origin || '',
    categoryLabel: cat?.en || product.categoryLabelEn,
    imageAlt: product.imageAltEn || name,
    productCertifications: certs,
    productFeatures: pFeatures
  };
}

export function getProductSpecsLocalized(specs: ProductSpecs, lang: Language) {
  const brix = hasApplicableBrix(specs.brix) ? specs.brix : '';
  if (lang === 'vi') {
    return {
      moisture: specs.moisture || '',
      brix,
      sizeOrWeight: specs.sizeOrWeightVi || '',
      shelfLife: specs.shelfLifeVi || '',
      storage: specs.storageVi || '',
      ingredients: specs.ingredientsVi || '',
      process: specs.processVi || '',
      packaging: specs.packagingVi || '',
      certifications: specs.certificationsVi || ''
    };
  }
  if (lang === 'ko') {
    return {
      moisture: specs.moisture || '',
      brix,
      sizeOrWeight: specs.sizeOrWeightKo || specs.sizeOrWeightEn || '',
      shelfLife: specs.shelfLifeKo || specs.shelfLifeEn || '',
      storage: specs.storageKo || specs.storageEn || '',
      ingredients: specs.ingredientsKo || specs.ingredientsEn || '',
      process: specs.processKo || specs.processEn || '',
      packaging: specs.packagingKo || specs.packagingEn || '',
      certifications: specs.certificationsKo || specs.certificationsEn || ''
    };
  }
  if (lang === 'zh-CN') {
    return {
      moisture: specs.moisture || '',
      brix,
      sizeOrWeight: specs.sizeOrWeightZh || specs.sizeOrWeightEn || '',
      shelfLife: specs.shelfLifeZh || specs.shelfLifeEn || '',
      storage: specs.storageZh || specs.storageEn || '',
      ingredients: specs.ingredientsZh || specs.ingredientsEn || '',
      process: specs.processZh || specs.processEn || '',
      packaging: specs.packagingZh || specs.packagingEn || '',
      certifications: specs.certificationsZh || specs.certificationsEn || ''
    };
  }
  return {
    moisture: specs.moisture || '',
    brix,
    sizeOrWeight: specs.sizeOrWeightEn || '',
    shelfLife: specs.shelfLifeEn || '',
    storage: specs.storageEn || '',
    ingredients: specs.ingredientsEn || '',
    process: specs.processEn || '',
    packaging: specs.packagingEn || '',
    certifications: specs.certificationsEn || ''
  };
}


