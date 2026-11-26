export interface ProductSpecs {
  moisture: string;
  brix: string;
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
  verified: boolean;
  ocop: string;
  specs: ProductSpecs;
  en: ProductLocalizedContent;
  vi: ProductLocalizedContent;
  ko?: ProductLocalizedContent;
  zh?: ProductLocalizedContent;
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

const CATEGORY_LABELS: Record<ProductCategory, { vi: string; en: string; ko: string; zh: string }> = {
  'soft-dried': {
    vi: 'Trái cây sấy dẻo',
    en: 'Soft-Dried Fruits',
    ko: '소프트 건조 과일',
    zh: '软烘干果'
  },
  chips: {
    vi: 'Trái cây sấy giòn',
    en: 'Fruit Chips',
    ko: '크리스피 과일 칩',
    zh: '香脆果干片'
  },
  'nuts-seeds': {
    vi: 'Hạt dinh dưỡng',
    en: 'Nuts & Seeds',
    ko: '견과류 및 연자육',
    zh: '坚果与莲子'
  },
  mixed: {
    vi: 'Trộn thập cẩm',
    en: 'Mixed Products',
    ko: '모듬 과일·채소',
    zh: '综合果蔬'
  }
};

const PRODUCT_SPECS_I18N: Record<string, { ko: Partial<ProductSpecs>; zh: Partial<ProductSpecs> }> = {
  'soft-dried-red-dragonfruit': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 곳 보관 (20 - 25°C), 직사광선 회피',
      ingredientsKo: '100% 띠엔장성 쩌가오산 신선 적색 용과, 설탕 무첨가, 인공 색소 무첨가',
      processKo: '저온 순환 히트펌프 건조 (~50 - 55°C)로 천연 베타시아닌 색소와 영양소 보존',
      packagingKo: '지퍼 파우치 100g, 250g, 500g / 질소 충전 수출 마스터 카톤 5kg, 10kg / OEM',
      certificationsKo: '베트남 OCOP 3성급, BRCGS Grade B 시설, 클린 라벨'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处储存（20 - 25°C），避免阳光直射',
      ingredientsZh: '100% 鹅贡产区新鲜红心火龙果，不添加精制糖，无人工色素',
      processZh: '低温热泵循环干燥（约 50 - 55°C），完整保留天然甜菜红素与营养成分',
      packagingZh: '自封袋 100g、250g、500g / 充氮出口纸箱 5kg、10kg / OEM 贴牌',
      certificationsZh: '越南 OCOP 三星级、BRCGS B级认证工厂、清洁标签'
    }
  },
  'banana-chips': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 곳 보관, 개봉 후 밀봉',
      ingredientsKo: '100% 엄선된 완숙 바나나, 정제 식물성 유지',
      processKo: '저온 진공 크리스핑 및 고효율 원심 탈유 공정',
      packagingKo: '지퍼 파우치 100g, 250g, 500g / 벌크 카톤 10kg',
      certificationsKo: 'BRCGS Grade B 시설, 클린 라벨, 수출 규격'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '置于阴凉干燥处保存，开封后请密封',
      ingredientsZh: '100% 精选成熟香蕉、精炼植物油',
      processZh: '低温真空脆化及高效离心脱油工艺',
      packagingZh: '自封袋 100g、250g、500g / 散装纸箱 10kg',
      certificationsZh: 'BRCGS B级认证工厂、清洁标签、出口品质'
    }
  },
  cashew: {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '열기와 습기를 피해 서늘하고 건조한 곳에 보관',
      ingredientsKo: '100% Grade A 베트남산 캐슈넛 커널 (W240 / W320)',
      processKo: '과도한 유분 없이 정밀 열풍 커브 로스팅',
      packagingKo: '진공 파우치 / 질소 충전 캔 250g, 500g / 벌크 진공 박스 10kg, 22.68kg',
      certificationsKo: 'BRCGS 시설, ISO 22000:2018, HACCP 인증'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '远离高温和潮湿，置于阴凉干燥处储存',
      ingredientsZh: '100% A级越南腰果仁（W240 / W320）',
      processZh: '控温曲线轻柔热风烘焙，无多余油脂',
      packagingZh: '真空袋 / 充氮罐 250g、500g / 出口真空大箱 10kg、22.68kg',
      certificationsZh: 'BRCGS 工厂、ISO 22000:2018、HACCP 认证'
    }
  },
  'soft-dried-jackfruit': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 환경, 개봉 후 밀봉 보관',
      ingredientsKo: '100% 나무에서 완숙한 태국 품종 잭프루트, 무콜레스테롤, 무방부제',
      processKo: '저온 순환 열풍 건조 (~55 - 60°C)로 촉촉한 과육 섬유질 보존',
      packagingKo: '지퍼 파우치 100g, 250g, 500g / 수출 마스터 카톤 5kg, 10kg',
      certificationsKo: '베트남 OCOP 3성급, BRCGS Grade B 시설, 클린 라벨'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处储存，开封后请密封保存',
      ingredientsZh: '100% 树熟泰国种菠萝蜜，零胆固醇，无人工防腐剂',
      processZh: '低温热风循环软烘（约 55 - 60°C），保留饱满果肉纤维',
      packagingZh: '自封袋 100g、250g、500g / 出口纸箱 5kg、10kg',
      certificationsZh: '越南 OCOP 三星级、BRCGS B级认证工厂、清洁标签'
    }
  },
  'mango-chips': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '건조하고 서늘한 곳 보관, 개봉 후 즉시 밀봉',
      ingredientsKo: '엄선된 신선 망고 (98%), 정제 식물성 유지',
      processKo: '저온 진공 크리스핑 및 원심 탈유 공정',
      packagingKo: '알루미늄 지퍼 파우치 50g, 100g, 200g / 마스터 카톤 10kg',
      certificationsKo: 'BRCGS 시설, 클린 라벨, 수출 표준'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处保存；开封后请立即密封',
      ingredientsZh: '新鲜精选芒果（98%）、精炼植物油',
      processZh: '低温真空脆化及离心脱油技术',
      packagingZh: '铝箔自封袋 50g、100g、200g / 出口纸箱 10kg',
      certificationsZh: 'BRCGS 工厂、清洁标签、出口标准'
    }
  },
  'macadamia-nuts': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '열기와 직사광선을 피해 서늘하고 건조한 곳에 보관',
      ingredientsKo: '100% 베트남산 크랙 인쉘 마카다미아 너트 (오프너 포함)',
      processKo: '불포화지방산 보존을 위한 저온 다단계 열풍 건조',
      packagingKo: '지퍼 파우치 / PET 용기 250g, 500g / 마스터 카톤 10kg',
      certificationsKo: 'ISO 22000:2018, HACCP, 클린 라벨'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '避热避光，置于阴凉干燥处储存',
      ingredientsZh: '100% 越南带壳开口夏威夷果（附赠开果器）',
      processZh: '低温多段热风干燥工艺，锁住珍贵健康油脂',
      packagingZh: '自封袋 / PET 罐 250g、500g / 出口纸箱 10kg',
      certificationsZh: 'ISO 22000:2018、HACCP、清洁标签'
    }
  },
  'soft-dried-mango': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 곳 보관 (20 - 25°C), 직사광선 회피',
      ingredientsKo: '100% 메콩 델타산 신선 망고 (깟추 & 호아록 품종), 설탕 무첨가, 무방부제',
      processKo: '저온 순환 열풍 건조 (~60°C)로 황금빛 색감, 식이섬유 및 비타민 A·C 유지',
      packagingKo: '지퍼 파우치 100g, 250g, 500g / 질소 충전 마스터 카톤 5kg, 10kg / OEM PB',
      certificationsKo: '베트남 OCOP 3성급, BRCGS Grade B 시설, BSCI 사회적 책임 준수'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处储存（20 - 25°C），避免阳光直射',
      ingredientsZh: '100% 湄公河三角洲新鲜芒果（Cat Chu & Hoa Loc），不添加蔗糖，无防腐剂',
      processZh: '低温热风循环干燥（约 60°C），保留天然金黄色泽、膳食纤维与维生素 A、C',
      packagingZh: '自封袋 100g、250g、500g / 充氮出口纸箱 5kg、10kg / OEM 贴牌',
      certificationsZh: '越南 OCOP 三星级、BRCGS B级认证工厂、BSCI 社会责任审核'
    }
  },
  'jackfruit-chips': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 곳 보관, 개봉 후 밀봉',
      ingredientsKo: '신선 완숙 태국 품종 잭프루트 (98%), 정제 식물성 유지',
      processKo: '저온 진공 건조 및 고속 원심 유분 분리 공정',
      packagingKo: '지퍼 파우치 100g, 250g, 500g / 벌크 마스터 카톤 10kg',
      certificationsKo: 'BRCGS Grade B 시설, 클린 라벨, 수출 표준'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处储存，开封后请密封',
      ingredientsZh: '新鲜树熟泰国种菠萝蜜（98%）、精炼植物油',
      processZh: '低温真空干燥及高速离心脱油工艺',
      packagingZh: '自封袋 100g、250g、500g / 出口大箱 10kg',
      certificationsZh: 'BRCGS B级认证工厂、清洁标签、出口标准'
    }
  },
  walnuts: {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 곳(15 - 20°C) 보관; 개봉 후 냉장 보관 권장',
      ingredientsKo: '100% 엄선된 프리미엄 호두 커널 (라이트 하프 80%)',
      processKo: '오메가 지방산 산패 방지를 위한 저온 열풍 순환 건조',
      packagingKo: '질소 충전 호일 파우치 / 캔 200g, 400g / 마스터 카톤 10kg',
      certificationsKo: 'ISO 22000, HACCP, 클린 라벨'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处（15 - 20°C）保存；开封后建议冷藏保鲜',
      ingredientsZh: '100% 精选优质核桃仁（Light Halves 80%）',
      processZh: '低温热对流干燥以稳定 Omega 脂肪酸活性',
      packagingZh: '充氮铝箔袋 / 罐装 200g、400g / 出口纸箱 10kg',
      certificationsZh: 'ISO 22000、HACCP、清洁标签'
    }
  },
  'soft-dried-papaya': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 곳 보관 (20 - 25°C), 직사광선 회피',
      ingredientsKo: '100% 메콩 델타산 완숙 파파야, 인공 색소 무첨가, 무방부제',
      processKo: '베타카로틴과 식감을 보존하는 저온 순환 히트펌프 건조',
      packagingKo: '지퍼 파우치 100g, 250g, 500g / 수출 마스터 카톤 5kg, 10kg',
      certificationsKo: 'BRCGS 시설, 클린 라벨, 수출 표준'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处储存（20 - 25°C），避免阳光直射',
      ingredientsZh: '100% 湄公河三角洲成熟木瓜，无人工色素，无防腐剂',
      processZh: '低温热泵循环干燥，保留 β-胡萝卜素与柔韧口感',
      packagingZh: '自封袋 100g、250g、500g / 出口纸箱 5kg、10kg',
      certificationsZh: 'BRCGS 工厂、清洁标签、出口标准'
    }
  },
  'mix-fruits-and-vegetables': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '서늘하고 건조한 곳 보관, 개봉 후 밀봉',
      ingredientsKo: '잭프루트, 바나나, 고구마, 자색고구마, 토란, 당근, 풋강낭콩, 식물성 유지',
      processKo: '저온 진공 건조 및 고속 원심 유분 분리 공정',
      packagingKo: '지퍼 파우치 150g, 250g, 500g / 마스터 카톤 10kg',
      certificationsKo: 'BRCGS 시설, 클린 라벨, 수출 표준'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '阴凉干燥处保存，开封后请密封',
      ingredientsZh: '菠萝蜜、香蕉、红薯、紫薯、芋头、胡萝卜、四季豆、植物油',
      processZh: '低温真空干燥及高速离心脱油工艺',
      packagingZh: '自封袋 150g、250g、500g / 出口纸箱 10kg',
      certificationsZh: 'BRCGS 工厂、清洁标签、出口标准'
    }
  },
  'lotus-seeds': {
    ko: {
      shelfLifeKo: '12개월',
      storageKo: '습기와 직사광선을 피해 서늘하고 건조한 곳에 보관',
      ingredientsKo: '100% 엄선된 동탑성 연자육, 인공 방부제 무첨가',
      processKo: '다공성 바삭한 식감과 아미노산을 유지하는 저온 진공 건조',
      packagingKo: '지퍼 파우치 / 캔 150g, 250g, 500g / 마스터 카톤 10kg',
      certificationsKo: '동탑성 지리적 특산물, BRCGS 시설, 클린 라벨'
    },
    zh: {
      shelfLifeZh: '12个月',
      storageZh: '防潮避光，置于阴凉干燥处储存',
      ingredientsZh: '100% 精选同塔省莲子，无人工防腐剂',
      processZh: '低温真空干燥，保留酥松多孔口感与天然氨基酸',
      packagingZh: '自封袋 / 罐装 150g、250g、500g / 出口纸箱 10kg',
      certificationsZh: '同塔省地理特色产品、BRCGS 工厂、清洁标签'
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
  const p = (mod as any).default || mod;
  if (p?.slug) cmsProductMap.set(p.slug, p);
  if (p?.id) cmsProductMap.set(p.id, p);
}

export const productsData: ProductItem[] = BASE_PRODUCTS_DATA.map((base) => {
  const cms = cmsProductMap.get(base.slug) || cmsProductMap.get(base.id);
  const specI18n = PRODUCT_SPECS_I18N[base.slug];
  const baseCats = CATEGORY_LABELS[base.category];

  const baseWithKoZh: ProductItem = {
    ...base,
    categoryLabelKo: base.categoryLabelKo || baseCats?.ko || base.categoryLabelEn,
    categoryLabelZh: base.categoryLabelZh || baseCats?.zh || base.categoryLabelEn,
    specs: {
      ...base.specs,
      ...(specI18n?.ko || {}),
      ...(specI18n?.zh || {})
    }
  };

  if (!cms) return baseWithKoZh;

  const nameVi = cms.name_vi || cms.nameVi || base.nameVi;
  const nameEn = cms.name_en || cms.name || base.name;
  const nameKo = cms.name_ko || cms.nameKo || cms.ko?.name || baseWithKoZh.nameKo || nameEn;
  const nameZh = cms.name_zh || cms.nameZh || cms.zh?.name || baseWithKoZh.nameZh || nameEn;

  const descVi = cms.description_vi || cms.descriptionVi || base.descriptionVi;
  const descEn = cms.description_en || cms.description || base.description;
  const descKo = cms.description_ko || cms.descriptionKo || cms.ko?.desc || baseWithKoZh.descriptionKo || descEn;
  const descZh = cms.description_zh || cms.descriptionZh || cms.zh?.desc || baseWithKoZh.descriptionZh || descEn;

  const originVi = cms.origin_vi || cms.originVi || base.originVi;
  const originEn = cms.origin_en || cms.origin || base.origin;
  const originKo = cms.origin_ko || cms.originKo || cms.ko?.origin || baseWithKoZh.originKo || originEn;
  const originZh = cms.origin_zh || cms.originZh || cms.zh?.origin || baseWithKoZh.originZh || originEn;

  const category = (cms.category as ProductCategory) || base.category;
  const cats = CATEGORY_LABELS[category] || baseCats;
  const img = cms.image || cms.imageWebp || base.imageWebp || base.image;
  const imgWebp = cms.imageWebp || (img.endsWith('.webp') ? img : (img.endsWith('.jpg') ? img.replace(/\.jpe?g$/, '.webp') : img));
  const imgJpg = cms.imageJpg || (img.endsWith('.webp') ? img.replace(/\.webp$/, '.jpg') : img);

  return {
    ...baseWithKoZh,
    nameVi,
    name: nameEn,
    nameKo,
    nameZh,
    category,
    categoryLabelEn: cats?.en || baseWithKoZh.categoryLabelEn,
    categoryLabelVi: cats?.vi || baseWithKoZh.categoryLabelVi,
    categoryLabelKo: cats?.ko || baseWithKoZh.categoryLabelKo,
    categoryLabelZh: cats?.zh || baseWithKoZh.categoryLabelZh,
    image: img,
    imageWebp: imgWebp,
    imageJpg: imgJpg,
    shortDescriptionVi: descVi,
    descriptionVi: descVi,
    shortDescription: descEn,
    description: descEn,
    shortDescriptionKo: cms.shortDescriptionKo || descKo,
    descriptionKo: descKo,
    shortDescriptionZh: cms.shortDescriptionZh || descZh,
    descriptionZh: descZh,
    originVi,
    origin: originEn,
    originKo,
    originZh,
    certifications: cms.certifications || base.certifications,
    specs: {
      ...baseWithKoZh.specs,
      ...(cms.specs || {}),
      shelfLifeVi: cms.shelf_life || cms.specs?.shelfLifeVi || base.specs.shelfLifeVi,
      shelfLifeKo: cms.shelf_life_ko || cms.specs?.shelfLifeKo || baseWithKoZh.specs.shelfLifeKo,
      shelfLifeZh: cms.shelf_life_zh || cms.specs?.shelfLifeZh || baseWithKoZh.specs.shelfLifeZh,
      packagingVi: cms.packaging || cms.specs?.packagingVi || base.specs.packagingVi,
      packagingKo: cms.packaging_ko || cms.specs?.packagingKo || baseWithKoZh.specs.packagingKo,
      packagingZh: cms.packaging_zh || cms.specs?.packagingZh || baseWithKoZh.specs.packagingZh
    },
    en: {
      ...base.en,
      name: nameEn,
      desc: descEn,
      origin: originEn || base.en.origin
    },
    vi: {
      ...base.vi,
      name: nameVi,
      desc: descVi,
      origin: originVi || base.vi.origin
    },
    ko: {
      name: nameKo,
      desc: descKo,
      origin: originKo || originEn || base.en.origin,
      features: cms.ko?.features || descKo
    },
    zh: {
      name: nameZh,
      desc: descZh,
      origin: originZh || originEn || base.en.origin,
      features: cms.zh?.features || descZh
    }
  };
});

export function getProductLocalized(product: ProductItem, lang: Language): {
  name: string;
  desc: string;
  origin: string;
  features: string;
  categoryLabel: string;
} {
  const cat = CATEGORY_LABELS[product.category];
  if (lang === 'vi') {
    return {
      name: product.nameVi || product.vi.name,
      desc: product.descriptionVi || product.shortDescriptionVi || product.vi.desc,
      origin: product.originVi || product.vi.origin,
      features: product.vi.features || product.descriptionVi,
      categoryLabel: cat?.vi || product.categoryLabelVi
    };
  }
  if (lang === 'ko') {
    return {
      name: product.nameKo || product.ko?.name || product.name,
      desc: product.descriptionKo || product.shortDescriptionKo || product.ko?.desc || product.description,
      origin: product.originKo || product.ko?.origin || product.origin || product.en.origin,
      features: product.ko?.features || product.descriptionKo || product.en.features,
      categoryLabel: cat?.ko || product.categoryLabelKo || product.categoryLabelEn
    };
  }
  if (lang === 'zh-CN') {
    return {
      name: product.nameZh || product.zh?.name || product.name,
      desc: product.descriptionZh || product.shortDescriptionZh || product.zh?.desc || product.description,
      origin: product.originZh || product.zh?.origin || product.origin || product.en.origin,
      features: product.zh?.features || product.descriptionZh || product.en.features,
      categoryLabel: cat?.zh || product.categoryLabelZh || product.categoryLabelEn
    };
  }
  return {
    name: product.name || product.en.name,
    desc: product.description || product.shortDescription || product.en.desc,
    origin: product.origin || product.en.origin,
    features: product.en.features || product.description,
    categoryLabel: cat?.en || product.categoryLabelEn
  };
}

export function getProductSpecsLocalized(specs: ProductSpecs, lang: Language) {
  if (lang === 'vi') {
    return {
      moisture: specs.moisture,
      brix: specs.brix,
      shelfLife: specs.shelfLifeVi,
      storage: specs.storageVi,
      ingredients: specs.ingredientsVi,
      process: specs.processVi,
      packaging: specs.packagingVi,
      certifications: specs.certificationsVi
    };
  }
  if (lang === 'ko') {
    return {
      moisture: specs.moisture,
      brix: specs.brix,
      shelfLife: specs.shelfLifeKo || specs.shelfLifeEn,
      storage: specs.storageKo || specs.storageEn,
      ingredients: specs.ingredientsKo || specs.ingredientsEn,
      process: specs.processKo || specs.processEn,
      packaging: specs.packagingKo || specs.packagingEn,
      certifications: specs.certificationsKo || specs.certificationsEn
    };
  }
  if (lang === 'zh-CN') {
    return {
      moisture: specs.moisture,
      brix: specs.brix,
      shelfLife: specs.shelfLifeZh || specs.shelfLifeEn,
      storage: specs.storageZh || specs.storageEn,
      ingredients: specs.ingredientsZh || specs.ingredientsEn,
      process: specs.processZh || specs.processEn,
      packaging: specs.packagingZh || specs.packagingEn,
      certifications: specs.certificationsZh || specs.certificationsEn
    };
  }
  return {
    moisture: specs.moisture,
    brix: specs.brix,
    shelfLife: specs.shelfLifeEn,
    storage: specs.storageEn,
    ingredients: specs.ingredientsEn,
    process: specs.processEn,
    packaging: specs.packagingEn,
    certifications: specs.certificationsEn
  };
}


