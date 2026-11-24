import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(username.trim(), password);
      if (res.ok) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setErrorMsg(res.error || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
      }
    } catch {
      setErrorMsg('Đã xảy ra lỗi khi kết nối máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFF7EC',
      padding: '24px 16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(58, 37, 27, 0.08)',
        border: '1.5px solid #EADFCC',
        overflow: 'hidden'
      }}>
        {/* Header Bar */}
        <div style={{
          backgroundColor: '#3A251B',
          padding: '28px 24px',
          textAlign: 'center',
          borderBottom: '3px solid #F4A83A'
        }}>
          <img
            src="/assets/logo/vinaxo-brochure-badge.png"
            alt="VINAXO Logo"
            style={{ height: '48px', width: 'auto', marginBottom: '12px', borderRadius: '4px' }}
          />
          <h1 style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 4px 0', letterSpacing: '0.02em' }}>
            QUẢN TRỊ NỘI DUNG VINAXO
          </h1>
          <p style={{ color: '#F4A83A', fontSize: '0.82rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Hệ thống Quản lý Doanh nghiệp (CMS)
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '32px 28px' }}>
          {errorMsg && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #F87171',
              color: '#B91C1C',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#3A251B', marginBottom: '8px' }}>
                Tên đăng nhập
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6E6259' }}>
                  <User size={18} />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 14px 11px 40px',
                    borderRadius: '8px',
                    border: '1.5px solid #D1C7BD',
                    fontSize: '0.95rem',
                    color: '#3A251B',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#F4A83A')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1C7BD')}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#3A251B', marginBottom: '8px' }}>
                Mật khẩu
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6E6259' }}>
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '11px 40px 11px 40px',
                    borderRadius: '8px',
                    border: '1.5px solid #D1C7BD',
                    fontSize: '0.95rem',
                    color: '#3A251B',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#F4A83A')}
                  onBlur={(e) => (e.target.style.borderColor = '#D1C7BD')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6E6259',
                    padding: 0
                  }}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: isSubmitting ? '#EADFCC' : '#F4A83A',
                color: isSubmitting ? '#6E6259' : '#3A251B',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <span>Đang xác thực...</span>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Đăng Nhập Quản Trị</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #F0EAE1', paddingTop: '18px' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.86rem',
                color: '#6E6259',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              <ArrowLeft size={15} />
              <span>Quay về Website chính VINAXO</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

