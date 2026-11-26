import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  CheckCircle, 
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { adminFetch } from '../lib/adminFetch';
import { MediaPicker } from '../components/MediaPicker';

export interface CertificateItem {
  id: string;
  code: string;
  pillLabel: string;
  name: string;
  nameVi: string;
  nameEn: string;
  nameKo?: string;
  nameZh?: string;
  kindEn: 'Certification' | 'Registration' | 'Audit';
  kindVi: 'Chứng nhận' | 'Đăng ký' | 'Kiểm toán';
  kindKo?: string;
  kindZh?: string;
  scopeEn: string;
  scopeVi: string;
  scopeKo?: string;
  scopeZh?: string;
  certImageWebp: string;
  certImageJpg?: string;
  order: number;
  published: boolean;
}

const EMPTY_CERT: CertificateItem = {
  id: '',
  code: '',
  pillLabel: '',
  name: '',
  nameVi: '',
  nameEn: '',
  nameKo: '',
  nameZh: '',
  kindEn: 'Certification',
  kindVi: 'Chứng nhận',
  kindKo: '인증',
  kindZh: '认证',
  scopeEn: '',
  scopeVi: '',
  scopeKo: '',
  scopeZh: '',
  certImageWebp: '/assets/images/certs-2026/cert-brcgs.webp',
  order: 1,
  published: true
};

