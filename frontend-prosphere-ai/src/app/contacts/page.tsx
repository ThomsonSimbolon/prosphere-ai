'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Icon } from '@/components/ui/Icon';
import { api } from '@/lib/api';

interface ContactItem {
  id: string;
  name: string;
  phone: string;
  tags: string[];
  messages: number;
  lastActive: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newTag, setNewTag] = useState('Hot Lead');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadContacts = async () => {
    setLoading(true);
    const data = await api.getContacts();
    setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    setIsSubmitting(true);
    const res = await api.createContact({
      name: newName,
      phoneNumber: newPhone,
      tags: newTag,
    });

    if (res && res.success) {
      await loadContacts();
      setIsModalOpen(false);
      setNewName('');
      setNewPhone('');
    }
    setIsSubmitting(false);
  };

  const filtered = contacts.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'STAFF_SALES_CS']}>
      <DashboardShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Contacts Database
            </h1>
            <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              {contacts.length} Kontak Aktif
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Buku kontak tersinkronisasi langsung dengan database MySQL (Laragon).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_rgba(158,233,57,0.25)]"
          >
            <Icon name="person_add" size={18} />
            <span>Tambah Kontak</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/20 w-full sm:w-80">
            <Icon name="search" size={18} className="text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau no HP..."
              className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline w-full"
            />
          </div>
          {loading && (
            <span className="text-xs text-primary font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Menghubungkan ke MySQL Database...
            </span>
          )}
        </div>

        {contacts.length === 0 && !loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-4">
              <Icon name="people" size={32} />
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
              Database Kontak Masih Kosong
            </h3>
            <p className="text-sm text-on-surface-variant max-w-md mb-6">
              Belum ada kontak yang tersimpan di MySQL. Silakan tambahkan kontak pelanggan pertama Anda.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md text-sm"
            >
              <Icon name="person_add" size={18} />
              <span>Tambah Kontak Pertama</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-on-surface">
              <thead className="bg-surface-container border-b border-outline-variant/30 text-xs uppercase text-on-surface-variant">
                <tr>
                  <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                  <th className="px-6 py-4 font-semibold">Nomor WhatsApp</th>
                  <th className="px-6 py-4 font-semibold">Tag Kategori</th>
                  <th className="px-6 py-4 font-semibold">Total Pesan</th>
                  <th className="px-6 py-4 font-semibold">Interaksi Terakhir</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container/60 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-bold text-on-surface">{c.name}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-on-surface-variant">{c.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {Array.isArray(c.tags) && c.tags.map((t) => (
                          <span key={t} className="text-[11px] bg-surface-container px-2 py-0.5 rounded text-tertiary font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono tabular-nums">{c.messages || 0}</td>
                    <td className="px-6 py-4 text-xs text-outline">{c.lastActive || 'Baru'}</td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href="/single-message"
                        className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-semibold text-primary transition-colors inline-block"
                      >
                        Kirim Pesan
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah Kontak */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Tambah Kontak Baru</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Rian Pratama"
                  className="w-full bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Nomor WhatsApp (+62)</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Contoh: +6281234567890"
                  className="w-full bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Tag / Segmen</label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full bg-surface-container px-3.5 py-2 rounded-xl border border-outline-variant/30 text-sm text-on-surface outline-none focus:border-primary"
                >
                  <option value="Hot Lead">Hot Lead</option>
                  <option value="VIP">VIP</option>
                  <option value="Corporate">Corporate</option>
                  <option value="New Lead">New Lead</option>
                  <option value="Demo Scheduled">Demo Scheduled</option>
                </select>
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
                  {isSubmitting ? 'Menyimpan...' : 'Simpan ke Database'}
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
