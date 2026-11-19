'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Icon } from '@/components/ui/Icon';
import { api } from '@/lib/api';

interface GroupItem {
  id: string;
  name: string;
  desc: string;
  count: number;
  icon?: string;
  color?: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadGroups = async () => {
    setLoading(true);
    const data = await api.getGroups();
    setGroups(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);

    const res = await api.createGroup({ name, description: desc });
    if (res && res.success) {
      await loadGroups();
    }
    setName('');
    setDesc('');
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
              Contact Groups & Segments
            </h1>
            <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              {groups.length} Segmen
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Kelompokkan kontak pelanggan dari database MySQL untuk kampanye siaran yang lebih tepat sasaran.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_rgba(158,233,57,0.25)] self-start md:self-auto"
        >
          <Icon name="group_add" size={18} />
          <span>Buat Group Baru</span>
        </button>
      </div>

      {groups.length === 0 && !loading ? (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-4">
            <Icon name="groups" size={32} />
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
            Belum Ada Group Kontak
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mb-6">
            Database segmen grup masih bersih (0 grup). Buat grup kontak pertama Anda untuk broadcast pesan bertarget.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md text-sm"
          >
            <Icon name="group_add" size={18} />
            <span>Buat Group Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {groups.map((grp) => (
            <div
              key={grp.id}
              className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-space-lg flex flex-col justify-between hover:bg-surface-container transition-colors shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center ${grp.color || 'text-primary'}`}>
                      <Icon name={grp.icon || 'group'} size={22} />
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                        {grp.name}
                      </h3>
                      <span className="text-xs text-outline font-mono">{grp.id}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container font-mono text-xs font-bold text-on-surface">
                    {grp.count} Kontak
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant line-clamp-2">
                  {grp.desc || 'Segmen dinamis kontak ProSphere AI.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-outline-variant/15">
                <a
                  href="/bulk-messages"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Broadcast ke Group ini</span>
                  <Icon name="arrow_forward" size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah Group */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Buat Group Kontak Baru</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Nama Group</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Webinar AI Exclusive"
                  className="w-full bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Deskripsi Target</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Keterangan singkat tentang kontak di group ini..."
                  className="w-full bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary resize-none"
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
                  {isSubmitting ? 'Memproses...' : 'Simpan Group'}
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
