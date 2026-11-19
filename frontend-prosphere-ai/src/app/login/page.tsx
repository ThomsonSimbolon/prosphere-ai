'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Icon } from '@/components/ui/Icon';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Silakan isi email dan password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await login(email, password);
    if (!res.success) {
      setErrorMessage(res.message || 'Login gagal. Periksa kembali email dan password Anda.');
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-space-md relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-surface-container-low/90 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-space-xl shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-space-lg">
          <Link href="/" className="inline-flex items-center gap-space-xs mb-3 hover:opacity-90 transition-opacity">
            <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-extrabold">
              ProSphere
            </span>
            <span className="font-label-md text-label-md bg-primary-container text-on-primary-container px-2 py-0.5 rounded-md font-bold">
              AI
            </span>
          </Link>
          <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Portal Masuk
          </h1>
          <p className="font-label-md text-label-md text-on-surface-variant mt-1">
            Masuk untuk mengakses dashboard operasional Anda
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-space-md p-space-sm rounded-xl bg-error/10 border border-error/30 text-error flex items-start gap-2 text-label-md animate-fadeIn">
            <Icon name="error" size={18} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
          <div>
            <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                <Icon name="mail" size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@prosphere.ai"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors text-body-md"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                <Icon name="lock" size={18} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors text-body-md"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi Akun...</span>
              </>
            ) : (
              <>
                <Icon name="login" size={18} />
                <span>Masuk ke ProSphere AI</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Quick-Fill Bar */}
        <div className="mt-space-lg pt-space-md border-t border-outline-variant/20">
          <p className="text-center font-label-sm text-label-sm text-outline uppercase tracking-wider mb-2 font-semibold">
            Pintasan Akun Demo (Klik untuk Isi Cepat)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@prosphere.ai', 'admin123456')}
              className="py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-left transition-colors cursor-pointer"
            >
              <div className="font-bold text-label-sm text-primary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Admin
              </div>
              <div className="text-[10px] text-outline truncate">Super Admin</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('sales@prosphere.ai', 'sales123456')}
              className="py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-left transition-colors cursor-pointer"
            >
              <div className="font-bold text-label-sm text-secondary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Sales
              </div>
              <div className="text-[10px] text-outline truncate">Sales & CS</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('marketing@prosphere.ai', 'marketing123456')}
              className="py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-left transition-colors cursor-pointer"
            >
              <div className="font-bold text-label-sm text-tertiary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> Marketing
              </div>
              <div className="text-[10px] text-outline truncate">Marketing</div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-space-md text-center font-label-sm text-label-sm text-outline relative z-10">
        © 2026 ProSphere AI · Enterprise Multi-Role WhatsApp & CRM Automation
      </div>
    </div>
  );
}
