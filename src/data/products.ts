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

export interface ProductItem {
  id: string;
  slug: string;
  category: 'mango' | 'jackfruit' | 'dragon' | 'pineapple' | 'banana' | 'energy-bar';
  imageWebp: string;
  imageJpg: string;
  verified: boolean;
  ocop: string;
  specs: ProductSpecs;
  en: ProductLocalizedContent;
  vi: ProductLocalizedContent;
}

export const productsData: ProductItem[] = [
  {
    id: "dried-mango",
    slug: "dried-mango",
    category: "mango",
    imageWebp: "/assets/images/prod_mango.webp",
    imageJpg: "/assets/images/prod_mango.jpg",
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
    imageWebp: "/assets/images/prod_mixed.webp",
    imageJpg: "/assets/images/prod_mixed.jpg",
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
    imageWebp: "/assets/images/prod_dragonfruit.webp",
    imageJpg: "/assets/images/prod_dragonfruit.jpg",
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
    imageWebp: "/assets/images/prod_pineapple.webp",
    imageJpg: "/assets/images/prod_pineapple.jpg",
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
    imageWebp: "/assets/images/prod_banana.webp",
    imageJpg: "/assets/images/prod_banana.jpg",
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
    imageWebp: "/assets/images/news/dried-fruit-export.webp",
    imageJpg: "/assets/images/news/dried-fruit-export.jpg",
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
