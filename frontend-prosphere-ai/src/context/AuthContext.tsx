'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type UserRole = 'SUPER_ADMIN' | 'STAFF_SALES_CS' | 'STAFF_MARKETING';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  getDefaultRedirectForRole: (role?: UserRole) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const getDefaultRedirectForRole = (role?: UserRole): string => {
    const targetRole = role || user?.role;
    switch (targetRole) {
      case 'SUPER_ADMIN':
        return '/dashboard';
      case 'STAFF_SALES_CS':
        return '/chat-history';
      case 'STAFF_MARKETING':
        return '/bulk-messages';
      default:
        return '/login';
    }
  };

  // Validasi sesi token saat inisialisasi
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('prosphere_token');
        if (!savedToken) {
          setIsLoading(false);
          return;
        }

        setToken(savedToken);

        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
          cache: 'no-store',
        });

        const data = await res.json();
        if (data.success && data.data) {
          setUser(data.data);
        } else {
          // Token tidak valid atau akun dinonaktifkan
          localStorage.removeItem('prosphere_token');
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.warn('Failed to verify token with server:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) {
        return { success: false, message: data.message || 'Login gagal.' };
      }

      const { user: loggedInUser, token: authToken } = data.data;
      localStorage.setItem('prosphere_token', authToken);
      setUser(loggedInUser);
      setToken(authToken);

      const redirectPath = getDefaultRedirectForRole(loggedInUser.role);
      router.push(redirectPath);

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Gagal menghubungi server.' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      localStorage.removeItem('prosphere_token');
      setUser(null);
      setToken(null);
      router.push('/login');
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
        getDefaultRedirectForRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
