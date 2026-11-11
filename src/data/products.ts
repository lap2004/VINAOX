export interface ProductSpecs {
  moisture: string;
  brix: string;
  shelfLifeEn: string;
  shelfLifeVi: string;
  storageEn: string;
  storageVi: string;
  ingredientsEn: string;
  ingredientsVi: string;
  processEn: string;
  processVi: string;
  packagingEn: string;
  packagingVi: string;
  certificationsEn: string;
  certificationsVi: string;
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
  category: ProductCategory;
  categoryLabelEn: string;
  categoryLabelVi: string;
  image: string;
  imageWebp: string;
  imageJpg: string;
  shortDescription: string;
  shortDescriptionVi: string;
  description: string;
  descriptionVi: string;
  origin?: string;
  originVi?: string;
  certifications?: string[];
  verified: boolean;
  ocop: string;
  specs: ProductSpecs;
  en: ProductLocalizedContent;
  vi: ProductLocalizedContent;
}

export const productsData: ProductItem[] = [
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
