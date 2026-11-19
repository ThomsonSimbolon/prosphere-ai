'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

export default function AiSalesAgentPage() {
  const [isActive, setIsActive] = useState(true);
  const [testInput, setTestInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [simLog, setSimLog] = useState<{ sender: 'Customer' | 'AI Agent'; text: string }[]>([
    {
      sender: 'Customer',
      text: 'Halo, apakah ada diskon untuk langganan ProSphere tahunan?',
    },
    {
      sender: 'AI Agent',
      text: 'Halo kak! Ada potongan 25% untuk paket tahunan. Kakak ingin faktur dibuatkan atas nama pribadi atau perusahaan?',
    },
  ]);

  const handleTestSim = async () => {
    if (!testInput || isLoading) return;
    const userMsg = testInput;
    setTestInput('');
    setSimLog((prev) => [...prev, { sender: 'Customer', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await api.simulateChat(userMsg);
      const botReply = res?.data?.aiResponse || res?.data?.response;
      if (res && res.success && botReply) {
        setSimLog((prev) => [
          ...prev,
          { sender: 'AI Agent', text: botReply },
        ]);
      } else {
        setSimLog((prev) => [
          ...prev,
          {
            sender: 'AI Agent',
            text: `Terima kasih kak! Untuk pertanyaan "${userMsg}", tim kami siap membantu setup akun ProSphere AI Anda kapan saja.`,
          },
        ]);
      }
    } catch {
      setSimLog((prev) => [
        ...prev,
        {
          sender: 'AI Agent',
          text: 'Maaf kak, sistem sedang mengkalibrasi model Gemini. Ada yang bisa saya bantu kembali?',
        },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <DashboardShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Autonomous AI Sales Agent
            </h1>
            <Badge label={isActive ? 'Agent Active' : 'Agent Paused'} variant={isActive ? 'pulse' : 'plain'} />
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Agen cerdas bertenaga Google Gemini yang memandu pelanggan dari konsultasi hingga proses checkout otomatis.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
            isActive
              ? 'bg-surface-container border border-error/50 text-error hover:bg-error/10'
              : 'bg-primary text-on-primary'
          }`}
        >
          <Icon name={isActive ? 'pause_circle' : 'play_circle'} size={18} />
          <span>{isActive ? 'Pause AI Sales Agent' : 'Aktifkan AI Sales Agent'}</span>
        </button>
      </div>

      {/* KPI Sales Performance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mb-space-lg">
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-md">
          <span className="text-xs uppercase text-on-surface-variant font-semibold block mb-1">Conversion Rate</span>
          <span className="font-headline-md text-headline-md text-primary font-bold block tabular-nums">34.8%</span>
          <span className="text-xs text-secondary mt-1 block">+8.2% dibanding agen manual</span>
        </div>
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-md">
          <span className="text-xs uppercase text-on-surface-variant font-semibold block mb-1">Deals Closed (Bulan ini)</span>
          <span className="font-headline-md text-headline-md text-on-surface font-bold block tabular-nums">148 Deals</span>
          <span className="text-xs text-on-surface-variant mt-1 block">Total Omset: Rs84,200</span>
        </div>
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-md">
          <span className="text-xs uppercase text-on-surface-variant font-semibold block mb-1">Kecepatan Respons Rata-rata</span>
          <span className="font-headline-md text-headline-md text-tertiary font-bold block tabular-nums">1.2 Detik</span>
          <span className="text-xs text-secondary mt-1 block">Google Gemini 3.5 Flash-Lite Engine</span>
        </div>
      </div>

      {/* Simulator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Chat Logs (8 cols) */}
        <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-lg space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="font-label-lg text-label-lg font-bold text-on-surface">
                Simulator Percakapan Live AI Sales
              </span>
            </div>
            <span className="text-xs text-outline font-mono">Real-time Gemini Response</span>
          </div>

          <div className="space-y-3 min-h-[300px] max-h-[420px] overflow-y-auto pr-2">
            {simLog.map((log, index) => {
              const isCust = log.sender === 'Customer';
              return (
                <div
                  key={index}
                  className={`flex gap-3 text-xs leading-relaxed ${
                    isCust ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      isCust
                        ? 'bg-[#005c4b] text-white rounded-tr-none'
                        : 'bg-surface-container text-on-surface rounded-tl-none border border-outline-variant/30'
                    }`}
                  >
                    <div className="font-bold mb-1 text-[11px] opacity-80">{log.sender}</div>
                    <p className="whitespace-pre-wrap">{log.text}</p>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-primary font-medium p-2">
                <Icon name="sync" size={16} className="animate-spin" />
                <span>AI Agent sedang berpikir & merespons via Gemini...</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-2">
            <input
              type="text"
              value={testInput}
              disabled={isLoading}
              onChange={(e) => setTestInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTestSim();
              }}
              placeholder="Ketik pesan simulasi pelanggan lalu tekan Enter..."
              className="flex-1 bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleTestSim}
              disabled={isLoading}
              className="bg-primary text-on-primary font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50"
            >
              <Icon name="send" size={18} />
              <span>Kirim</span>
            </button>
          </div>
        </div>

        {/* Knowledge Base & Trigger Configuration (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-md">
            <h4 className="font-label-lg text-label-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <Icon name="menu_book" size={18} className="text-secondary" />
              <span>Knowledge Base & Katalog</span>
            </h4>
            <div className="space-y-2 text-xs text-on-surface-variant">
              <div className="p-2.5 bg-surface-container rounded-xl flex items-center justify-between">
                <span>Katalog_Produk_ProSphere_2026.pdf</span>
                <span className="text-primary font-bold">142 KB</span>
              </div>
              <div className="p-2.5 bg-surface-container rounded-xl flex items-center justify-between">
                <span>Kebijakan_Garansi_Refund.docx</span>
                <span className="text-primary font-bold">48 KB</span>
              </div>
              <div className="p-2.5 bg-surface-container rounded-xl flex items-center justify-between">
                <span>FAQ_Paling_Sering_Ditanyakan.txt</span>
                <span className="text-primary font-bold">18 KB</span>
              </div>
            </div>
            <button
              type="button"
              className="w-full mt-3 py-2 text-xs font-semibold text-center rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
            >
              + Upload Dokumen Baru
            </button>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-md">
            <h4 className="font-label-lg text-label-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <Icon name="sell" size={18} className="text-tertiary" />
              <span>Auto Close Checkout</span>
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Ketika calon pembeli menunjukkan intensi membeli tinggi (&ge;80%), AI Agent otomatis men-generate payment link / nomor invoice dan mengirimkannya langsung ke WhatsApp pembeli.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
