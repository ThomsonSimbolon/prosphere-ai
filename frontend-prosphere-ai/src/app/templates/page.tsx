'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Icon } from '@/components/ui/Icon';
import { api } from '@/lib/api';

interface TemplateItem {
  id: string;
  title: string;
  category: string;
  text: string;
  usage: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Marketing');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadTemplates = async () => {
    setLoading(true);
    const data = await api.getTemplates();
    setTemplates(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const copyTemplate = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsSubmitting(true);

    const res = await api.createTemplate({ title, category, content });
    if (res && res.success) {
      await loadTemplates();
    }
    setTitle('');
    setContent('');
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'STAFF_MARKETING']}>
      <DashboardShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Message Templates
            </h1>
            <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              {templates.length} Preset Tersedia
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Kelola template pesan cepat dengan variabel dinamis untuk mempercepat respon pelanggan WhatsApp.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_rgba(158,233,57,0.25)] self-start md:self-auto"
        >
          <Icon name="add" size={18} />
          <span>Buat Template Baru</span>
        </button>
      </div>

      {templates.length === 0 && !loading ? (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-4">
            <Icon name="drafts" size={32} />
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
            Belum Ada Template Pesan
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mb-6">
            Database template pesan saat ini masih bersih (0 template). Buat preset pertama Anda untuk membalas chat secara instan.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md text-sm"
          >
            <Icon name="add" size={18} />
            <span>Buat Template Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-lg flex flex-col justify-between hover:bg-surface-container transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-surface-container text-primary">
                      {tpl.category}
                    </span>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {tpl.title}
                    </h3>
                  </div>
                  <span className="text-xs text-outline font-mono">Digunakan: {tpl.usage}</span>
                </div>
                <div className="p-3 bg-surface-container rounded-xl font-mono text-xs text-on-surface-variant leading-relaxed border border-outline-variant/20">
                  {tpl.text}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-outline-variant/15">
                <span className="text-[11px] text-outline">Gunakan format &#123;&#123;name&#125;&#125; untuk auto-replace</span>
                <button
                  type="button"
                  onClick={() => copyTemplate(tpl.id, tpl.text)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                >
                  <Icon name={copiedId === tpl.id ? 'check' : 'content_copy'} size={14} className={copiedId === tpl.id ? 'text-primary' : ''} />
                  <span>{copiedId === tpl.id ? 'Tersalin!' : 'Salin Template'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah Template */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Buat Template Pesan Baru</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Judul Template</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Pengingat Pembayaran H-1"
                  className="w-full bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary"
                >
                  <option value="General">General</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Support">Support</option>
                  <option value="Bookings">Bookings</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Isi Pesan (Gunakan &#123;&#123;name&#125;&#125;)</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Halo {{name}}, pesanan Anda telah dikirim dengan resi..."
                  className="w-full bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary resize-none font-mono text-xs"
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
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Template'}
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
