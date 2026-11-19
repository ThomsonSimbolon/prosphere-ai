'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Icon } from '@/components/ui/Icon';
import { api } from '@/lib/api';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'STAFF_SALES_CS' | 'STAFF_MARKETING';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

interface ActivityLogItem {
  id: string;
  actorName: string;
  actorEmail: string;
  action: string;
  details: string | null;
  createdAt: string;
}

export default function UserManagementPage() {
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF_SALES_CS',
    status: 'ACTIVE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // State untuk Konfirmasi Hapus Modal Interaktif & Feedback Banner
  const [deleteModalStaff, setDeleteModalStaff] = useState<StaffUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchStaffData = async () => {
    setIsLoading(true);
    try {
      const [users, activityLogs] = await Promise.all([
        api.getStaff(),
        api.getActivityLogs(30),
      ]);
      setStaffList(users || []);
      setLogs(activityLogs || []);
    } catch (err) {
      console.error('Error fetching staff management data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'STAFF_SALES_CS',
      status: 'ACTIVE',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff: StaffUser) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      password: '',
      role: staff.role,
      status: staff.status,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingStaff) {
        // Update
        const payload: any = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        };
        if (formData.password) payload.password = formData.password;

        const res = await api.updateStaff(editingStaff.id, payload);
        if (!res.success) throw new Error(res.message);
      } else {
        // Create
        if (!formData.password) throw new Error('Password wajib diisi untuk staf baru.');
        const res = await api.createStaff({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        if (!res.success) throw new Error(res.message);
      }

      setIsModalOpen(false);
      await fetchStaffData();
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteStaff = async () => {
    if (!deleteModalStaff) return;
    setIsDeleting(true);
    setActionFeedback(null);
    try {
      const res = await api.deleteStaff(deleteModalStaff.id);
      if (!res.success) {
        setActionFeedback({ type: 'error', message: res.message || 'Gagal menghapus staf.' });
      } else {
        setActionFeedback({ type: 'success', message: `Akun staf ${deleteModalStaff.name} berhasil dihapus.` });
        setDeleteModalStaff(null);
        await fetchStaffData();
      }
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Gagal menghapus staf.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (staff: StaffUser) => {
    const newStatus = staff.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setActionFeedback(null);
    try {
      const res = await api.updateStaff(staff.id, { status: newStatus });
      if (!res.success) {
        setActionFeedback({ type: 'error', message: res.message || 'Gagal mengubah status staf.' });
        return;
      }
      setActionFeedback({
        type: 'success',
        message: `Status staf ${staff.name} berhasil diubah menjadi ${newStatus === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}.`,
      });
      await fetchStaffData();
    } catch (err: any) {
      setActionFeedback({ type: 'error', message: err.message || 'Gagal mengubah status staf.' });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
            👑 Super Admin
          </span>
        );
      case 'STAFF_SALES_CS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary/20 text-secondary border border-secondary/30">
            💼 Sales & CS
          </span>
        );
      case 'STAFF_MARKETING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-tertiary/20 text-tertiary border border-tertiary/30">
            📢 Marketing
          </span>
        );
      default:
        return <span>{role}</span>;
    }
  };

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN']}>
      <DashboardShell>
        <div className="flex flex-col gap-space-lg">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
            <div>
              <div className="flex items-center gap-space-xs">
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Manajemen Pengguna & RBAC
                </h1>
                <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  Administrasi Keamanan
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                Atur hak akses staf, pantau status akun, dan amati riwayat aktivitas keamanan sistem.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_rgba(158,233,57,0.25)] self-start md:self-auto cursor-pointer"
            >
              <Icon name="person_add" size={18} />
              <span>Tambah Staf Baru</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-label-md text-label-md font-bold transition-colors cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <Icon name="group" size={18} />
              <span>Daftar Staf ({staffList.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-label-md text-label-md font-bold transition-colors cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <Icon name="history" size={18} />
              <span>Activity Logs ({logs.length})</span>
            </button>
          </div>

          {/* In-App Feedback Banner (No alert popups) */}
          {actionFeedback && (
            <div
              className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold animate-fadeIn ${
                actionFeedback.type === 'success'
                  ? 'bg-primary/10 border border-primary/30 text-primary'
                  : 'bg-error/10 border border-error/30 text-error'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  name={actionFeedback.type === 'success' ? 'check_circle' : 'error'}
                  size={18}
                />
                <span>{actionFeedback.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setActionFeedback(null)}
                className="text-outline hover:text-on-surface"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          )}

          {/* TAB 1: USERS LIST */}
          {activeTab === 'users' && (
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/20 bg-surface-container/50 font-label-sm text-label-sm text-outline uppercase tracking-wider">
                      <th className="py-3 px-4">Nama Staf</th>
                      <th className="py-3 px-4">Email Login</th>
                      <th className="py-3 px-4">Role Wewenang</th>
                      <th className="py-3 px-4">Status Akun</th>
                      <th className="py-3 px-4">Terdaftar</th>
                      <th className="py-3 px-4 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-body-md">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-on-surface-variant">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          Memuat data staf...
                        </td>
                      </tr>
                    ) : staffList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-on-surface-variant">
                          Belum ada staf terdaftar.
                        </td>
                      </tr>
                    ) : (
                      staffList.map((staff) => (
                        <tr key={staff.id} className="hover:bg-surface-container-high/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-on-surface">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-label-md text-primary">
                                {staff.name.charAt(0).toUpperCase()}
                              </div>
                              <span>{staff.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-label-md text-on-surface-variant">
                            {staff.email}
                          </td>
                          <td className="py-3.5 px-4">
                            {getRoleBadge(staff.role)}
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(staff)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                                staff.status === 'ACTIVE'
                                  ? 'bg-secondary/15 text-secondary hover:bg-secondary/25'
                                  : 'bg-error/15 text-error hover:bg-error/25'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  staff.status === 'ACTIVE' ? 'bg-secondary' : 'bg-error'
                                }`}
                              />
                              {staff.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 font-label-sm text-outline">
                            {new Date(staff.createdAt).toLocaleDateString('id-ID')}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(staff)}
                                className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                                title="Edit Staf"
                              >
                                <Icon name="edit" size={18} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteModalStaff(staff)}
                                className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                                title="Hapus Staf"
                              >
                                <Icon name="delete" size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY LOGS */}
          {activeTab === 'logs' && (
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-xl p-space-md">
              <div className="flex items-center justify-between mb-space-md">
                <h3 className="font-headline-sm text-label-lg font-bold text-on-surface">
                  Audit Trail & Log Keamanan Sistem
                </h3>
                <span className="font-label-sm text-outline">Menampilkan 30 log terakhir</span>
              </div>

              <div className="space-y-2">
                {logs.length === 0 ? (
                  <p className="text-center py-8 text-on-surface-variant">Belum ada aktivitas tercatat.</p>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-space-sm rounded-xl bg-surface-container/50 border border-outline-variant/20 flex items-center justify-between text-body-md"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            log.action.includes('DENIED') || log.action.includes('BLOCKED')
                              ? 'bg-error'
                              : log.action.includes('LOGIN')
                              ? 'bg-secondary'
                              : 'bg-primary'
                          }`}
                        />
                        <div>
                          <span className="font-mono text-label-sm text-primary font-bold mr-2">
                            [{log.action}]
                          </span>
                          <span className="text-on-surface font-medium">{log.details || '-'}</span>
                          <span className="text-outline text-label-sm ml-2">
                            oleh <strong className="text-on-surface-variant">{log.actorName}</strong> ({log.actorEmail})
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-label-sm text-outline shrink-0">
                        {new Date(log.createdAt).toLocaleTimeString('id-ID')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* MODAL TAMBAH / EDIT STAF */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-surface-container-low border border-outline-variant/40 rounded-3xl p-space-xl max-w-md w-full shadow-2xl relative">
                <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20 mb-space-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    {editingStaff ? 'Edit Informasi Staf' : 'Tambah Staf Baru'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <Icon name="close" size={20} />
                  </button>
                </div>

                {formError && (
                  <div className="mb-space-md p-space-sm rounded-xl bg-error/10 border border-error/30 text-error text-label-md flex items-center gap-2">
                    <Icon name="error" size={18} />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="flex flex-col gap-space-md">
                  <div>
                    <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Rian Anggara"
                      className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary text-body-md"
                    />
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1">
                      Email Akun
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rian@prosphere.ai"
                      className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary text-body-md"
                    />
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1">
                      Kata Sandi {editingStaff && <span className="text-outline font-normal">(Kosongkan jika tidak diganti)</span>}
                    </label>
                    <input
                      type="password"
                      required={!editingStaff}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary text-body-md"
                    />
                  </div>

                  <div>
                    <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1">
                      Peran Wewenang (Role)
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary text-body-md cursor-pointer"
                    >
                      <option value="STAFF_SALES_CS">💼 Staff Sales & Customer Service</option>
                      <option value="STAFF_MARKETING">📢 Staff Marketing</option>
                      <option value="SUPER_ADMIN">👑 Super Admin (Full Access)</option>
                    </select>
                  </div>

                  {editingStaff && (
                    <div>
                      <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1">
                        Status Akun
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-3.5 py-2 bg-surface-container border border-outline-variant/40 rounded-xl text-on-surface focus:outline-none focus:border-primary text-body-md cursor-pointer"
                      >
                        <option value="ACTIVE">Aktif</option>
                        <option value="INACTIVE">Nonaktif (Diblokir)</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-space-sm border-t border-outline-variant/20 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-medium text-label-md cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md text-label-md cursor-pointer"
                    >
                      {isSubmitting ? 'Menyimpan...' : editingStaff ? 'Simpan Perubahan' : 'Tambahkan Staf'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* INTERACTIVE CENTERED DELETE CONFIRMATION MODAL            */}
          {/* ========================================================= */}
          {deleteModalStaff && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
              <div className="bg-[#071d10] border border-outline-variant/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-error via-[#ff5449] to-error/30" />

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteModalStaff(null)}
                  className="absolute top-4 right-4 text-outline hover:text-on-surface p-1.5 rounded-xl hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Icon name="close" size={20} />
                </button>

                <div className="w-16 h-16 rounded-2xl bg-error/10 border border-error/30 text-error flex items-center justify-center mx-auto mb-4 ring-8 ring-error/5 shadow-[0_0_25px_rgba(255,84,73,0.25)]">
                  <Icon name="delete_forever" size={32} />
                </div>

                <h3 className="font-headline-sm text-xl font-extrabold text-on-surface text-center mb-2">
                  Hapus Akun Staf?
                </h3>
                <p className="text-on-surface-variant text-sm text-center leading-relaxed mb-5">
                  Apakah Anda yakin ingin menghapus akun staf{' '}
                  <strong className="text-on-surface font-semibold">{deleteModalStaff.name}</strong> ({deleteModalStaff.email})?
                </p>

                <div className="p-3.5 rounded-2xl bg-[#03170b] border border-outline-variant/25 text-xs text-on-surface-variant flex items-start gap-2 mb-6">
                  <Icon name="warning" size={16} className="text-warning shrink-0 mt-0.5" />
                  <span>
                    Tindakan ini tidak dapat dibatalkan. Pengguna tidak akan dapat mengakses ProSphere AI lagi setelah akun dihapus.
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setDeleteModalStaff(null)}
                    className="flex-1 py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-semibold text-sm transition-colors text-center cursor-pointer disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={confirmDeleteStaff}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-error to-[#d32f2f] hover:opacity-95 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,84,73,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Menghapus...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="delete" size={16} />
                        <span>Ya, Hapus Akun</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardShell>
    </RoleGuard>
  );
}
