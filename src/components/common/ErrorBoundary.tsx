import { Component, ErrorInfo, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { RefreshCw, Home, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'root' | 'route' | 'component';
  title?: string;
  resetKey?: any;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error(`[VINAXO ErrorBoundary:${this.props.level || 'component'}] Caught exception:`, error, errorInfo);

    // Auto-recover if error is caused by chunk loading drift after a deployment
    const msg = error?.message || '';
    if (
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('error loading dynamically imported module') ||
      msg.includes('Importing a module script failed') ||
      msg.includes('Unexpected token')
    ) {
      const lastReload = sessionStorage.getItem('vinaxo_chunk_reload_ts');
      const now = Date.now();
      // Prevent infinite reload loops (allow at most 1 automatic reload per 30 seconds)
      if (!lastReload || now - parseInt(lastReload, 10) > 30000) {
        sessionStorage.setItem('vinaxo_chunk_reload_ts', String(now));
        console.warn('Chunk load error detected; automatically refreshing to load latest deployment assets...');
        window.location.reload();
      }
    }
  }

  private handleReload = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    const level = this.props.level || 'component';

    // 1. Root Level Fallback (Replaces entire app gracefully with branded recovery UI)
    if (level === 'root') {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF7F2',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '36px 32px',
            border: '1.5px solid #EADFCC',
            boxShadow: '0 10px 25px rgba(58, 37, 27, 0.08)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FFF7ED',
              color: '#F4A83A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '1.5px solid #FCD34D'
            }}>
              <ShieldCheck size={36} />
            </div>

            <h1 style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#3A251B',
              margin: '0 0 10px 0',
              lineHeight: 1.3
            }}>
              Hệ Thống Đang Cập Nhật Phiên Bản Mới
            </h1>

            <p style={{
              fontSize: '0.92rem',
              color: '#6E6259',
              lineHeight: 1.6,
              margin: '0 0 24px 0'
            }}>
              Website vừa được triển khai bản nội dung mới nhất. Bạn chỉ cần tải lại trang để hiển thị đầy đủ giao diện và dữ liệu vừa xuất bản.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#F4A83A',
                  color: '#3A251B',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(244, 168, 58, 0.35)'
                }}
              >
                <RefreshCw size={16} />
                <span>Tải lại trang ngay</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#3A251B',
                  border: '1.5px solid #D1C7BD',
                  padding: '12px 20px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer'
                }}
              >
                <Home size={16} />
                <span>Về trang chủ</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 2. Route Level Fallback (Inside MainLayout, retains Header & Footer)
    if (level === 'route') {
      return (
        <div style={{
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          backgroundColor: '#FAF7F2'
        }}>
          <div style={{
            maxWidth: '480px',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '32px 24px',
            border: '1px solid #EADFCC'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertTriangle size={26} />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#3A251B', margin: '0 0 8px 0' }}>
              {this.props.title || 'Nội dung đang được làm mới'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#6E6259', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Mục này tạm thời không thể hiển thị do cập nhật dữ liệu. Các phần khác của website vẫn hoạt động bình thường.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F4A83A',
                  color: '#3A251B',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={14} />
                <span>Thử lại</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  color: '#3A251B',
                  border: '1px solid #D1C7BD',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                <Home size={14} />
                <span>Trang chủ</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 3. Component Level Fallback (Isolates single corrupted card)
    return (
      <div style={{
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: '#FAF7F2',
        border: '1px dashed #D1C7BD',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: '#8C827A'
      }}>
        <span>Không thể hiển thị mục này ({this.props.title || 'Dữ liệu đang cập nhật'})</span>
      </div>
    );
  }
}

/**
 * Route-aware Error Boundary that automatically resets its error state
 * upon navigating to a new URL pathname.
 */
export const RouteErrorBoundary: React.FC<ErrorBoundaryProps> = (props) => {
  const location = useLocation();
  return (
    <ErrorBoundary
      key={location.pathname}
      resetKey={location.pathname}
      {...props}
    />
  );
};
