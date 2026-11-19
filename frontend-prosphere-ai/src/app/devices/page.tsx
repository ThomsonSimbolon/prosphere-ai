'use client';

import React, { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';

interface DeviceItem {
  id: string;
  sessionName: string;
  phoneNumber?: string;
  status: string;
  batteryPercentage?: number;
  qrCode?: string | null;
  lastConnectedAt?: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadDevices = async () => {
    setLoading(true);
    const data = await api.getDevices();
    setDevices(data || []);
    if (data && Array.isArray(data)) {
      const activeQR = data.find((d: any) => d.qrCode);
      if (activeQR) setQrCodeData(activeQR.qrCode);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDevices();
  }, []);

  // Polling QR code & connection status while QR modal/banner is active
  useEffect(() => {
    if (!showQR) return;

    const interval = setInterval(async () => {
      const data = await api.getDevices();
      if (data && Array.isArray(data)) {
        setDevices(data);
        const session = data.find((d: any) => d.sessionName === 'default-session');
        if (session) {
          if (session.status === 'CONNECTED') {
            setShowQR(false);
            setFeedback(`WhatsApp berhasil terhubung dengan nomor ${session.phoneNumber || ''}!`);
            clearInterval(interval);
          } else if (session.qrCode && !qrCodeData) {
            setQrCodeData(session.qrCode);
          }
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [showQR, qrCodeData]);

  const handleStartSession = async () => {
    setShowQR(true);
    setIsInitializing(true);
    setFeedback(null);
    try {
      const res = await api.startDeviceSession();
      if (res && res.data && res.data.qrCode) {
        setQrCodeData(res.data.qrCode);
      }
      await loadDevices();
    } catch (e) {
      console.error(e);
    }
    setIsInitializing(false);
  };

  const handleDisconnect = async () => {
    const confirm = window.confirm('Apakah Anda yakin ingin memutuskan koneksi sesi WhatsApp ini?');
    if (!confirm) return;

    try {
      await api.disconnectDevice();
      setQrCodeData(null);
      setShowQR(false);
      setFeedback('Sesi WhatsApp berhasil diputuskan.');
      await loadDevices();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN']}>
      <DashboardShell>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <div className="flex items-center gap-space-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Connected Devices
            </h1>
            <span className="inline-flex items-center px-space-xs py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              WhatsApp Web Multi-Device
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Kelola session WhatsApp terhubung melalui engine Baileys multi-device.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!showQR) {
              handleStartSession();
            } else {
              setShowQR(false);
            }
          }}
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_rgba(158,233,57,0.25)] self-start md:self-auto"
        >
          <Icon name="qr_code_scanner" size={18} />
          <span>{showQR ? 'Tutup Scanner' : 'Hubungkan Device Baru'}</span>
        </button>
      </div>

      {feedback && (
        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/30 text-primary flex items-center justify-between text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Icon name="check_circle" size={20} />
            <span>{feedback}</span>
          </div>
          <button type="button" onClick={() => setFeedback(null)} className="text-outline hover:text-on-surface">
            <Icon name="close" size={18} />
          </button>
        </div>
      )}

      {/* QR Code Connect Banner if opened */}
      {showQR && (
        <div className="bg-surface-container-low border border-primary/30 p-space-lg rounded-2xl mb-space-lg flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="flex flex-col gap-2 max-w-lg">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Scan QR Code WhatsApp Web
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              1. Buka aplikasi WhatsApp di HP Anda.<br />
              2. Ketuk Menu <strong>⋮</strong> (Android) atau <strong>Pengaturan</strong> (iOS).<br />
              3. Pilih <strong>Perangkat Tertaut</strong> &rarr; <strong>Tautkan Perangkat</strong>.<br />
              4. Arahkan kamera ke QR code di samping ini.
            </p>
            <div className="flex items-center gap-2 mt-2 text-primary font-label-md text-label-md">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span>
                {isInitializing
                  ? 'Menghubungi Baileys Gateway & menyiapkan socket...'
                  : qrCodeData
                  ? 'QR code aktif. Arahkan kamera HP Anda untuk menghubungkan.'
                  : 'Menunggu respon server WhatsApp...'}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center">
            {qrCodeData ? (
              <img
                src={qrCodeData}
                alt="WhatsApp QR Code"
                className="w-48 h-48 object-contain rounded-lg border-2 border-black/10"
              />
            ) : (
              <div className="w-48 h-48 bg-surface-container-lowest rounded-xl flex flex-col items-center justify-center border-4 border-dashed border-outline-variant/40 gap-3 text-center p-4">
                <Icon name="sync" size={36} className="text-primary animate-spin" />
                <span className="text-xs text-on-surface-variant font-medium">Memuat QR Code dari Baileys...</span>
              </div>
            )}
            <span className="text-xs text-black font-mono font-bold mt-2">WA-GATEWAY-SESSION</span>
          </div>
        </div>
      )}

      {/* Device List Grid */}
      {devices.length === 0 && !loading ? (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-outline mb-4">
            <Icon name="phonelink_erase" size={32} />
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">
            Belum Ada Device Terhubung
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mb-6">
            Database sesi perangkat WhatsApp saat ini masih bersih (0 sesi). Tautkan nomor WhatsApp Anda untuk mulai mengirim pesan dan mengaktifkan AI bot.
          </p>
          <button
            type="button"
            onClick={handleStartSession}
            className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md text-sm"
          >
            <Icon name="qr_code_scanner" size={18} />
            <span>Tautkan Perangkat WhatsApp Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {devices.map((device, idx) => (
            <div
              key={device.id || idx}
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-lg flex flex-col justify-between hover:bg-surface-container transition-colors shadow-sm relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Icon name="smartphone" size={24} />
                  </div>
                  <div>
                    <h3 className="font-label-lg text-label-lg font-bold text-on-surface">
                      {device.sessionName}
                    </h3>
                    <span className="font-mono text-sm text-on-surface-variant">{device.phoneNumber || '+62 812-xxxx-xxxx'}</span>
                  </div>
                </div>
                <Badge
                  label={device.status === 'CONNECTED' ? 'Online' : device.status}
                  variant={device.status === 'CONNECTED' ? 'active' : 'plain'}
                />
              </div>

              <div className="space-y-2 py-3 border-y border-outline-variant/20 my-2 text-sm text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Baterai HP</span>
                  <span className="text-on-surface font-semibold flex items-center gap-1">
                    <Icon name="battery_full" size={16} className="text-secondary" /> {device.batteryPercentage || 100}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Koneksi Gateway</span>
                  <span className="text-primary font-semibold flex items-center gap-1">
                    <Icon name="wifi" size={16} /> Stabil (42ms)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pesan Terkirim</span>
                  <span className="text-on-surface font-semibold tabular-nums">0 Pesan</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-outline">
                  {device.lastConnectedAt ? `Status: ${new Date(device.lastConnectedAt).toLocaleDateString()}` : 'Terhubung'}
                </span>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="text-error hover:underline text-xs font-semibold flex items-center gap-1"
                >
                  <Icon name="power_settings_new" size={14} />
                  <span>Putuskan</span>
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}
      </DashboardShell>
    </RoleGuard>
  );
}
