'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Icon } from '@/components/ui/Icon';
import { api } from '@/lib/api';

export default function AiSettingsPage() {
  const [model, setModel] = useState('gemini-3.5-flash-lite');
  const [temp, setTemp] = useState('0.7');
  const [prompt, setPrompt] = useState(
    'Anda adalah ProSphere AI Assistant, asisten sales dan layanan pelanggan resmi yang ramah, sopan, dan persuasif. Tugas utama Anda adalah menyapa calon pembeli, menjawab pertanyaan seputar katalog produk, mencatat nomor pesanan, dan mengarahkan mereka untuk konfirmasi pembayaran via transfer atau link checkout.'
  );
  const [autoFallback, setAutoFallback] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const data = await api.getAiSettings();
      if (data) {
        if (data.modelName) setModel(data.modelName);
        if (data.temperature) setTemp(data.temperature.toString());
        if (data.systemPrompt) setPrompt(data.systemPrompt);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const res = await api.updateAiSettings({
      modelName: model,
      temperature: parseFloat(temp),
      systemPrompt: prompt,
    });

    if (res && res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setIsSaving(false);
  };

  return (
    <DashboardShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              AI Engine Settings
            </h1>
            <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              ProSphere Core &bull; MySQL Synced
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Konfigurasi model LLM Google Gemini, prompt sistem, dan parameter penalaran bot WhatsApp.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_rgba(158,233,57,0.25)] self-start md:self-auto disabled:opacity-50"
        >
          <Icon name={saveSuccess ? 'check' : isSaving ? 'sync' : 'save'} size={18} className={isSaving ? 'animate-spin' : ''} />
          <span>{saveSuccess ? 'Berhasil Disimpan!' : isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi'}</span>
        </button>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-lg max-w-4xl space-y-6 shadow-sm">
        {saveSuccess && (
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl text-primary text-xs font-semibold flex items-center gap-2">
            <Icon name="check_circle" size={16} />
            <span>Pengaturan AI berhasil diperbarui di database MySQL dan langsung aktif di bot WhatsApp!</span>
          </div>
        )}

        {/* Model Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-2">
              Model Large Language (LLM)
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary"
            >
              <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Rekomendasi Utama - Kuota 500 RPD Cepat)</option>
              <option value="gemini-3.8-flash">gemini-3.8-flash (Reasoning Mendalam - Kuota 20 RPD)</option>
              <option value="gemini-3.6-flash">gemini-3.6-flash (Workhorse Multimodal)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Ringan)</option>
              <option value="gemma-4-31b-it">gemma-4-31b-it (Open Weights)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-label-md text-label-md text-on-surface font-semibold">
                Creativity & Temperature
              </label>
              <span className="text-xs font-mono font-bold text-primary">{temp}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="w-full accent-primary mt-2"
            />
          </div>
        </div>

        {/* System Prompt Instruction */}
        <div>
          <label className="font-label-md text-label-md text-on-surface font-semibold block mb-2">
            System Instructions / Prompt Persona
          </label>
          <textarea
            rows={6}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-surface-container p-4 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary resize-none font-mono text-xs leading-relaxed"
          />
        </div>

        {/* Human Fallback Toggle */}
        <div className="p-4 bg-surface-container rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
              <Icon name="support_agent" size={22} />
            </div>
            <div>
              <span className="font-label-md text-label-md font-bold text-on-surface block">
                Auto-Handoff ke Admin Manusia
              </span>
              <span className="text-xs text-on-surface-variant">
                Jika pelanggan meminta berbicara dengan CS manusia atau pertanyaan tidak dimengerti 2x berturut-turut.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAutoFallback(!autoFallback)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              autoFallback ? 'bg-primary' : 'bg-surface-container-highest'
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-surface-container-lowest transition-transform ${
                autoFallback ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