export const AdminCertificates: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [certToDelete, setCertToDelete] = useState<CertificateItem | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await adminFetch('/api/admin/certificates');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.certificates)) {
          setCertificates(data.certificates);
        }
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Không thể kết nối máy chủ để tải chứng nhận.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    try {
      setIsSaving(true);
      setStatusMsg(null);

      const res = await adminFetch('/api/admin/certificates', {
        method: 'POST',
        body: JSON.stringify(editingCert)
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg({ type: 'success', text: `Lưu chứng nhận "${editingCert.nameVi || editingCert.code}" thành công!` });
        setEditingCert(null);
        setIsCreating(false);
        fetchCertificates();
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Lỗi khi lưu chứng nhận.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi mạng khi lưu chứng nhận.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCert = async () => {
    if (!certToDelete) return;
    try {
      setIsDeleting(true);
      const res = await adminFetch('/api/admin/certificates', {
        method: 'DELETE',
        body: JSON.stringify({ id: certToDelete.id })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg({ type: 'success', text: `Đã xóa chứng nhận "${certToDelete.nameVi || certToDelete.code}" thành công.` });
        setCertToDelete(null);
        fetchCertificates();
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Lỗi khi xóa chứng nhận.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi mạng khi xóa chứng nhận.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMoveOrder = async (cert: CertificateItem, direction: 'up' | 'down') => {
    const idx = certificates.findIndex(c => c.id === cert.id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === certificates.length - 1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const nextList = [...certificates];
    const tempOrder = nextList[idx].order;
    nextList[idx].order = nextList[swapIdx].order;
    nextList[swapIdx].order = tempOrder;

    const temp = nextList[idx];
    nextList[idx] = nextList[swapIdx];
    nextList[swapIdx] = temp;

    setCertificates(nextList);

    try {
      await adminFetch('/api/admin/certificates', {
        method: 'POST',
        body: JSON.stringify(nextList[idx])
      });
      await adminFetch('/api/admin/certificates', {
        method: 'POST',
        body: JSON.stringify(nextList[swapIdx])
      });
    } catch {}
  };

  const handlePublishCertificatesModule = async () => {
    try {
      setIsPublishing(true);
      setStatusMsg(null);
      const res = await adminFetch('/api/admin/publish', {
        method: 'POST',
        body: JSON.stringify({ module: 'certificates' })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatusMsg({ type: 'success', text: `Đã kích hoạt xuất bản danh mục chứng nhận lên website!` });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Lỗi khi xuất bản nhóm chứng nhận.' });
      }
    } catch {
      setStatusMsg({ type: 'error', text: 'Lỗi mạng khi xuất bản nhóm chứng nhận.' });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3A251B', margin: '0 0 4px 0' }}>
            Quản lý Chứng nhận & Kiểm định Quốc tế
          </h1>
          <p style={{ fontSize: '0.86rem', color: '#6E6259', margin: 0 }}>
            Hệ thống {certificates.length} chứng chỉ quốc tế và tiêu chuẩn chất lượng xuất khẩu của VINAXO.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handlePublishCertificatesModule}
            disabled={isPublishing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '8px',
              border: '1px solid #10B981',
              backgroundColor: '#ECFDF5',
              color: '#065F46',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: isPublishing ? 'not-allowed' : 'pointer'
            }}
          >
            <Sparkles size={16} />
            <span>{isPublishing ? 'Đang cập nhật...' : 'Cập nhật chứng nhận lên website'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const nextOrder = certificates.length + 1;
              setEditingCert({ ...EMPTY_CERT, order: nextOrder, id: `cert-${nextOrder}`, code: `CERT-${nextOrder}` });
              setIsCreating(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#F4A83A',
              color: '#3A251B',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(244, 168, 58, 0.3)'
            }}
          >
            <Plus size={16} />
            <span>Thêm chứng nhận mới</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: statusMsg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
          border: `1px solid ${statusMsg.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
          color: statusMsg.type === 'success' ? '#065F46' : '#991B1B',
          fontSize: '0.88rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {statusMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{statusMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMsg(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Certificates Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #EADCCE',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#FAF6F0', borderBottom: '1px solid #EADCCE' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B', width: '50px' }}>Thứ tự</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B', width: '70px' }}>Bản scan</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B' }}>Mã & Tiêu chuẩn</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B' }}>Phạm vi đánh giá (Scope)</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B', width: '110px' }}>Phân loại</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B', width: '100px' }}>Trạng thái</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, color: '#3A251B', textAlign: 'right', width: '140px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#8C7E74' }}>
                    Đang tải danh sách chứng nhận...
                  </td>
                </tr>
              ) : certificates.map((cert, idx) => (
                <tr
                  key={cert.id || idx}
                  style={{
                    borderBottom: '1px solid #F5EFE6',
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FFFDF9'
                  }}
                >
                  {/* Order */}
                  <td style={{ padding: '12px 14px', color: '#8C7E74', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{cert.order || idx + 1}</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(cert, 'up')}
                          disabled={idx === 0}
                          style={{ border: 'none', background: 'none', cursor: idx === 0 ? 'default' : 'pointer', padding: 0, opacity: idx === 0 ? 0.3 : 1 }}
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(cert, 'down')}
                          disabled={idx === certificates.length - 1}
                          style={{ border: 'none', background: 'none', cursor: idx === certificates.length - 1 ? 'default' : 'pointer', padding: 0, opacity: idx === certificates.length - 1 ? 0.3 : 1 }}
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Thumbnail */}
                  <td style={{ padding: '12px 14px' }}>
                    <img
                      src={cert.certImageWebp}
                      alt={cert.code}
                      style={{
                        width: '48px',
                        height: '64px',
                        objectFit: 'contain',
                        borderRadius: '4px',
                        border: '1px solid #EADCCE',
                        backgroundColor: '#FAF6F0'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/certs-2026/cert-brcgs.webp';
                      }}
                    />
                  </td>

                  {/* Code & Name */}
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: '#FEF3C7',
                        color: '#92400E'
                      }}>
                        {cert.code}
                      </span>
                      <span style={{ fontWeight: 700, color: '#3A251B' }}>
                        {cert.nameVi || cert.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#8C7E74' }}>
                      {cert.nameEn}
                    </div>
                  </td>

                  {/* Scope */}
                  <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#6E6259' }}>
                    <div style={{ marginBottom: '2px' }}>{cert.scopeVi}</div>
                    <div style={{ fontSize: '0.75rem', color: '#8C7E74' }}>{cert.scopeEn}</div>
                  </td>

                  {/* Kind */}
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      backgroundColor: cert.kindEn === 'Certification' ? '#ECFDF5' : cert.kindEn === 'Registration' ? '#EFF6FF' : '#F5F3FF',
                      color: cert.kindEn === 'Certification' ? '#065F46' : cert.kindEn === 'Registration' ? '#1E40AF' : '#5B21B6'
                    }}>
                      {cert.kindVi}
                    </span>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      backgroundColor: cert.published !== false ? '#ECFDF5' : '#F3F4F6',
                      color: cert.published !== false ? '#065F46' : '#6B7280'
                    }}>
                      {cert.published !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                      {cert.published !== false ? 'Công khai' : 'Ẩn'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCert({ ...cert });
                          setIsCreating(false);
                        }}
                        title="Chỉnh sửa chứng nhận"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #EADCCE',
                          backgroundColor: '#FFFFFF',
                          color: '#3A251B',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit3 size={13} />
                        <span>Sửa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCertToDelete(cert)}
                        title="Xóa chứng nhận"
                        style={{
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid #FECACA',
                          backgroundColor: '#FFFFFF',
                          color: '#DC2626',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit & Create Modal */}
      {editingCert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(58, 37, 27, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #EADCCE', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#D97706" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#3A251B', margin: 0 }}>
                  {isCreating ? 'Thêm chứng nhận mới' : `Chỉnh sửa: ${editingCert.code}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingCert(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6E6259' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCert}>
              {/* Code & Kind */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Mã định danh (ID / Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.code}
                    onChange={(e) => {
                      const val = e.target.value;
                      const slug = val.toLowerCase().replace(/[^a-z0-9]/g, '-');
                      setEditingCert({ ...editingCert, code: val, id: isCreating ? slug : editingCert.id });
                    }}
                    placeholder="VD: BRCGS, FDA, ISO-22000"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Phân loại
                  </label>
                  <select
                    value={editingCert.kindEn}
                    onChange={(e) => {
                      const val = e.target.value as 'Certification' | 'Registration' | 'Audit';
                      setEditingCert({
                        ...editingCert,
                        kindEn: val,
                        kindVi: val === 'Registration' ? 'Đăng ký' : val === 'Audit' ? 'Kiểm toán' : 'Chứng nhận',
                        kindKo: val === 'Registration' ? '등록' : val === 'Audit' ? '심사' : '인증',
                        kindZh: val === 'Registration' ? '注册' : val === 'Audit' ? '审核' : '认证',
                      });
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  >
                    <option value="Certification">Chứng nhận (Certification)</option>
                    <option value="Registration">Đăng ký chính phủ (Registration)</option>
                    <option value="Audit">Kiểm toán trách nhiệm (Audit)</option>
                  </select>
                </div>
              </div>

              {/* Name VI / EN */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Tên chứng chỉ (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.nameVi}
                    onChange={(e) => setEditingCert({ ...editingCert, nameVi: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Tên chứng chỉ (Tiếng Anh) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.nameEn}
                    onChange={(e) => setEditingCert({ ...editingCert, nameEn: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Name KO / ZH-CN */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Tên chứng chỉ (한국어)
                  </label>
                  <input
                    type="text"
                    value={editingCert.nameKo || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, nameKo: e.target.value })}
                    placeholder="예: BRCGS 식품 안전 인증"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Tên chứng chỉ (简体中文)
                  </label>
                  <input
                    type="text"
                    value={editingCert.nameZh || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, nameZh: e.target.value })}
                    placeholder="例如：BRCGS 食品安全认证"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Scope VI / EN */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                  Phạm vi kiểm toán & đánh giá (Tiếng Việt)
                </label>
                <textarea
                  rows={2}
                  value={editingCert.scopeVi}
                  onChange={(e) => setEditingCert({ ...editingCert, scopeVi: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                  Phạm vi kiểm toán & đánh giá (Tiếng Anh)
                </label>
                <textarea
                  rows={2}
                  value={editingCert.scopeEn}
                  onChange={(e) => setEditingCert({ ...editingCert, scopeEn: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              {/* Scope KO / ZH-CN */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Phạm vi kiểm toán & đánh giá (한국어)
                  </label>
                  <textarea
                    rows={2}
                    value={editingCert.scopeKo || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, scopeKo: e.target.value })}
                    placeholder="심사 범위 (한국어)..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#3A251B', marginBottom: '6px' }}>
                    Phạm vi kiểm toán & đánh giá (简体中文)
                  </label>
                  <textarea
                    rows={2}
                    value={editingCert.scopeZh || ''}
                    onChange={(e) => setEditingCert({ ...editingCert, scopeZh: e.target.value })}
                    placeholder="审核范围 (简体中文)..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #EADCCE', fontSize: '0.88rem', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Image Picker */}
              <div style={{ marginBottom: '16px', padding: '14px', borderRadius: '8px', backgroundColor: '#FAF6F0', border: '1px solid #EADCCE' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#3A251B', marginBottom: '8px' }}>
                  Bản quét chứng nhận (Hình ảnh)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <img
                    src={editingCert.certImageWebp}
                    alt={editingCert.code}
                    style={{ width: '60px', height: '80px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #EADCCE', backgroundColor: '#FFFFFF' }}
                  />
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#6E6259', marginBottom: '6px', wordBreak: 'break-all' }}>
                      Đường dẫn: <code>{editingCert.certImageWebp}</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 14px',
                        borderRadius: '6px',
                        border: '1px solid #EADCCE',
                        backgroundColor: '#FFFFFF',
                        color: '#3A251B',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      <ImageIcon size={14} color="#D97706" />
                      <span>Chọn bản scan từ thư viện</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #EADCCE' }}>
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '6px',
                    border: '1px solid #EADCCE',
                    backgroundColor: '#FFFFFF',
                    color: '#6E6259',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#F4A83A',
                    color: '#3A251B',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 6px rgba(244, 168, 58, 0.3)'
                  }}
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Đang lưu...' : 'Lưu chứng nhận'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {certToDelete && (
        <div
          onClick={() => !isDeleting && setCertToDelete(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20, 10, 5, 0.7)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#DC2626' }}>
              <AlertCircle size={22} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#3A251B' }}>
                Xác nhận xóa chứng nhận
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#6E6259', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Bạn có chắc chắn muốn xóa chứng chỉ <strong>"{certToDelete.nameVi || certToDelete.code}"</strong> khỏi danh mục hiển thị trên website?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setCertToDelete(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #EADCCE',
                  backgroundColor: '#FFFFFF',
                  color: '#6E6259',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteCert}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: isDeleting ? 'not-allowed' : 'pointer'
                }}
              >
                {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MediaPicker for Certificate Image */}
      <MediaPicker
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        initialCategory="certificates"
        currentValue={editingCert?.certImageWebp || ''}
        onSelect={(newUrl) => {
          if (editingCert) {
            setEditingCert({
              ...editingCert,
              certImageWebp: newUrl,
              certImageJpg: newUrl.endsWith('.webp') ? newUrl.replace(/\.webp$/, '.jpg') : newUrl
            });
          }
        }}
        title="Chọn bản scan chứng nhận"
      />
    </div>
  );
};

export default AdminCertificates;
