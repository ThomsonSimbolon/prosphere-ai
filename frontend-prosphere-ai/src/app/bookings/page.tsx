'use client';

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

interface BookingItem {
  id: string;
  client: string;
  service: string;
  date: string;
  time: string;
  status: string;
  phone: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await api.getBookings();
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <DashboardShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Bookings & Appointments
            </h1>
            <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              {bookings.length} Reservasi
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Daftar janji temu dan reservasi yang dibuat otomatis oleh AI Sales Bot atau input admin.
          </p>
        </div>
      </div>

      {/* Bookings Table Card */}
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm">
        {bookings.length === 0 && !loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-4">
              <Icon name="event_busy" size={32} />
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
              Belum Ada Jadwal Reservasi
            </h3>
            <p className="text-sm text-on-surface-variant max-w-md mb-4">
              Tabel reservasi saat ini masih bersih (0 booking). Jadwal akan tercatat otomatis saat pelanggan berinteraksi dengan AI Sales Bot.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-on-surface">
              <thead className="bg-surface-container border-b border-outline-variant/30 text-xs uppercase text-on-surface-variant">
                <tr>
                  <th className="px-6 py-4 font-semibold">Klien</th>
                  <th className="px-6 py-4 font-semibold">Layanan</th>
                  <th className="px-6 py-4 font-semibold">Jadwal Pertemuan</th>
                  <th className="px-6 py-4 font-semibold">Nomor WhatsApp</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-on-surface flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary font-bold flex items-center justify-center text-xs">
                        {b.client.charAt(0)}
                      </div>
                      <span>{b.client}</span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{b.service}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-on-surface">{b.date}</div>
                      <div className="text-xs text-outline">{b.time}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{b.phone}</td>
                    <td className="px-6 py-4">
                      <Badge label={b.status} variant="active" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-semibold text-primary transition-colors"
                      >
                        Kelola
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
