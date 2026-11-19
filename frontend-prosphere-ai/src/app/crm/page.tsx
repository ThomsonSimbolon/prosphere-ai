'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Icon } from '@/components/ui/Icon';
import { api } from '@/lib/api';

const DEFAULT_COLUMNS = [
  {
    title: 'New Leads',
    key: 'NEW',
    color: 'border-primary',
    leads: [],
  },
  {
    title: 'Contacted',
    key: 'CONTACTED',
    color: 'border-secondary',
    leads: [],
  },
  {
    title: 'Qualified / Demo',
    key: 'QUALIFIED',
    color: 'border-tertiary',
    leads: [],
  },
  {
    title: 'Closed Won',
    key: 'CLOSED_WON',
    color: 'border-primary-container',
    leads: [],
  },
];

export default function CrmPage() {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [showModal, setShowModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadValue, setNewLeadValue] = useState('1000');

  const loadPipeline = async () => {
    const data = await api.getCrmPipeline();
    if (data && Array.isArray(data) && data.length > 0) {
      setColumns(data);
    }
  };

  useEffect(() => {
    loadPipeline();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName) return;

    await api.createLead({
      name: newLeadName,
      company: newLeadCompany,
      value: parseFloat(newLeadValue) || 0,
      stage: 'NEW',
    });

    setNewLeadName('');
    setNewLeadCompany('');
    setShowModal(false);
    await loadPipeline();
  };

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              CRM & Sales Pipeline
            </h1>
            <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Live Deals (MySQL)
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Lacak pipeline prospek dari WhatsApp hingga transaksi sukses. Terhubung langsung ke database backend.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_rgba(158,233,57,0.25)] self-start md:self-auto"
        >
          <Icon name="add" size={18} />
          <span>Tambah Lead Baru</span>
        </button>
      </div>

      {/* Modal Tambah Lead */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-outline-variant/30 p-6 rounded-2xl max-w-md w-full shadow-2xl">
            <h3 className="font-headline-sm text-lg font-bold text-on-surface mb-4">
              Tambah Calon Pelanggan Baru
            </h3>
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="text-xs text-on-surface-variant block mb-1 font-semibold">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="e.g. Budi Hartono"
                  className="w-full bg-surface-container p-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant block mb-1 font-semibold">Perusahaan / Toko</label>
                <input
                  type="text"
                  value={newLeadCompany}
                  onChange={(e) => setNewLeadCompany(e.target.value)}
                  placeholder="e.g. PT Maju Bersama"
                  className="w-full bg-surface-container p-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant block mb-1 font-semibold">Estimasi Nilai Deals (Rs / IDR)</label>
                <input
                  type="number"
                  value={newLeadValue}
                  onChange={(e) => setNewLeadValue(e.target.value)}
                  className="w-full bg-surface-container p-2.5 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary font-mono"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:opacity-90 shadow"
                >
                  Simpan ke MySQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {columns.map((col) => (
          <div
            key={col.title}
            className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-md flex flex-col gap-3 min-h-[500px]"
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between pb-2 border-b-2 ${col.color}`}>
              <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                {col.title}
              </h3>
              <span className="bg-surface-container px-2 py-0.5 rounded-full text-xs font-mono font-bold text-on-surface">
                {col.leads.length}
              </span>
            </div>

            {/* Leads Cards */}
            <div className="flex flex-col gap-3">
              {col.leads.map((lead: any) => (
                <div
                  key={lead.id}
                  className="bg-surface-container p-3.5 rounded-xl border border-outline-variant/20 hover:border-primary/50 transition-colors cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant font-medium">
                      {lead.tag}
                    </span>
                    <span className="font-bold text-primary text-sm font-mono">{lead.val}</span>
                  </div>
                  <h4 className="font-label-md text-label-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    {lead.name}
                  </h4>
                  <span className="text-xs text-outline">{lead.company}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
