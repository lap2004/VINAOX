import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Building, 
  FileText, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  X,
  ShieldCheck,
  FileCheck,
  Sparkles,
  Upload,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { adminFetch } from '../lib/adminFetch';
import { MediaPicker } from '../components/MediaPicker';
import { getGoogleMapsDirectionsUrl, getGoogleMapsEmbedUrl, getGoogleMapsSearchUrl } from '../../data/company';

interface CompanySettings {
  company_name_vi: string;
  company_name_en: string;
  tax_id: string;
  address_vi: string;
  address_en?: string;
  address_ko?: string;
  address_zh?: string;
  legal_rep_vi: string;
  factory_name_vi?: string;
  factory_name_en?: string;
  latitude?: number | string;
  longitude?: number | string;
  google_place_id?: string;
  hotline: string;
  email: string;
  website: string;
  whatsapp?: string;
  zalo?: string;
}

interface BrochureSettings {
  title_vi: string;
  title_en: string;
  title_ko?: string;
  title_zh?: string;
  year: string;
  pdf_file: string;
  pdf_file_ko?: string;
  pdf_file_zh?: string;
  download_enabled: boolean;
}

export const AdminSettings: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'company' | 'brochure'>(() =>
    location.pathname.includes('brochure') ? 'brochure' : 'company'
  );

  useEffect(() => {
    setActiveTab(location.pathname.includes('brochure') ? 'brochure' : 'company');
  }, [location.pathname]);

  const [companyData, setCompanyData] = useState<CompanySettings>({
    company_name_vi: 'CÔNG TY TNHH VINAXO',
    company_name_en: 'VINAXO COMPANY LIMITED',
    tax_id: '1201611681',
    address_vi: 'Khu phố 5, Xã Vĩnh Bình, Tỉnh Đồng Tháp, Việt Nam',
    address_en: 'Quarter 5, Vinh Binh Commune, Dong Thap Province, Vietnam',
    address_ko: '베트남 동탑성 빈빈 5구역',
    address_zh: '越南同塔省永平镇第5区',
    legal_rep_vi: 'Ông Hoàng Mạnh Cường (Jimmy)',
    factory_name_vi: 'Nhà Máy Chế Biến VINAXO',
    factory_name_en: 'VINAXO Processing Plant',
    latitude: 10.380295,
    longitude: 106.516139,
    google_place_id: '',
    hotline: '(+84) 984 815 016',
    email: 'cuonghoang0710@gmail.com',
    website: 'https://www.vinaxo.net/',
    whatsapp: 'https://wa.me/84984815016',
    zalo: 'https://zalo.me/0984815016'
  });

  const [brochureData, setBrochureData] = useState<BrochureSettings>({
    title_vi: 'Hồ Sơ Năng Lực & Brochure VINAXO 2026',
    title_en: 'VINAXO Company Profile & Brochure 2026',
    title_ko: 'VINAXO 기업 소개서 및 브로슈어 2026',
    title_zh: 'VINAXO 公司简介与产品手册 2026',
    year: '2026',
    pdf_file: '/brochures/vinaxo-company-brochure-2026.pdf',
    pdf_file_ko: '',
    pdf_file_zh: '',
    download_enabled: true
  });

  const [companySha, setCompanySha] = useState<string | undefined>(undefined);
  const [brochureSha, setBrochureSha] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const compRes = await adminFetch('/api/admin/settings?section=company');
        if (compRes.ok) {
          const compJson = await compRes.json();
          if (compJson.data && Object.keys(compJson.data).length > 0) {
            setCompanyData(prev => ({ ...prev, ...compJson.data }));
          }
          if (compJson.sha) setCompanySha(compJson.sha);
        }

        const brocRes = await adminFetch('/api/admin/settings?section=brochure');
        if (brocRes.ok) {
          const brocJson = await brocRes.json();
          if (brocJson.data && Object.keys(brocJson.data).length > 0) {
            setBrochureData(prev => ({ ...prev, ...brocJson.data }));
          }
          if (brocJson.sha) setBrochureSha(brocJson.sha);
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
      const res = await adminFetch('/api/admin/settings?section=company', {
        method: 'POST',
        body: JSON.stringify({ ...companyData, sha: companySha })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (data.result?.sha) setCompanySha(data.result.sha);
        setStatusMsg({ type: 'success', text: 'Lưu thông tin doanh nghiệp thành công!' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Không thể lưu cài đặt.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi kết nối khi gửi cài đặt.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishCompany = async () => {
    if (!window.confirm('Bạn có muốn xuất bản thông tin Doanh nghiệp lên website vinaxo.net?')) return;
    try {
      setIsPublishing(true);
      setStatusMsg(null);
      const res = await adminFetch('/api/admin/publish', {
        method: 'POST',
        body: JSON.stringify({ module: 'company' })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg({ type: 'success', text: data.message || 'Cập nhật Doanh nghiệp lên website thành công!' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Không thể cập nhật lên website.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi kết nối khi xuất bản module.' });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveBrochure = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setStatusMsg(null);
      const res = await adminFetch('/api/admin/settings?section=brochure', {
        method: 'POST',
        body: JSON.stringify({ ...brochureData, sha: brochureSha })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (data.result?.sha) setBrochureSha(data.result.sha);
        setStatusMsg({ type: 'success', text: 'Lưu cấu hình Brochure thành công!' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Không thể lưu cài đặt.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi kết nối khi gửi cài đặt.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishBrochure = async () => {
    if (!window.confirm('Bạn có muốn xuất bản cấu hình Brochure lên website vinaxo.net?')) return;
    try {
      setIsPublishing(true);
      setStatusMsg(null);
      const res = await adminFetch('/api/admin/publish', {
        method: 'POST',
        body: JSON.stringify({ module: 'brochure' })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg({ type: 'success', text: data.message || 'Cập nhật Brochure lên website thành công!' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Không thể cập nhật lên website.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi kết nối khi xuất bản module.' });
    } finally {
      setIsPublishing(false);
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
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1.5px solid #EADCCE', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('company')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'company' ? '3px solid #E28D1B' : '3px solid transparent',
            color: activeTab === 'company' ? '#3A251B' : '#8C827A',
            fontWeight: activeTab === 'company' ? 700 : 500,
            fontSize: '0.92rem',
            cursor: 'pointer'
          }}
        >
          <Building size={16} />
          <span>Thông tin Doanh nghiệp</span>
        </button>

        <button
          onClick={() => setActiveTab('brochure')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'brochure' ? '3px solid #E28D1B' : '3px solid transparent',
            color: activeTab === 'brochure' ? '#3A251B' : '#8C827A',
            fontWeight: activeTab === 'brochure' ? 700 : 500,
            fontSize: '0.92rem',
            cursor: 'pointer'
          }}
        >
          <FileText size={16} />
          <span>Hồ sơ năng lực (Brochure)</span>
        </button>
      </div>

      {/* Alert Messages */}
      {statusMsg && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem',
          backgroundColor: statusMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
          color: statusMsg.type === 'success' ? '#065F46' : '#991B1B',
          border: `1px solid ${statusMsg.type === 'success' ? '#A7F3D0' : '#FECACA'}`
        }}>
          {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ flex: 1 }}>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
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
            <span>Pháp nhân & Liên hệ Công ty</span>
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
                Người đại diện pháp luật *
              </label>
              <input
                type="text"
                required
                value={companyData.legal_rep_vi}
                onChange={(e) => setCompanyData({ ...companyData, legal_rep_vi: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Hotline / Đường dây nóng *
              </label>
              <input
                type="text"
                required
                value={companyData.hotline}
                onChange={(e) => setCompanyData({ ...companyData, hotline: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
              Địa chỉ trụ sở / Nhà máy (Tiếng Việt) *
            </label>
            <input
              type="text"
              required
              value={companyData.address_vi}
              onChange={(e) => setCompanyData({ ...companyData, address_vi: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Địa chỉ (English)
              </label>
              <input
                type="text"
                value={companyData.address_en || ''}
                onChange={(e) => setCompanyData({ ...companyData, address_en: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Địa chỉ (한국어 - KO)
              </label>
              <input
                type="text"
                value={companyData.address_ko || ''}
                onChange={(e) => setCompanyData({ ...companyData, address_ko: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Địa chỉ (简体中文 - ZH-CN)
              </label>
              <input
                type="text"
                value={companyData.address_zh || ''}
                onChange={(e) => setCompanyData({ ...companyData, address_zh: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Email liên hệ công khai *
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
                Địa chỉ Website (chuẩn https://)
              </label>
              <input
                type="text"
                value={companyData.website}
                onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                placeholder="https://www.vinaxo.net/"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                WhatsApp Link
              </label>
              <input
                type="text"
                value={companyData.whatsapp || ''}
                onChange={(e) => setCompanyData({ ...companyData, whatsapp: e.target.value })}
                placeholder="https://wa.me/84984815016"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Zalo Official Link
              </label>
              <input
                type="text"
                value={companyData.zalo || ''}
                onChange={(e) => setCompanyData({ ...companyData, zalo: e.target.value })}
                placeholder="https://zalo.me/0984815016"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{
            marginBottom: '20px',
            padding: '16px',
            borderRadius: '10px',
            backgroundColor: '#FAF7F2',
            border: '1px solid #EADCCE'
          }}>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#3A251B', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="#E28D1B" />
              <span>Vị trí Nhà máy & Google Maps (Single Source of Truth)</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#3A251B', marginBottom: '4px' }}>
                  Tên nhà máy (VI)
                </label>
                <input
                  type="text"
                  value={companyData.factory_name_vi || ''}
                  onChange={(e) => setCompanyData({ ...companyData, factory_name_vi: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box', backgroundColor: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#3A251B', marginBottom: '4px' }}>
                  Factory Name (EN)
                </label>
                <input
                  type="text"
                  value={companyData.factory_name_en || ''}
                  onChange={(e) => setCompanyData({ ...companyData, factory_name_en: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box', backgroundColor: '#FFF' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#3A251B', marginBottom: '4px' }}>
                  Vĩ độ (Latitude) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={companyData.latitude ?? ''}
                  onChange={(e) => setCompanyData({ ...companyData, latitude: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box', backgroundColor: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#3A251B', marginBottom: '4px' }}>
                  Kinh độ (Longitude) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={companyData.longitude ?? ''}
                  onChange={(e) => setCompanyData({ ...companyData, longitude: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box', backgroundColor: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#3A251B', marginBottom: '4px' }}>
                  Google Place ID (tùy chọn)
                </label>
                <input
                  type="text"
                  value={companyData.google_place_id || ''}
                  onChange={(e) => setCompanyData({ ...companyData, google_place_id: e.target.value })}
                  placeholder="ChIJ..."
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.86rem', boxSizing: 'border-box', backgroundColor: '#FFF' }}
                />
              </div>
            </div>

            {(() => {
              const previewLat = Number.isFinite(Number(companyData.latitude)) ? Number(companyData.latitude) : 10.380295;
              const previewLng = Number.isFinite(Number(companyData.longitude)) ? Number(companyData.longitude) : 106.516139;
              const previewLoc = {
                nameVi: companyData.factory_name_vi || 'Nhà Máy Chế Biến VINAXO',
                nameEn: companyData.factory_name_en || 'VINAXO Processing Plant',
                addressVi: companyData.address_vi,
                addressEn: companyData.address_en || '',
                latitude: previewLat,
                longitude: previewLng,
                placeId: companyData.google_place_id || '',
              };
              return (
                <div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <a
                      href={getGoogleMapsSearchUrl(previewLoc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#3A251B', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', backgroundColor: '#FFF', border: '1px solid #D1C7BD' }}
                    >
                      <span>Kiểm tra pin trên Google Maps</span>
                      <ExternalLink size={13} />
                    </a>
                    <a
                      href={getGoogleMapsDirectionsUrl(previewLoc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#3A251B', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', backgroundColor: '#FFF', border: '1px solid #D1C7BD' }}
                    >
                      <span>Kiểm tra link Chỉ đường</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                  <iframe
                    src={getGoogleMapsEmbedUrl(previewLoc, 'vi')}
                    title="Xem trước vị trí nhà máy VINAXO"
                    loading="lazy"
                    style={{ width: '100%', height: '220px', border: '1px solid #EADCCE', borderRadius: '8px', display: 'block', backgroundColor: '#FFF' }}
                  />
                </div>
              );
            })()}
          </div>

          <div style={{
            marginBottom: '20px',
            padding: '12px 14px',
            borderRadius: '8px',
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            fontSize: '0.8rem',
            color: '#92400E',
            lineHeight: 1.5
          }}>
            <strong>Lưu ý bảo mật cấu hình gửi email:</strong> Địa chỉ email hiển thị công khai ở trên được xuất ra website. Khóa API gửi thư (`RESEND_API_KEY` / `BREVO_API_KEY`) và địa chỉ nhận báo giá nội bộ phía máy chủ (`CONTACT_TO_EMAIL`) được cấu hình riêng trong Vercel Environment Variables, không lưu vào Git/JSON công khai.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handlePublishCompany}
              disabled={isPublishing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #10B981',
                backgroundColor: '#ECFDF5',
                color: '#065F46',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: isPublishing ? 'not-allowed' : 'pointer'
              }}
            >
              <Sparkles size={16} />
              <span>{isPublishing ? 'Đang cập nhật...' : 'Cập nhật Doanh nghiệp lên website'}</span>
            </button>

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

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Tiêu đề tài liệu (한국어 - KO)
              </label>
              <input
                type="text"
                value={brochureData.title_ko || ''}
                onChange={(e) => setBrochureData({ ...brochureData, title_ko: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                Tiêu đề tài liệu (简体中文 - ZH-CN)
              </label>
              <input
                type="text"
                value={brochureData.title_zh || ''}
                onChange={(e) => setBrochureData({ ...brochureData, title_zh: e.target.value })}
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
                File PDF tài liệu (Đường dẫn tĩnh) *
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  required
                  value={brochureData.pdf_file}
                  onChange={(e) => setBrochureData({ ...brochureData, pdf_file: e.target.value })}
                  style={{ flex: 1, padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #D1C7BD',
                    backgroundColor: '#FAF7F2',
                    color: '#3A251B',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Upload size={14} />
                  <span>Chọn file</span>
                </button>
              </div>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handlePublishBrochure}
              disabled={isPublishing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #10B981',
                backgroundColor: '#ECFDF5',
                color: '#065F46',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: isPublishing ? 'not-allowed' : 'pointer'
              }}
            >
              <Sparkles size={16} />
              <span>{isPublishing ? 'Đang cập nhật...' : 'Cập nhật Brochure lên website'}</span>
            </button>

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

      {showMediaPicker && (
        <MediaPicker
          isOpen={showMediaPicker}
          title="Chọn hoặc tải lên tài liệu Brochure"
          onSelect={(url) => {
            setBrochureData(prev => ({ ...prev, pdf_file: url }));
            setShowMediaPicker(false);
          }}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </div>
  );
};

export default AdminSettings;
