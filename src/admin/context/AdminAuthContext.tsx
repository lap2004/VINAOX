import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminFetch, setAdminCsrfToken, clearAdminCsrfToken } from '../lib/adminFetch';

interface AdminUser {
  username: string;
  role: string;
}

export interface RepoMeta {
  owner: string;
  repo: string;
  branch: string;
  vercelEnv: string;
  configuredBranchEnv?: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  repoMeta: RepoMeta | null;
  githubConfigured: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [repoMeta, setRepoMeta] = useState<RepoMeta | null>(null);
  const [githubConfigured, setGithubConfigured] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const res = await adminFetch('/api/admin/session', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setAdminCsrfToken(data.csrfToken);
          setRepoMeta(data.repo || null);
          setGithubConfigured(Boolean(data.githubConfigured));
        } else {
          setUser(null);
          clearAdminCsrfToken();
          setRepoMeta(null);
        }
      } else {
        setUser(null);
        clearAdminCsrfToken();
      }
    } catch {
      setUser(null);
      clearAdminCsrfToken();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (username: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await adminFetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setAdminCsrfToken(data.csrfToken);
        setUser(data.user);
        setRepoMeta(data.repo || null);
        setGithubConfigured(true);
        return { ok: true };
      } else {
        return { ok: false, error: data.error || 'Đăng nhập không thành công.' };
      }
    } catch (err: any) {
      return { ok: false, error: err?.message || 'Không thể kết nối đến máy chủ.' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await adminFetch('/api/admin/logout', { method: 'POST', body: JSON.stringify({}) });
    } catch {
      // Ignore errors on logout
    } finally {
      clearAdminCsrfToken();
      setUser(null);
      setRepoMeta(null);
      window.location.href = '/admin/login';
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        repoMeta,
        githubConfigured,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkSession
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
