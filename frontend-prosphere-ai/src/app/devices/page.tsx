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

  // State untuk Modal Konfirmasi Putuskan Koneksi (Interactive Centered Modal)
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [deviceToDisconnect, setDeviceToDisconnect] = useState<DeviceItem | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

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
          } else if (session.qrCode && (!qrCodeData || qrCodeData !== session.qrCode)) {
            setQrCodeData(session.qrCode);
          }
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [showQR, qrCodeData]);

  const handleStartSession = async () => {
    setShowQR(true);
    setIsInitializing(true);
    setFeedback(null);
    setQrCodeData(null);
    try {
      const res = await api.startDeviceSession();
      if (res && res.data && res.data.qrCode) {
        setQrCodeData(res.data.qrCode);
      }
      await loadDevices();
    } catch (e) {
      console.error(e);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleOpenDisconnectModal = (device?: DeviceItem) => {
    setDeviceToDisconnect(device || devices[0] || null);
    setDisconnectModalOpen(true);
  };

  const confirmDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await api.disconnectDevice();
      setQrCodeData(null);
      setShowQR(false);
      setFeedback('Sesi WhatsApp berhasil diputuskan secara aman.');
      setDisconnectModalOpen(false);
      setDeviceToDisconnect(null);
      await loadDevices();
    } catch (e: any) {
      console.error(e);
      setFeedback('Gagal memutuskan sesi: ' + (e?.message || 'Terjadi kendala server'));
    } finally {
      setIsDisconnecting(false);
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
                  onClick={() => handleOpenDisconnectModal(device)}
                  className="text-error hover:text-error/80 px-2.5 py-1 rounded-lg bg-error/10 hover:bg-error/20 border border-error/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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

      {/* ========================================================= */}
      {/* INTERACTIVE CENTERED CONFIRMATION MODAL: DISCONNECT       */}
      {/* ========================================================= */}
      {disconnectModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          {/* Modal Container */}
          <div className="bg-[#071d10] border border-outline-variant/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Top Danger Gradient Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-error via-[#ff5449] to-error/30" />

            {/* Close Button top-right */}
            <button
              type="button"
              disabled={isDisconnecting}
              onClick={() => {
                if (!isDisconnecting) {
                  setDisconnectModalOpen(false);
                  setDeviceToDisconnect(null);
                }
              }}
              className="absolute top-4 right-4 text-outline hover:text-on-surface p-1.5 rounded-xl hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Icon name="close" size={20} />
            </button>

            {/* Glowing Danger Icon */}
            <div className="w-16 h-16 rounded-2xl bg-error/10 border border-error/30 text-error flex items-center justify-center mx-auto mb-4 ring-8 ring-error/5 shadow-[0_0_25px_rgba(255,84,73,0.25)]">
              <Icon name="link_off" size={32} />
            </div>

            {/* Title & Description */}
            <h3 className="font-headline-sm text-xl font-extrabold text-on-surface text-center mb-2">
              Putuskan Sesi WhatsApp?
            </h3>
            <p className="text-on-surface-variant text-sm text-center leading-relaxed mb-5">
              Apakah Anda yakin ingin memutuskan tautan sesi{' '}
              <strong className="text-on-surface font-semibold">
                {deviceToDisconnect?.phoneNumber || 'default-session'}
              </strong>{' '}
              dari sistem ProSphere AI?
            </p>

            {/* Consequence Notification Box */}
            <div className="p-3.5 rounded-2xl bg-[#03170b] border border-outline-variant/25 text-xs text-on-surface-variant space-y-2 mb-6">
              <div className="flex items-start gap-2 text-warning">
                <Icon name="warning" size={16} className="shrink-0 mt-0.5" />
                <span>
                  Respon pesan otomatis, AI Sales Agent, dan antrean kampanye siaran akan <strong>dihentikan sementara</strong> hingga perangkat ditautkan ulang.
                </span>
              </div>
              <div className="flex items-start gap-2 text-secondary pt-1 border-t border-outline-variant/15">
                <Icon name="check_circle" size={16} className="shrink-0 mt-0.5" />
                <span>
                  Riwayat pesan dan data CRM Anda tetap tersimpan dengan aman di database.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isDisconnecting}
                onClick={() => {
                  setDisconnectModalOpen(false);
                  setDeviceToDisconnect(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-semibold text-sm transition-colors text-center cursor-pointer disabled:opacity-50"
              >
                Batal, Pertahankan
              </button>

              <button
                type="button"
                disabled={isDisconnecting}
                onClick={confirmDisconnect}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-error to-[#d32f2f] hover:opacity-95 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,84,73,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDisconnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memutuskan...</span>
                  </>
                ) : (
                  <>
                    <Icon name="power_settings_new" size={16} />
                    <span>Ya, Putuskan Sesi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </DashboardShell>
    </RoleGuard>
  );
}
