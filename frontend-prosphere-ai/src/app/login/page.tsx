'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Icon } from '@/components/ui/Icon';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Harap masukkan alamat email dan kata sandi Anda.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await login(email, password);
    if (!res.success) {
      setErrorMessage(res.message || 'Kredensial login tidak cocok. Periksa kembali email dan password.');
      setIsLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#03170b] text-[#d0e9d4] flex flex-col lg:grid lg:grid-cols-12 overflow-x-hidden font-body-md selection:bg-primary/20 selection:text-primary">
      {/* ========================================================= */}
      {/* LEFT COLUMN: BRAND STORY & ENTERPRISE SHOWCASE (7 COLS)   */}
      {/* ========================================================= */}
      <div className="hidden lg:flex lg:col-span-7 flex-col justify-between p-12 lg:p-16 relative bg-gradient-to-br from-[#062010] via-[#03170b] to-[#010e06] border-r border-[#424936]/30 overflow-hidden">
        {/* Ambient Decorative Lighting */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-[#4ae176]/10 rounded-full blur-[150px] pointer-events-none" />

        {/* Top Header: Brand */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#0f2417] border border-primary/40 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(158,233,57,0.3)]">
              <Icon name="auto_awesome" size={22} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-headline-sm font-extrabold tracking-tight text-on-surface">
                ProSphere
              </span>
              <span className="font-label-sm text-label-sm bg-primary text-[#1f3700] px-2 py-0.5 rounded-md font-extrabold">
                AI
              </span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f2417] border border-primary/30 text-xs font-semibold text-primary shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Enterprise Gateway v2.4</span>
          </div>
        </div>

        {/* Center Content: Main Value Proposition */}
        <div className="relative z-10 my-auto py-12 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/60 border border-outline-variant/30 text-xs font-semibold text-primary mb-6">
            <Icon name="verified_user" size={16} />
            <span>Autonomous WhatsApp Automation & CRM</span>
          </div>

          <h1 className="font-headline-lg text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-[1.15] mb-6">
            Kelola Ribuan Prospek WhatsApp Secara Cerdas & Otomatis.
          </h1>

          <p className="text-on-surface-variant text-base lg:text-lg leading-relaxed mb-10">
            Platform terpadu untuk tim sales, marketing, dan customer service dengan proteksi Anti-Ban 5-Layer serta kecerdasan Gemini AI.
          </p>

          {/* Three Floating Benefit Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/25 backdrop-blur-md hover:border-primary/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2.5">
                <Icon name="shield" size={18} />
              </div>
              <h4 className="font-bold text-sm text-on-surface mb-1">Anti-Ban 5-Layer</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Simulasi pengetikan manusia & jeda Gaussian acak.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/25 backdrop-blur-md hover:border-secondary/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-2.5">
                <Icon name="psychology" size={18} />
              </div>
              <h4 className="font-bold text-sm text-on-surface mb-1">Inbound AI Agent</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Respon otomatis 24/7 langsung di WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/25 backdrop-blur-md hover:border-tertiary/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center mb-2.5">
                <Icon name="lock" size={18} />
              </div>
              <h4 className="font-bold text-sm text-on-surface mb-1">RBAC Multi-Role</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Pemisahan wewenang Admin, Sales, & Marketing.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Operational Status & System Metrics */}
        <div className="relative z-10 pt-8 border-t border-[#424936]/20 flex items-center justify-between text-xs text-outline">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(74,225,118,0.8)]" />
            <span className="text-on-surface font-semibold">Baileys Gateway Connected</span>
            <span>· Multi-Device Protocol Active</span>
          </div>
          <span className="font-mono">MySQL Engine Online · 3306</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: LOGIN PORTAL & DEMO SELECTOR (5 COLS)       */}
      {/* ========================================================= */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative min-h-screen bg-[#021007]/90 backdrop-blur-2xl">
        {/* Navigation Return Button */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors py-1.5 px-3 rounded-lg hover:bg-surface-container"
          >
            <Icon name="arrow_back" size={16} />
            <span>Kembali ke Halaman Beranda</span>
          </Link>

          <span className="text-xs font-mono text-outline">v1.0.0 Stable</span>
        </div>

        {/* Center Container: Form Card */}
        <div className="my-auto max-w-md w-full mx-auto">
          {/* Header Title */}
          <div className="mb-7">
            <h2 className="font-headline-md text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2">
              Masuk ke Portal Kerja
            </h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Silakan masukkan kredensial akun Anda untuk mengakses workspace ProSphere AI.
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/30 text-error flex items-start gap-3 text-sm animate-fadeIn shadow-sm">
              <Icon name="error" size={20} className="shrink-0 mt-0.5" />
              <div className="leading-snug">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                Alamat Email Bisnis
              </label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  <Icon name="mail" size={18} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@prosphere.ai"
                  className="w-full pl-11 pr-4 py-3 bg-surface-container/70 border border-outline-variant/40 rounded-xl text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => alert('Untuk keamanan akun internal, silakan hubungi Super Admin untuk mereset kata sandi Anda.')}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Lupa Sandi?
                </button>
              </div>

              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                  <Icon name="lock" size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-surface-container/70 border border-outline-variant/40 rounded-xl text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors cursor-pointer"
                  title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={18} />
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-outline-variant/40 bg-surface-container text-primary focus:ring-primary cursor-pointer accent-primary"
              />
              <label htmlFor="remember" className="text-xs text-on-surface-variant font-medium cursor-pointer select-none">
                Simpan sesi login di perangkat ini selama 7 hari
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3.5 px-5 rounded-xl bg-gradient-to-r from-primary to-[#86d425] text-[#1f3700] font-extrabold hover:opacity-95 disabled:opacity-50 transition-all shadow-[0_0_25px_rgba(158,233,57,0.3)] hover:shadow-[0_0_30px_rgba(158,233,57,0.5)] flex items-center justify-center gap-2 cursor-pointer text-sm tracking-wide"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#1f3700] border-t-transparent rounded-full animate-spin" />
                  <span>Mengautentikasi Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard ProSphere</span>
                  <Icon name="arrow_forward" size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick-Switch Demo Credentials (Professional Redesign) */}
          <div className="mt-8 pt-6 border-t border-outline-variant/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider">
                Pintasan Akun Demo Role-Based Access Control
              </span>
              <span className="text-[11px] text-primary/80 font-medium">1-Klik Otomatis</span>
            </div>

            <div className="space-y-2">
              {/* Option 1: Super Admin */}
              <button
                type="button"
                onClick={() => handleQuickFill('admin@prosphere.ai', 'admin123456')}
                className="w-full p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 hover:border-primary/40 text-left transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-xs shrink-0">
                    👑
                  </div>
                  <div>
                    <div className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors flex items-center gap-2">
                      <span>Super Admin</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-mono">100% Akses Penuh</span>
                    </div>
                    <div className="text-[11px] text-outline font-mono">admin@prosphere.ai</div>
                  </div>
                </div>
                <Icon name="chevron_right" size={18} className="text-outline group-hover:text-primary transition-colors" />
              </button>

              {/* Option 2: Sales & CS */}
              <button
                type="button"
                onClick={() => handleQuickFill('sales@prosphere.ai', 'sales123456')}
                className="w-full p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 hover:border-secondary/40 text-left transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary border border-secondary/30 flex items-center justify-center font-bold text-xs shrink-0">
                    💼
                  </div>
                  <div>
                    <div className="text-xs font-bold text-on-surface group-hover:text-secondary transition-colors flex items-center gap-2">
                      <span>Staff Sales & Customer Service</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-secondary/10 text-secondary font-mono">Chat & Deals</span>
                    </div>
                    <div className="text-[11px] text-outline font-mono">sales@prosphere.ai</div>
                  </div>
                </div>
                <Icon name="chevron_right" size={18} className="text-outline group-hover:text-secondary transition-colors" />
              </button>

              {/* Option 3: Marketing */}
              <button
                type="button"
                onClick={() => handleQuickFill('marketing@prosphere.ai', 'marketing123456')}
                className="w-full p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 hover:border-tertiary/40 text-left transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-tertiary/20 text-tertiary border border-tertiary/30 flex items-center justify-center font-bold text-xs shrink-0">
                    📢
                  </div>
                  <div>
                    <div className="text-xs font-bold text-on-surface group-hover:text-tertiary transition-colors flex items-center gap-2">
                      <span>Staff Marketing</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-tertiary/10 text-tertiary font-mono">Broadcast & Segments</span>
                    </div>
                    <div className="text-[11px] text-outline font-mono">marketing@prosphere.ai</div>
                  </div>
                </div>
                <Icon name="chevron_right" size={18} className="text-outline group-hover:text-tertiary transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="mt-8 pt-4 border-t border-[#424936]/20 flex items-center justify-between text-[11px] text-outline">
          <div className="flex items-center gap-1.5">
            <Icon name="lock" size={14} className="text-secondary" />
            <span>Terenkripsi 256-bit JWT & bcrypt</span>
          </div>
          <span>© 2026 ProSphere AI</span>
        </div>
      </div>
    </div>
  );
}
