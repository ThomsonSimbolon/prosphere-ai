'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

interface FlowItem {
  id: string;
  name: string;
  trigger: string;
  steps: number;
  active: boolean;
  executions: string;
}

export default function ChatbotFlowsPage() {
  const [flows, setFlows] = useState<FlowItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('');
  const [steps, setSteps] = useState('4');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadFlows = async () => {
    setLoading(true);
    const data = await api.getFlows();
    setFlows(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadFlows();
  }, []);

  const toggleFlow = async (id: string) => {
    setFlows(flows.map(f => f.id === id ? { ...f, active: !f.active } : f));
    await api.toggleFlow(id);
  };

  const handleCreateFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !trigger) return;
    setIsSubmitting(true);

    const res = await api.createFlow({
      name,
      trigger,
      stepsCount: parseInt(steps, 10) || 3,
    });

    if (res && res.success) {
      await loadFlows();
    }

    setName('');
    setTrigger('');
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN']}>
      <DashboardShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Chatbot Automation Flows
            </h1>
            <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              {flows.length} Flow Aktif
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Rancang alur interaksi otomatis langkah-demi-langkah dengan pemicu pintar tersinkronisasi database MySQL.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_rgba(158,233,57,0.25)] self-start md:self-auto"
        >
          <Icon name="account_tree" size={18} />
          <span>Buat Flow Alur Baru</span>
        </button>
      </div>

      {flows.length === 0 && !loading ? (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-4">
            <Icon name="account_tree" size={32} />
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
            Belum Ada Alur Chatbot
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mb-6">
            Database alur chatbot saat ini masih bersih (0 flow). Buat aturan alur pertama Anda untuk membalas otomatis kata kunci pelanggan.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md text-sm"
          >
            <Icon name="add" size={18} />
            <span>Buat Flow Pertama</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {flows.map((flow) => (
            <div
              key={flow.id}
              className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-container transition-colors shadow-sm"
            >
              <div className="flex items-start md:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <Icon name="device_hub" size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                      {flow.name}
                    </h3>
                    <span className="font-mono text-xs text-outline">{flow.id}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-on-surface-variant flex-wrap">
                    <span className="flex items-center gap-1 text-primary">
                      <Icon name="bolt" size={14} /> {flow.trigger}
                    </span>
                    <span>&bull;</span>
                    <span>{flow.steps} Langkah Alur</span>
                    <span>&bull;</span>
                    <span className="font-mono tabular-nums font-semibold">{flow.executions} Eksekusi</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-auto">
                <Badge
                  label={flow.active ? 'Aktif' : 'Nonaktif'}
                  variant={flow.active ? 'active' : 'plain'}
                />
                <button
                  type="button"
                  onClick={() => toggleFlow(flow.id)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    flow.active ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-surface-container-lowest transition-transform ${
                      flow.active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Buat Flow Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Buat Flow Otomasi Baru</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateFlow} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Nama Alur Flow</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Auto Welcome & Price List"
                  className="w-full bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Pemicu / Trigger Kata Kunci</label>
                <input
                  type="text"
                  required
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  placeholder="Keyword: 'Halo', 'Pricelist', 'Promo'"
                  className="w-full bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Jumlah Tahapan Langkah</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  className="w-full bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary font-mono text-xs"
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
  </RoleGuard>
  );
}
