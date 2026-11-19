'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Icon } from '@/components/ui/Icon';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, isLoading, isAuthenticated, hasRole, getDefaultRedirectForRole } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-on-surface-variant font-label-md text-label-md">
          Memverifikasi hak akses pengguna...
        </p>
      </div>
    );
  }

  // Jika belum login, redirect atau tampilkan pesan login
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-space-lg">
        <div className="max-w-md w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-xl text-center shadow-xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-error/10 text-error flex items-center justify-center mb-space-md">
            <Icon name="lock" size={28} />
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">
            Sesi Diperlukan
          </h2>
          <p className="text-on-surface-variant text-body-md mb-space-lg">
            Anda harus masuk ke akun ProSphere AI terlebih dahulu untuk membuka halaman ini.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-space-md rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity shadow-md"
          >
            <Icon name="login" size={18} />
            <span>Menuju Halaman Login</span>
          </Link>
        </div>
      </div>
    );
  }

  // Jika role tidak diizinkan, tampilkan Access Denied 403 yang elegan
  if (!hasRole(allowedRoles)) {
    const roleLabels: Record<UserRole, string> = {
      SUPER_ADMIN: 'Super Admin',
      STAFF_SALES_CS: 'Staff Sales & Customer Service',
      STAFF_MARKETING: 'Staff Marketing',
    };

    const fallbackUrl = getDefaultRedirectForRole();

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-space-lg">
        <div className="max-w-lg w-full bg-surface-container-low border border-error/30 rounded-2xl p-space-xl text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-error to-error-container" />

          <div className="w-16 h-16 mx-auto rounded-2xl bg-error/10 text-error flex items-center justify-center mb-space-md ring-8 ring-error/5">
            <Icon name="block" size={32} />
          </div>

          <span className="inline-block px-space-sm py-0.5 rounded-full bg-error/10 text-error font-label-sm text-label-sm font-bold uppercase tracking-wider mb-2">
            403 · Access Denied
          </span>

          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">
            Akses Ditolak
          </h2>

          <p className="text-on-surface-variant text-body-md mb-space-md leading-relaxed">
            Role akun Anda (<strong className="text-on-surface">{roleLabels[user.role]}</strong>) tidak memiliki izin untuk mengakses fitur ini. Hak akses dibatasi demi keamanan operasional sistem.
          </p>

          <div className="bg-surface-container/60 border border-outline-variant/20 rounded-xl p-space-sm text-left mb-space-lg font-mono text-label-sm text-outline">
            <div>Pengguna: {user.name} ({user.email})</div>
            <div>Wewenang Diperlukan: {allowedRoles.map((r) => roleLabels[r]).join(' atau ')}</div>
          </div>

          <Link
            href={fallbackUrl}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-space-md rounded-xl bg-surface-variant hover:bg-surface-container-high text-on-surface font-semibold transition-colors border border-outline-variant/30"
          >
            <Icon name="arrow_back" size={18} />
            <span>Kembali ke Menu Utama Anda</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
