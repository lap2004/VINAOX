import React, { useState, useEffect } from 'react';
import { 
  Building, 
  FileText, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  X,
  Phone,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface CompanySettings {
  company_name_vi: string;
  company_name_en: string;
  tax_id: string;
  address_vi: string;
  legal_rep_vi: string;
  hotline: string;
  email: string;
  website: string;
}

interface BrochureSettings {
  title_vi: string;
  title_en: string;
  year: string;
  pdf_file: string;
  download_enabled: boolean;
}

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'company' | 'brochure'>('company');

  const [companyData, setCompanyData] = useState<CompanySettings>({
    company_name_vi: 'CÔNG TY TNHH VINAXO',
    company_name_en: 'VINAXO COMPANY LIMITED (Vinaxo Co., Ltd.)',
    tax_id: '1201611681',
    address_vi: 'Khu phố 5, Xã Vĩnh Bình, Tỉnh Đồng Tháp, Việt Nam',
    legal_rep_vi: 'Ông Hoàng Mạnh Cường (Jimmy)',
    hotline: '(+84) 984 815 016',
    email: 'cuonghoang0710@gmail.com',
    website: 'www.vinaxo.net'
  });

  const [brochureData, setBrochureData] = useState<BrochureSettings>({
    title_vi: 'Hồ Sơ Năng Lực & Brochure VINAXO 2026',
    title_en: 'VINAXO Company Profile & Brochure 2026',
    year: '2026',
    pdf_file: '/brochures/vinaxo-company-brochure-2026.pdf',
    download_enabled: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch initial settings from server
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const compRes = await fetch('/api/admin/settings?section=company');
        if (compRes.ok) {
          const compJson = await compRes.json();
          if (compJson.data && Object.keys(compJson.data).length > 0) {
            setCompanyData(prev => ({ ...prev, ...compJson.data }));
          }
        }

        const brocRes = await fetch('/api/admin/settings?section=brochure');
        if (brocRes.ok) {
          const brocJson = await brocRes.json();
          if (brocJson.data && Object.keys(brocJson.data).length > 0) {
            setBrochureData(prev => ({ ...prev, ...brocJson.data }));
          }
        }
      } catch {
        // Fall back to default
      }
    };
    fetchSettings();
  }, []);

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setStatusMsg(null);
      const res = await fetch('/api/admin/settings?section=company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg({ type: 'success', text: 'Cập nhật thông tin doanh nghiệp thành công!' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Không thể lưu cài đặt.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi kết nối khi gửi cài đặt.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBrochure = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setStatusMsg(null);
      const res = await fetch('/api/admin/settings?section=brochure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brochureData)
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg({ type: 'success', text: 'Cập nhật cấu hình Brochure thành công!' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Không thể lưu cài đặt.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi kết nối khi gửi cài đặt.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3A251B', margin: '0 0 4px 0' }}>
          Cài đặt Hệ thống & Doanh nghiệp
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#6E6259', margin: 0 }}>
          Quản lý thông tin pháp nhân doanh nghiệp, đường dây nóng và cấu hình tài liệu Brochure
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #EADCCE', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('company')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'company' ? '3px solid #E28D1B' : '3px solid transparent',
            color: activeTab === 'company' ? '#3A251B' : '#8C7E74',
            fontWeight: activeTab === 'company' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            marginBottom: '-2px'
          }}
        >
          <Building size={16} />
          <span>Thông tin doanh nghiệp</span>
        </button>

        <button
          onClick={() => setActiveTab('brochure')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'brochure' ? '3px solid #E28D1B' : '3px solid transparent',
            color: activeTab === 'brochure' ? '#3A251B' : '#8C7E74',
            fontWeight: activeTab === 'brochure' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            marginBottom: '-2px'
          }}
        >
          <FileText size={16} />
          <span>Brochure & Hồ sơ năng lực</span>
        </button>
      </div>

      {/* Alert */}
      {statusMsg && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: statusMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
          border: `1px solid ${statusMsg.type === 'success' ? '#10B981' : '#EF4444'}`,
          color: statusMsg.type === 'success' ? '#065F46' : '#991B1B'
        }}>
          {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{statusMsg.text}</span>
          <button
            onClick={() => setStatusMsg(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Company Tab */}
      {activeTab === 'company' && (
        <form onSubmit={handleSaveCompany} style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #EADCCE',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(58, 37, 27, 0.04)'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#E28D1B" />
            <span>Pháp nhân & Địa chỉ</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Tên công ty (Tiếng Việt) *
              </label>
              <input
                type="text"
                required
                value={companyData.company_name_vi}
                onChange={(e) => setCompanyData({ ...companyData, company_name_vi: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Tên công ty (Tiếng Anh) *
              </label>
              <input
                type="text"
                required
                value={companyData.company_name_en}
                onChange={(e) => setCompanyData({ ...companyData, company_name_en: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Mã số thuế (Tax ID) *
              </label>
              <input
                type="text"
                required
                value={companyData.tax_id}
                onChange={(e) => setCompanyData({ ...companyData, tax_id: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Người đại diện pháp luật
              </label>
              <input
                type="text"
                value={companyData.legal_rep_vi}
                onChange={(e) => setCompanyData({ ...companyData, legal_rep_vi: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
              Địa chỉ trụ sở doanh nghiệp
            </label>
            <input
              type="text"
              value={companyData.address_vi}
              onChange={(e) => setCompanyData({ ...companyData, address_vi: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
            />
          </div>

          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: '24px 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={18} color="#E28D1B" />
            <span>Kênh liên lạc & Website</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Đường dây nóng / Hotline *
              </label>
              <input
                type="text"
                required
                value={companyData.hotline}
                onChange={(e) => setCompanyData({ ...companyData, hotline: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Email liên hệ *
              </label>
              <input
                type="email"
                required
                value={companyData.email}
                onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Địa chỉ Website
              </label>
              <input
                type="text"
                value={companyData.website}
                onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#F4A83A',
                color: '#3A251B',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 6px rgba(244, 168, 58, 0.3)'
              }}
            >
              <Save size={16} />
              <span>{isSaving ? 'Đang lưu...' : 'Lưu thông tin doanh nghiệp'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Brochure Tab */}
      {activeTab === 'brochure' && (
        <form onSubmit={handleSaveBrochure} style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #EADCCE',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(58, 37, 27, 0.04)'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3A251B', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck size={18} color="#E28D1B" />
            <span>Cấu hình Hồ sơ năng lực (Brochure)</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Tiêu đề tài liệu (Tiếng Việt) *
              </label>
              <input
                type="text"
                required
                value={brochureData.title_vi}
                onChange={(e) => setBrochureData({ ...brochureData, title_vi: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Tiêu đề tài liệu (Tiếng Anh) *
              </label>
              <input
                type="text"
                required
                value={brochureData.title_en}
                onChange={(e) => setBrochureData({ ...brochureData, title_en: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Năm ấn bản *
              </label>
              <input
                type="text"
                required
                value={brochureData.year}
                onChange={(e) => setBrochureData({ ...brochureData, year: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                File PDF tài liệu (Đường dẫn tĩnh)
              </label>
              <input
                type="text"
                required
                value={brochureData.pdf_file}
                onChange={(e) => setBrochureData({ ...brochureData, pdf_file: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', color: '#3A251B', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={brochureData.download_enabled}
                onChange={(e) => setBrochureData({ ...brochureData, download_enabled: e.target.checked })}
              />
              <span>Cho phép đối tác tải trực tiếp file PDF trên website</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#F4A83A',
                color: '#3A251B',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 6px rgba(244, 168, 58, 0.3)'
              }}
            >
              <Save size={16} />
              <span>{isSaving ? 'Đang lưu...' : 'Lưu cấu hình Brochure'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminSettings;
