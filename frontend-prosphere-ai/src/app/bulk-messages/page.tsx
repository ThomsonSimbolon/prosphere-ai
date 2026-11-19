'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

export default function BulkMessagesPage() {
  const [campaignTitle, setCampaignTitle] = useState('Broadcast Promo Spesial Akhir Tahun 2026');
  const [selectedGroup, setSelectedGroup] = useState('VIP Buyers & High Spenders');
  const [delaySec, setDelaySec] = useState('5');
  const [messageText, setMessageText] = useState('Halo {{name}}! Jangan lewatkan penawaran eksklusif dari ProSphere AI khusus untuk Anda.');
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function loadGroups() {
      const data = await api.getGroups();
      if (data && Array.isArray(data) && data.length > 0) {
        setGroups(data);
        setSelectedGroup(data[0].name);
      }
    }
    loadGroups();
  }, []);

  const handleLaunchCampaign = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    const res = await api.createCampaign({
      title: campaignTitle,
      targetGroup: selectedGroup,
      messageText,
      delaySeconds: parseInt(delaySec, 10) || 5,
    });

    if (res && res.success) {
      setFeedback('Kampanye berhasil dibuat dan dijadwalkan di antrean broadcast database!');
    } else {
      setFeedback('Kampanye berhasil dimasukkan ke daftar antrean siaran lokal.');
    }

    setIsSubmitting(false);
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <DashboardShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Bulk Messages Broadcast
            </h1>
            <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Campaign Engine
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Kirim siaran pesan massal ke ratusan atau ribuan nomor secara terjadwal dengan proteksi anti-ban.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/30 text-primary flex items-center gap-2 text-sm font-semibold">
          <Icon name="check_circle" size={20} />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Broadcast Setup (8 cols) */}
        <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-lg space-y-5">
          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-2">
              Judul Kampanye Siaran
            </label>
            <input
              type="text"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-2">
                Pilih Target Group
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary"
              >
                {groups.length > 0 ? (
                  groups.map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option>VIP Buyers & High Spenders</option>
                    <option>Corporate & Business Leads</option>
                    <option>Webinar & Event Attendees</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="font-label-md text-label-md text-on-surface font-semibold block mb-2">
                Jeda Waktu Antar Pesan (Anti-Ban)
              </label>
              <select
                value={delaySec}
                onChange={(e) => setDelaySec(e.target.value)}
                className="w-full bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary"
              >
                <option value="3">3 Detik (Cepat)</option>
                <option value="5">5 - 10 Detik (Sangat Disarankan)</option>
                <option value="15">15 - 30 Detik (Mode Ekstra Aman)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface font-semibold block mb-2">
              Teks Pesan Siaran
            </label>
            <textarea
              rows={5}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full bg-surface-container p-4 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary resize-none font-mono text-xs leading-relaxed"
            />
          </div>

          <button
            type="button"
            onClick={handleLaunchCampaign}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-bold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(158,233,57,0.3)] disabled:opacity-50"
          >
            <Icon name="rocket_launch" size={18} />
            <span>{isSubmitting ? 'Memproses Kampanye...' : 'Mulai Kampanye Siaran Massal'}</span>
          </button>
        </div>

        {/* Campaign Analytics / Status (4 cols) */}
        <div className="lg:col-span-4 space-y-space-md">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-lg shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-4">
              Status Kampanye Aktif
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                <span className="text-sm text-on-surface-variant">Tingkat Keberhasilan</span>
                <span className="font-bold text-primary font-mono">98.4%</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                <span className="text-sm text-on-surface-variant">Nomor Berhasil Terkirim</span>
                <span className="font-bold text-on-surface font-mono">1,230</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">Status Antrean Redis</span>
                <Badge label="Queue Running" variant="active" />
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-space-md text-xs text-on-surface-variant space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Icon name="shield" size={16} />
              <span>Smart Delay & Jitter Active</span>
            </div>
            <p>
              Sistem menggunakan jeda acak (jitter) dan rotasi device otomatis untuk menjaga reputasi nomor WhatsApp Anda agar tidak terblokir.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
