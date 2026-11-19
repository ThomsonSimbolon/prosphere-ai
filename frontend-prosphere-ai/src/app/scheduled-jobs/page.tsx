'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

interface JobItem {
  id: string;
  title: string;
  cron: string;
  target: string;
  status: string;
  nextRun: string;
}

export default function ScheduledJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [cron, setCron] = useState('Setiap Hari @ 09:00 WIB');
  const [target, setTarget] = useState('Group: VIP Buyers');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    setLoading(true);
    const data = await api.getJobs();
    setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const toggleJob = async (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: j.status === 'Active' ? 'Paused' : 'Active' } : j));
    await api.toggleJob(id);
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setIsSubmitting(true);

    const res = await api.createJob({ title, cron, target });
    if (res && res.success) {
      await loadJobs();
    }

    setTitle('');
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  return (
    <DashboardShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Scheduled Jobs
            </h1>
            <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              {jobs.length} Cron Active
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Otomatisasi pengiriman pesan berkala dan pembaruan data terjadwal dari database MySQL.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_rgba(158,233,57,0.25)] self-start md:self-auto"
        >
          <Icon name="more_time" size={18} />
          <span>Tambah Jadwal Job</span>
        </button>
      </div>

      {jobs.length === 0 && !loading ? (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-4">
            <Icon name="schedule" size={32} />
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
            Belum Ada Tugas Terjadwal (Cron)
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mb-6">
            Database jadwal otomatisasi saat ini masih bersih (0 jobs). Jadwalkan pesan pengingat atau promo berkala pertama Anda.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md text-sm"
          >
            <Icon name="add" size={18} />
            <span>Tambah Jadwal Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-lg flex flex-col justify-between hover:bg-surface-container transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-primary font-bold">{job.id}</span>
                  <Badge
                    label={job.status}
                    variant={job.status === 'Active' ? 'active' : 'plain'}
                  />
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">
                  {job.title}
                </h3>
                <div className="space-y-1 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <Icon name="schedule" size={14} className="text-secondary" />
                    <span>Jadwal: <strong className="text-on-surface">{job.cron}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="groups" size={14} className="text-tertiary" />
                    <span>Target: <strong className="text-on-surface">{job.target}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-outline-variant/15 text-xs">
                <span className="text-outline">Next: {job.nextRun}</span>
                <button
                  type="button"
                  onClick={() => toggleJob(job.id)}
                  className={`font-semibold hover:underline ${
                    job.status === 'Active' ? 'text-error' : 'text-primary'
                  }`}
                >
                  {job.status === 'Active' ? 'Pause Job' : 'Aktifkan'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah Job */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Tambah Jadwal Job Baru</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Judul Otomasi / Tugas</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Follow-up Pembayaran H+1"
                  className="w-full bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Jadwal Cron / Waktu Eksekusi</label>
                <input
                  type="text"
                  required
                  value={cron}
                  onChange={(e) => setCron(e.target.value)}
                  placeholder="Contoh: Setiap Hari @ 10:00 WIB"
                  className="w-full bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Target Kontak / Filter</label>
                <input
                  type="text"
                  required
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Contoh: Group: VIP Buyers (85 Kontak)"
                  className="w-full bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan ke MySQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
