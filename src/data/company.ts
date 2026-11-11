export interface LeadershipMember {
  name: string;
  titleVi: string;
  titleEn: string;
  honorVi?: string;
  spokespersonFor?: string;
}

export interface CompanyInfo {
  legalNameVi: string;
  legalNameEn: string;
  shortName: string;
  brandName: string;
  taxCode: string;
  foundingYear: number;
  incorporatedDate: string;
  headquarters: {
    addressVi: string;
    addressEn: string;
    sourcingHubVi: string;
    sourcingHubEn: string;
  };
  facility: {
    area: string;
    investment: string;
    capacityMonthlyRaw: string;
    capacityMonthlyFinished: string;
    monthlyOutput: string;
    moq: string;
    leadTime: string;
    ratio: string;
    technology: string;
  };
  leadership: LeadershipMember[];
  contacts: {
    hotline: string;
    phoneDisplay: string;
    secondaryHotline: string;
    email: string;
    secondaryEmail: string;
    website: string;
    websiteDisplay: string;
  };
  auditStatus: {
    lastAudited: string;
    verifiedBy: string;
    reportFile: string;
  };
}

export const COMPANY_INFO: CompanyInfo = {
  legalNameVi: "CÔNG TY TNHH VINAXO",
  legalNameEn: "VINAXO COMPANY LIMITED",
  shortName: "Vinaxo Co., Ltd.",
  brandName: "VINAXO",
  taxCode: "1201611681",
  foundingYear: 2018,
  incorporatedDate: "27/08/2019",
  headquarters: {
    addressVi: "Khu phố 5, Xã Vĩnh Bình, Tỉnh Đồng Tháp, Việt Nam",
    addressEn: "Quarter 5, Vinh Binh Commune, Dong Thap Province, Vietnam",
    sourcingHubVi: "Đồng Tháp, Tiền Giang, Vĩnh Long (Đồng bằng Sông Cửu Long)",
    sourcingHubEn: "Dong Thap, Tien Giang, Vinh Long (Mekong Delta Hub)",
  },
  facility: {
    area: "25,000 m²",
    investment: "15 tỷ VNĐ (giai đoạn đầu)",
    capacityMonthlyRaw: "1,000+ tấn trái cây tươi / tháng",
    capacityMonthlyFinished: "300 tấn thành phẩm / tháng",
    monthlyOutput: "300 t",
    moq: "200 kg",
    leadTime: "2–4 weeks",
    ratio: "10 kg trái cây tươi qua sấy cho ra 1 kg thành phẩm sấy dẻo hảo hạng",
    technology: "Sấy dẻo nhiệt thấp (~60°C), sấy thăng hoa, chiên sấy chân không & máy ly tâm tách dầu",
  },
  leadership: [
    {
      name: "Nguyễn Anh Khoa",
      titleVi: "Giám đốc điều hành & Đại diện pháp luật",
      titleEn: "Managing Director & Legal Representative",
      honorVi: "Danh hiệu 'Nông dân sản xuất, kinh doanh giỏi' cấp tỉnh (UBND tỉnh trao tặng)",
    },
    {
      name: "Hoàng Thị Thu Thảo",
      titleVi: "Đồng sáng lập & Phó Giám đốc / Tổng Giám đốc",
      titleEn: "Co-Founder & Deputy / General Director",
      honorVi: "Giải Nhì cuộc thi 'Ý tưởng sáng tạo khởi nghiệp cấp tỉnh' (Hội LHPN tỉnh trao tặng)",
    },
    {
      name: "Hoàng Mạnh Cường",
      titleVi: "Giám đốc kinh doanh",
      titleEn: "Commercial & Business Director",
      spokespersonFor: "Đại diện phát ngôn trên Báo Người Lao Động, CafeF, 24H, SGGP",
    },
  ],
  contacts: {
    hotline: "+84984815016",
    phoneDisplay: "(+84) 984 815 016",
    secondaryHotline: "+84 907 494 177",
    email: "cuonghoang0710@gmail.com",
    secondaryEmail: "thaovinaxo@gmail.com",
    website: "https://www.vinaxo.net",
    websiteDisplay: "www.vinaxo.net",
  },
  auditStatus: {
    lastAudited: "2026-11-10",
    verifiedBy: "Vinaxo Brochure 2026 & Corporate Verification",
    reportFile: "VINAXO_CONTENT_AUDIT.md",
  },
};
