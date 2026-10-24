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
    ratio: string;
    technology: string;
  };
  leadership: LeadershipMember[];
  contacts: {
    hotline: string;
    phoneDisplay: string;
    email: string;
    website: string;
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
