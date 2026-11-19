'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [activeTab, setActiveTab] = useState<'ecommerce' | 'property' | 'services'>('ecommerce');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah akun WhatsApp saya aman dari risiko blokir / banned?',
      a: 'Ya, ProSphere AI dilengkapi algoritma Smart Anti-Ban Delay (jeda acak 3–7 detik per pesan), rotasi gateway multi-device, dan simulasi perilaku pengetikan manusia (*human typing indicator*) yang menjaga reputasi nomor Anda tetap prima.',
    },
    {
      q: 'Berapa banyak perangkat / nomor WhatsApp yang bisa dihubungkan?',
      a: 'Tergantung paket Anda. Paket Pro mendukung hingga 3 perangkat terhubung secara simultan, dan Paket Enterprise mendukung *unlimited* gateway dengan sistem *load balancing* otomatis.',
    },
    {
      q: 'Bagaimana cara AI mempelajari produk dan katalog bisnis saya?',
      a: 'Sangat mudah! Anda cukup mengunggah file PDF katalog, link website, dokumen Word, atau daftar FAQ di menu AI Settings. AI akan mengindeks materi tersebut dalam hitungan detik dan siap menjawab pelanggan.',
    },
    {
      q: 'Apakah bisa dihubungkan dengan CRM atau database internal kami?',
      a: 'Tentu. ProSphere AI menyediakan Webhook dua arah dan REST API yang siap disambungkan ke sistem CRM eksternal, Google Sheets, WooCommerce, Shopify, atau sistem ERP Anda.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#03170b] text-[#d0e9d4] selection:bg-primary/20 selection:text-primary overflow-x-hidden font-body-md">
      {/* Background Decorative Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 -right-40 w-[500px] h-[500px] bg-secondary/5 blur-[140px] pointer-events-none -z-10" />

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#03170b]/80 border-b border-[#424936]/30 px-6 lg:px-16 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#0f2417] border border-primary/40 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(158,233,57,0.3)]">
              <Icon name="auto_awesome" size={20} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">
                ProSphere
              </span>
              <span className="font-label-sm text-label-sm bg-primary text-[#1f3700] px-1.5 py-0.5 rounded font-bold">
                AI
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
            <a href="#fitur" className="hover:text-primary transition-colors">
              Fitur
            </a>
            <a href="#cara-kerja" className="hover:text-primary transition-colors">
              Cara Kerja
            </a>
            <a href="#usecases" className="hover:text-primary transition-colors">
              Solusi Industri
            </a>
            <a href="#harga" className="hover:text-primary transition-colors">
              Paket Harga
            </a>
            <a href="#faq" className="hover:text-primary transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Action CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-on-surface hover:text-primary transition-colors"
            >
              <span>Live Telemetry</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-primary text-[#1f3700] font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(158,233,57,0.35)] text-sm"
            >
              <span>Buka Dashboard</span>
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-16 pb-24 px-6 lg:px-16 text-center max-w-6xl mx-auto flex flex-col items-center">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0f2417] border border-primary/30 text-xs text-primary font-semibold mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Generative AI WhatsApp Automation Engine v2.4</span>
        </div>

        {/* Big Headline */}
        <h1 className="font-headline-lg text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface max-w-4xl leading-[1.15] mb-6">
          Ubah WhatsApp Menjadi Mesin Penjualan & Closing Otomatis{' '}
          <span className="bg-gradient-to-r from-primary via-secondary to-primary-fixed bg-clip-text text-transparent">
            24 Jam Non-Stop
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-body-lg text-base sm:text-lg text-on-surface-variant max-w-2xl mb-10 leading-relaxed">
          Tingkatkan konversi penjualan hingga 300% dengan AI Sales Agent otonom yang memahami konteks produk, menjawab pertanyaan pelanggan secara natural, dan mencatat transaksi ke CRM.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-primary text-[#1f3700] font-bold px-8 py-4 rounded-xl text-base hover:opacity-90 transition-all shadow-[0_0_25px_rgba(158,233,57,0.4)]"
          >
            <Icon name="rocket_launch" size={20} />
            <span>Mulai Uji Coba Dashboard Gratis</span>
          </Link>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0b2013] hover:bg-[#0f2417] border border-[#424936] text-on-surface font-semibold px-6 py-4 rounded-xl text-base transition-colors"
          >
            <Icon name="chat" size={20} className="text-secondary" />
            <span>Chat Demo Bot WhatsApp</span>
          </a>
        </div>

        {/* Floating Trust Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl text-left">
          <div className="bg-[#0b2013] border border-[#424936]/30 p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0f2417] flex items-center justify-center text-primary">
              <Icon name="check_circle" size={22} fill={true} />
            </div>
            <div>
              <span className="font-bold text-lg text-on-surface block tabular-nums">96.1%</span>
              <span className="text-xs text-on-surface-variant">Tingkat Keberhasilan Pesan</span>
            </div>
          </div>

          <div className="bg-[#0b2013] border border-[#424936]/30 p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0f2417] flex items-center justify-center text-secondary">
              <Icon name="bolt" size={22} />
            </div>
            <div>
              <span className="font-bold text-lg text-on-surface block tabular-nums">1.4 Detik</span>
              <span className="text-xs text-on-surface-variant">Respon AI Super Cepat</span>
            </div>
          </div>

          <div className="bg-[#0b2013] border border-[#424936]/30 p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0f2417] flex items-center justify-center text-primary">
              <Icon name="smart_toy" size={22} />
            </div>
            <div>
              <span className="font-bold text-lg text-on-surface block">24/7 Autopilot</span>
              <span className="text-xs text-on-surface-variant">Tanpa Libur / Off-hours</span>
            </div>
          </div>

          <div className="bg-[#0b2013] border border-[#424936]/30 p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0f2417] flex items-center justify-center text-tertiary">
              <Icon name="shield" size={22} />
            </div>
            <div>
              <span className="font-bold text-lg text-on-surface block">Anti-Ban</span>
              <span className="text-xs text-on-surface-variant">Proteksi Algoritma Cerdas</span>
            </div>
          </div>
        </div>

        {/* Dashboard Mockup Preview Frame */}
        <div className="mt-14 w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary-container rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-700" />
          <div className="relative bg-[#0b2013] border border-[#424936]/60 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[#424936]/30 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ffb4ab]" />
                <span className="w-3 h-3 rounded-full bg-primary/70" />
                <span className="w-3 h-3 rounded-full bg-secondary/70" />
                <span className="text-xs text-outline font-mono ml-2">prosphere-ai-telemetry://dashboard</span>
              </div>
              <Link
                href="/dashboard"
                className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Buka Versi Penuh</span>
                <Icon name="open_in_new" size={14} />
              </Link>
            </div>

            {/* Snapshot Mini Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left mb-4">
              <div className="bg-[#0f2417] p-3 rounded-xl border border-[#424936]/20">
                <span className="text-[11px] text-on-surface-variant block uppercase font-semibold">Total Pesan</span>
                <span className="text-xl font-bold text-on-surface tabular-nums">485</span>
                <span className="text-[10px] text-primary font-bold">+96% Live</span>
              </div>
              <div className="bg-[#0f2417] p-3 rounded-xl border border-[#424936]/20">
                <span className="text-[11px] text-on-surface-variant block uppercase font-semibold">Success Rate</span>
                <span className="text-xl font-bold text-secondary tabular-nums">96.1%</span>
                <span className="text-[10px] text-secondary">Active Gateway</span>
              </div>
              <div className="bg-[#0f2417] p-3 rounded-xl border border-[#424936]/20">
                <span className="text-[11px] text-on-surface-variant block uppercase font-semibold">Total Orders</span>
                <span className="text-xl font-bold text-on-surface tabular-nums">150</span>
                <span className="text-[10px] text-primary">Closing via AI</span>
              </div>
              <div className="bg-[#0f2417] p-3 rounded-xl border border-[#424936]/20">
                <span className="text-[11px] text-on-surface-variant block uppercase font-semibold">Total Revenue</span>
                <span className="text-xl font-bold text-secondary tabular-nums">Rs3,500</span>
                <span className="text-[10px] text-secondary">Terkonfirmasi</span>
              </div>
            </div>

            <div className="bg-[#001207] p-4 rounded-xl flex items-center justify-between text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span>1 Perangkat WhatsApp Terhubung & AI Sales Agent Aktif</span>
              </div>
              <Link href="/dashboard" className="text-primary font-bold hover:underline">
                Eksplorasi Semua Fitur →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CORE FEATURES SECTION ================= */}
      <section id="fitur" className="py-20 px-6 lg:px-16 border-t border-[#424936]/20 bg-[#0b2013]/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-bold text-primary tracking-widest block mb-2">
              Fitur Lengkap Enterprise
            </span>
            <h2 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface">
              Semua yang Anda Butuhkan untuk Skalasi Bisnis WhatsApp
            </h2>
            <p className="font-body-md text-on-surface-variant mt-3 text-sm sm:text-base">
              Dari penanganan pesan masuk, follow-up prospek, hingga siaran massal ribuan kontak tanpa hambatan teknis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#0b2013] border border-[#424936]/30 p-6 rounded-2xl hover:border-primary/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-[#0f2417] flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <Icon name="auto_awesome" size={26} />
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-2">
                Autonomous AI Sales Agent
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Asisten cerdas yang membalas percakapan sesuai kepribadian bisnis, menjelaskan katalog harga, dan membimbing pelanggan menuju transfer checkout.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0b2013] border border-[#424936]/30 p-6 rounded-2xl hover:border-secondary/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-[#0f2417] flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                <Icon name="smartphone" size={26} />
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-2">
                Multi-Device QR Gateway
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Tautkan beberapa nomor WhatsApp bisnis dengan mudah via scan QR Web. Pantau status baterai HP, latensi jaringan, dan log pesan secara real-time.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0b2013] border border-[#424936]/30 p-6 rounded-2xl hover:border-primary/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-[#0f2417] flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <Icon name="send" size={26} />
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-2">
                Smart Bulk Broadcast
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Kirim kampanye promo ke ribuan pelanggan dengan jeda anti-ban otomatis (*custom delay*), personalisasi nama variabel {"{{name}}"}, dan pelacakan *read-receipt*.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0b2013] border border-[#424936]/30 p-6 rounded-2xl hover:border-tertiary/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-[#0f2417] flex items-center justify-center text-tertiary mb-4 group-hover:scale-110 transition-transform">
                <Icon name="bar_chart" size={26} />
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-2">
                Integrated Visual CRM
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Kanban pipeline lengkap dari New Lead, Contacted, Qualified, hingga Closed Won untuk memastikan tidak ada calon pembeli yang terlewatkan.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-[#0b2013] border border-[#424936]/30 p-6 rounded-2xl hover:border-secondary/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-[#0f2417] flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                <Icon name="account_tree" size={26} />
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-2">
                Visual Flow Builder
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Bangun alur chatbot percabangan tanpa kode (*no-code*). Pemicu kata kunci otomatis mengarahkan pelanggan ke formulir booking atau CS terkait.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-[#0b2013] border border-[#424936]/30 p-6 rounded-2xl hover:border-primary/50 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-[#0f2417] flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <Icon name="calendar_month" size={26} />
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-2">
                Automated Appointments
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Biarkan bot mengatur janji temu, konsultasi dokter/klinik, atau jadwal demo produk secara langsung melalui percakapan WhatsApp yang alami.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="cara-kerja" className="py-20 px-6 lg:px-16 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold text-secondary tracking-widest block mb-2">
            Simpel & Cepat
          </span>
          <h2 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface">
            Hanya 3 Langkah untuk Memulai
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-[#0b2013] border border-[#424936]/30 p-6 rounded-2xl relative">
            <span className="font-mono text-3xl font-bold text-primary/40 block mb-3">01</span>
            <h3 className="font-headline-sm text-base font-bold text-on-surface mb-2">
              Scan QR WhatsApp
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Hubungkan nomor WhatsApp bisnis Anda seperti membuka WhatsApp Web biasa. Tidak membutuhkan server rumit.
            </p>
          </div>

          <div className="bg-[#0b2013] border border-[#424936]/30 p-6 rounded-2xl relative">
            <span className="font-mono text-3xl font-bold text-secondary/40 block mb-3">02</span>
            <h3 className="font-headline-sm text-base font-bold text-on-surface mb-2">
              Unggah Pengetahuan Produk
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Upload PDF katalog, brosur, atau ketik panduan FAQ. AI ProSphere akan mempelajari seluruh informasi seketika.
            </p>
          </div>

          <div className="bg-[#0b2013] border border-[#424936]/30 p-6 rounded-2xl relative">
            <span className="font-mono text-3xl font-bold text-primary/40 block mb-3">03</span>
            <h3 className="font-headline-sm text-base font-bold text-on-surface mb-2">
              AI Siap Menjual 24/7
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Duduk santai dan pantau arus percakapan serta grafik omzet di dashboard Anda secara real-time.
            </p>
          </div>
        </div>
      </section>

      {/* ================= USE CASES TAB ================= */}
      <section id="usecases" className="py-20 px-6 lg:px-16 border-t border-[#424936]/20 bg-[#0b2013]/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-headline-lg text-3xl font-bold text-on-surface">
              Dirancang untuk Berbagai Jenis Bisnis
            </h2>
          </div>

          {/* Tab Controls */}
          <div className="flex justify-center mb-10">
            <div className="bg-[#0b2013] p-1.5 rounded-2xl border border-[#424936]/30 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('ecommerce')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'ecommerce'
                    ? 'bg-primary text-[#1f3700] shadow-[0_0_12px_rgba(158,233,57,0.3)]'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                E-Commerce & Retail
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('property')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'property'
                    ? 'bg-primary text-[#1f3700] shadow-[0_0_12px_rgba(158,233,57,0.3)]'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Properti & Sales Agency
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('services')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'services'
                    ? 'bg-primary text-[#1f3700] shadow-[0_0_12px_rgba(158,233,57,0.3)]'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Klinik & Jasa Reservasi
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-[#0b2013] border border-[#424936]/40 p-8 rounded-3xl">
            {activeTab === 'ecommerce' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs text-primary font-bold uppercase tracking-wider">
                    Solusi Toko Online & Brand Retail
                  </span>
                  <h3 className="font-headline-sm text-2xl font-bold text-on-surface">
                    Balas Pesan Cek Ongkir & Rekening dalam Hitungan Detik
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Jangan biarkan calon pembeli beralih ke kompetitor saat admin toko Anda tertidur. AI memproses pemesanan, verifikasi resi, dan mengirimkan pesan follow-up otomatis bagi keranjang yang belum lunas.
                  </p>
                  <ul className="space-y-2 text-xs text-on-surface">
                    <li className="flex items-center gap-2">
                      <Icon name="check" size={16} className="text-primary" />
                      <span>Integrasi pengecekan stok otomatis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Icon name="check" size={16} className="text-primary" />
                      <span>Kirim instruksi transfer dan QRIS instan</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#001207] p-5 rounded-2xl border border-[#424936]/30 font-mono text-xs space-y-3">
                  <div className="bg-[#0f2417] p-3 rounded-xl border border-primary/20">
                    <span className="text-primary text-[11px] block font-bold mb-1">User:</span>
                    <p className="text-on-surface">Kak dress warna sage green ukuran M masih ada? Ongkir ke Bandung berapa?</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-xl border border-primary/30 text-on-surface">
                    <span className="text-primary text-[11px] block font-bold mb-1">ProSphere AI:</span>
                    <p>Halo Kak! Masih ready ya untuk Sage Green size M. Ongkir ke Bandung via JNE mulai Rp12.000 (1-2 hari sampai). Boleh kami siapkan invoice-nya sekarang?</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'property' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs text-secondary font-bold uppercase tracking-wider">
                    Agensi Properti & B2B Leads
                  </span>
                  <h3 className="font-headline-sm text-2xl font-bold text-on-surface">
                    Kualifikasi Calon Pembeli Serius Sebelum Dijadwalkan Survei
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    AI menanyakan rentang budget, preferensi tipe unit, dan waktu luang calon pembeli, lalu otomatis memasukkan datanya ke CRM Leads sebelum mengabari agen lapangan.
                  </p>
                </div>
                <div className="bg-[#001207] p-5 rounded-2xl border border-[#424936]/30 font-mono text-xs space-y-3">
                  <div className="bg-[#0f2417] p-3 rounded-xl border border-secondary/20">
                    <span className="text-secondary text-[11px] block font-bold mb-1">User:</span>
                    <p className="text-on-surface">Halo, saya tertarik dengan cluster Sakura di BSD.</p>
                  </div>
                  <div className="bg-secondary/10 p-3 rounded-xl border border-secondary/30 text-on-surface">
                    <span className="text-secondary text-[11px] block font-bold mb-1">ProSphere AI:</span>
                    <p>Pilihan tepat! Cluster Sakura memiliki tipe 60 & 84 dengan cicilan mulai 7 jutaan. Apakah Bapak berkenan survei lokasi di hari Sabtu atau Minggu ini?</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs text-primary font-bold uppercase tracking-wider">
                    Klinik, Salon, & Konsultasi Jasa
                  </span>
                  <h3 className="font-headline-sm text-2xl font-bold text-on-surface">
                    Pemesanan Jadwal & Reservasi Dokter / Konsultan Otomatis
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Pelanggan dapat memilih tanggal dan slot jam konsultasi langsung via WhatsApp. Jadwal langsung masuk ke kalender Bookings tanpa perlu dikonfirmasi manual.
                  </p>
                </div>
                <div className="bg-[#001207] p-5 rounded-2xl border border-[#424936]/30 font-mono text-xs space-y-3">
                  <div className="bg-[#0f2417] p-3 rounded-xl border border-primary/20">
                    <span className="text-primary text-[11px] block font-bold mb-1">User:</span>
                    <p className="text-on-surface">Mau reservasi dokter gigi untuk hari Jumat jam 2 siang bisa?</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-xl border border-primary/30 text-on-surface">
                    <span className="text-primary text-[11px] block font-bold mb-1">ProSphere AI:</span>
                    <p>Slot Jumat jam 14:00 WIB tersedia bersama drg. Anisa. Reservasi atas nama siapa yang bisa kami catat?</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= PRICING SECTION ================= */}
      <section id="harga" className="py-20 px-6 lg:px-16 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold text-primary tracking-widest block mb-2">
            Pilihan Paket Transparan
          </span>
          <h2 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface">
            Investasi Terjangkau dengan ROI Terukur
          </h2>
          <div className="mt-6 inline-flex items-center gap-3 bg-[#0b2013] p-1.5 rounded-full border border-[#424936]/40 text-xs">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full font-bold transition-colors ${
                billingCycle === 'monthly' ? 'bg-surface-container text-on-surface' : 'text-on-surface-variant'
              }`}
            >
              Bulanan
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full font-bold flex items-center gap-1 transition-colors ${
                billingCycle === 'yearly' ? 'bg-primary text-[#1f3700]' : 'text-on-surface-variant'
              }`}
            >
              <span>Tahunan</span>
              <span className="text-[10px] bg-[#1f3700] text-primary px-1.5 py-0.2 rounded-full font-bold">
                Hemat 25%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Tier 1 */}
          <div className="bg-[#0b2013] border border-[#424936]/30 p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-on-surface-variant uppercase">Starter</span>
              <h3 className="font-headline-sm text-xl font-bold text-on-surface mt-1">UMKM & Online Shop</h3>
              <div className="my-6">
                <span className="text-3xl font-bold text-on-surface font-mono">
                  {billingCycle === 'yearly' ? 'Rp299.000' : 'Rp399.000'}
                </span>
                <span className="text-xs text-on-surface-variant"> / bulan</span>
              </div>
              <ul className="space-y-3 text-xs text-on-surface-variant">
                <li className="flex items-center gap-2 text-on-surface">
                  <Icon name="check" size={16} className="text-primary" />
                  <span>1 Nomor WhatsApp Terhubung</span>
                </li>
                <li className="flex items-center gap-2 text-on-surface">
                  <Icon name="check" size={16} className="text-primary" />
                  <span>1.000 Pesan AI / bulan</span>
                </li>
                <li className="flex items-center gap-2 text-on-surface">
                  <Icon name="check" size={16} className="text-primary" />
                  <span>Broadcast ke 500 Kontak</span>
                </li>
                <li className="flex items-center gap-2 text-on-surface">
                  <Icon name="check" size={16} className="text-primary" />
                  <span>Akses Dashboard Standar</span>
                </li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="mt-8 block text-center py-3 rounded-xl border border-[#424936] text-on-surface font-semibold hover:border-primary hover:text-primary transition-colors text-xs"
            >
              Pilih Paket Starter
            </Link>
          </div>

          {/* Tier 2 (Highlighted) */}
          <div className="bg-[#0f2417] border-2 border-primary p-8 rounded-3xl flex flex-col justify-between relative shadow-[0_0_30px_rgba(158,233,57,0.15)]">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-[#1f3700] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
              Paling Populer
            </span>
            <div>
              <span className="text-xs font-bold text-primary uppercase">Growth Pro</span>
              <h3 className="font-headline-sm text-xl font-bold text-on-surface mt-1">Bisnis Berkembang</h3>
              <div className="my-6">
                <span className="text-3xl font-bold text-primary font-mono">
                  {billingCycle === 'yearly' ? 'Rp699.000' : 'Rp899.000'}
                </span>
                <span className="text-xs text-on-surface-variant"> / bulan</span>
              </div>
              <ul className="space-y-3 text-xs text-on-surface">
                <li className="flex items-center gap-2">
                  <Icon name="check" size={16} className="text-primary" />
                  <span>3 Nomor WhatsApp Terhubung</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size={16} className="text-primary" />
                  <span>Unlimited Pesan AI & Respon</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size={16} className="text-primary" />
                  <span>Visual CRM Pipeline & Live Chatbox</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size={16} className="text-primary" />
                  <span>Broadcast Massal & Anti-Ban Protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check" size={16} className="text-primary" />
                  <span>Live Telemetry & Order Analytics</span>
                </li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="mt-8 block text-center py-3.5 rounded-xl bg-primary text-[#1f3700] font-bold hover:opacity-90 transition-opacity text-xs shadow-[0_0_15px_rgba(158,233,57,0.3)]"
            >
              Mulai Free Trial 14 Hari
            </Link>
          </div>

          {/* Tier 3 */}
          <div className="bg-[#0b2013] border border-[#424936]/30 p-8 rounded-3xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-on-surface-variant uppercase">Enterprise</span>
              <h3 className="font-headline-sm text-xl font-bold text-on-surface mt-1">Korporasi & Agensi</h3>
              <div className="my-6">
                <span className="text-3xl font-bold text-on-surface font-mono">Hubungi Kami</span>
                <span className="text-xs text-on-surface-variant"> / custom</span>
              </div>
              <ul className="space-y-3 text-xs text-on-surface-variant">
                <li className="flex items-center gap-2 text-on-surface">
                  <Icon name="check" size={16} className="text-primary" />
                  <span>Unlimited Gateway Multi-Device</span>
                </li>
                <li className="flex items-center gap-2 text-on-surface">
                  <Icon name="check" size={16} className="text-primary" />
                  <span>Custom LLM Fine-Tuning</span>
                </li>
                <li className="flex items-center gap-2 text-on-surface">
                  <Icon name="check" size={16} className="text-primary" />
                  <span>Webhook & REST API Dedicated</span>
                </li>
                <li className="flex items-center gap-2 text-on-surface">
                  <Icon name="check" size={16} className="text-primary" />
                  <span>SLA 99.9% & Dedicated Support</span>
                </li>
              </ul>
            </div>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block text-center py-3 rounded-xl border border-[#424936] text-on-surface font-semibold hover:border-primary hover:text-primary transition-colors text-xs"
            >
              Konsultasi Enterprise
            </a>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section id="faq" className="py-20 px-6 lg:px-16 border-t border-[#424936]/20 bg-[#0b2013]/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase font-bold text-primary tracking-widest block mb-2">
              Tanya Jawab
            </span>
            <h2 className="font-headline-lg text-3xl font-bold text-on-surface">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#0b2013] border border-[#424936]/30 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm text-on-surface flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <Icon
                    name={openFaq === idx ? 'expand_less' : 'expand_more'}
                    size={20}
                    className="text-primary"
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-on-surface-variant leading-relaxed border-t border-[#424936]/15">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-20 px-6 lg:px-16 text-center max-w-5xl mx-auto">
        <div className="bg-gradient-to-tr from-[#0b2013] via-[#0f2417] to-[#192e21] border border-primary/40 rounded-3xl p-10 sm:p-16 relative overflow-hidden shadow-[0_0_50px_rgba(158,233,57,0.15)]">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface mb-4">
              Siap Mengubah WhatsApp Anda Menjadi Sales Otomatis?
            </h2>
            <p className="font-body-md text-on-surface-variant text-sm mb-8">
              Akses dashboard ProSphere AI sekarang juga dan rasakan kemudahan mengelola ribuan leads dalam satu layar terpadu.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-primary text-[#1f3700] font-bold px-8 py-4 rounded-xl text-base hover:opacity-90 transition-all shadow-[0_0_20px_rgba(158,233,57,0.4)]"
            >
              <span>Akses Dashboard Sekarang</span>
              <Icon name="arrow_forward" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#424936]/30 py-10 px-6 lg:px-16 text-xs text-on-surface-variant">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-on-surface text-sm">ProSphere AI</span>
            <span>· All Rights Reserved © 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/devices" className="hover:text-primary transition-colors">
              Devices
            </Link>
            <Link href="/crm" className="hover:text-primary transition-colors">
              CRM
            </Link>
            <Link href="/ai-sales-agent" className="hover:text-primary transition-colors">
              AI Agent
            </Link>
          </div>
          <div className="text-outline">
            Zenax Web Solutions · Digital Innovation Partner
          </div>
        </div>
      </footer>
    </div>
  );
}
