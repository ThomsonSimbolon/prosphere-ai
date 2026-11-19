import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import { prisma } from '../../config/prisma.js';
import { Server } from 'socket.io';
import { AntiBanUtil } from './antiban.util.js';
import { aiService } from '../ai/ai.service.js';
import { logActivity } from '../logs/logs.service.js';

export class WhatsAppService {
  private socket: WASocket | null = null;
  private io: Server | null = null;
  private sessionDir: string;
  private qrCodeDataUrl: string | null = null;
  private isConnecting: boolean = false;
  private isExplicitlyDisconnected: boolean = false;

  constructor() {
    this.sessionDir = path.join(process.cwd(), 'sessions', 'default-session');
    if (!fs.existsSync(this.sessionDir)) {
      fs.mkdirSync(this.sessionDir, { recursive: true });
    }
  }

  setSocketServer(io: Server) {
    this.io = io;
  }

  async initSession(forceFresh: boolean = false) {
    if (forceFresh) {
      if (this.socket) {
        try {
          this.socket.end(undefined);
        } catch {}
        this.socket = null;
      }
      this.isConnecting = false;
      this.qrCodeDataUrl = null;

      // Clean stale session directory
      if (fs.existsSync(this.sessionDir)) {
        try {
          fs.rmSync(this.sessionDir, { recursive: true, force: true });
          fs.mkdirSync(this.sessionDir, { recursive: true });
        } catch (e) {
          console.warn('Failed to reset session dir:', e);
        }
      }
    }

    if (this.isConnecting || this.socket) return;
    this.isConnecting = true;
    this.isExplicitlyDisconnected = false;

    try {
      // Periksa jika database tidak dalam status CONNECTED tetapi ada file creds lama yang expired/corrupt
      const existingSession = await prisma.deviceSession.findUnique({
        where: { sessionName: 'default-session' },
      });
      const credsPath = path.join(this.sessionDir, 'creds.json');
      if ((!existingSession || existingSession.status !== 'CONNECTED') && fs.existsSync(credsPath)) {
        console.log('🧹 Membersihkan kredensial sesi lama agar Baileys membuat QR Code baru...');
        try {
          fs.rmSync(this.sessionDir, { recursive: true, force: true });
          fs.mkdirSync(this.sessionDir, { recursive: true });
        } catch {}
      }

      const { state, saveCreds } = await useMultiFileAuthState(this.sessionDir);

      this.socket = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        syncFullHistory: false,
      });

      this.socket.ev.on('creds.update', saveCreds);

      this.socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          try {
            this.qrCodeDataUrl = await QRCode.toDataURL(qr);
            if (this.io) {
              this.io.emit('whatsapp:qr', {
                session: 'default-session',
                qrCode: this.qrCodeDataUrl,
              });
            }
            await prisma.deviceSession.upsert({
              where: { sessionName: 'default-session' },
              update: { status: 'QR_READY', qrCode: this.qrCodeDataUrl },
              create: {
                sessionName: 'default-session',
                status: 'QR_READY',
                qrCode: this.qrCodeDataUrl,
                batteryPercentage: 94,
              },
            });
            console.log('📲 QR Code berhasil dibuat dan disimpan ke MySQL device_sessions');
          } catch (err) {
            console.error('Failed to generate QR data URL:', err);
          }
        }

        if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const shouldReconnect =
            statusCode !== DisconnectReason.loggedOut && statusCode !== 401 && statusCode !== 428;
          console.log(`WhatsApp connection closed (status ${statusCode}). Reconnect:`, shouldReconnect);

          await prisma.deviceSession.updateMany({
            where: { sessionName: 'default-session' },
            data: { status: 'DISCONNECTED', qrCode: null },
          });

          this.socket = null;
          this.isConnecting = false;
          this.qrCodeDataUrl = null;

          if (this.io) {
            this.io.emit('whatsapp:status', { status: 'DISCONNECTED' });
          }

          // Bersihkan file session jika sesi expired atau logout agar next start menghasilkan QR baru
          if (!shouldReconnect) {
            if (fs.existsSync(this.sessionDir)) {
              try {
                fs.rmSync(this.sessionDir, { recursive: true, force: true });
                fs.mkdirSync(this.sessionDir, { recursive: true });
              } catch {}
            }
          }

          if (shouldReconnect && !this.isExplicitlyDisconnected) {
            setTimeout(() => this.initSession(), 5000);
          }
        } else if (connection === 'open') {
          console.log('✅ WhatsApp Gateway connected successfully!');
          this.isConnecting = false;
          this.qrCodeDataUrl = null;

          const phoneNum = this.socket?.user?.id?.split(':')[0] || 'Connected';
          await prisma.deviceSession.upsert({
            where: { sessionName: 'default-session' },
            update: {
              status: 'CONNECTED',
              phoneNumber: phoneNum.startsWith('+') ? phoneNum : `+${phoneNum}`,
              lastConnectedAt: new Date(),
              qrCode: null,
            },
            create: {
              sessionName: 'default-session',
              status: 'CONNECTED',
              phoneNumber: phoneNum.startsWith('+') ? phoneNum : `+${phoneNum}`,
              lastConnectedAt: new Date(),
              batteryPercentage: 94,
            },
          });

          if (this.io) {
            this.io.emit('whatsapp:status', {
              status: 'CONNECTED',
              phoneNumber: phoneNum,
            });
          }
        }
      });

      // Listen for incoming messages & Trigger Autonomous AI Sales Agent
      this.socket.ev.on('messages.upsert', async (m) => {
        if (m.type === 'notify') {
          for (const msg of m.messages) {
            if (!msg.key.fromMe && msg.message) {
              const from = msg.key.remoteJid;
              // Abaikan chat grup dan status broadcast WhatsApp
              if (from && !from.includes('@g.us') && !from.includes('status@broadcast')) {
                const text =
                  msg.message.conversation ||
                  msg.message.extendedTextMessage?.text ||
                  '';

                const pushName = msg.pushName || 'Pelanggan WhatsApp';
                console.log(`📩 Inbound WhatsApp from ${from} (${pushName}): ${text}`);

                // Jalankan Inbound AI Auto-Reply secara asinkron
                this.handleInboundAiReply(from, text, pushName).catch((err) => {
                  console.error('Error executing Inbound AI Auto-Reply:', err);
                });
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error starting WhatsApp session:', error);
      this.isConnecting = false;
    }
  }

  async getSessionStatus() {
    const session = await prisma.deviceSession.findUnique({
      where: { sessionName: 'default-session' },
    });
    return (
      session || {
        sessionName: 'default-session',
        status: 'DISCONNECTED',
        phoneNumber: null,
        batteryPercentage: 94,
      }
    );
  }

  async waitForQrCode(timeoutMs = 6000): Promise<string | null> {
    if (this.qrCodeDataUrl) return this.qrCodeDataUrl;
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (this.qrCodeDataUrl) return this.qrCodeDataUrl;
      await new Promise((r) => setTimeout(r, 200));
    }
    return this.qrCodeDataUrl;
  }

  async disconnectSession() {
    this.isExplicitlyDisconnected = true;
    this.isConnecting = false;
    this.qrCodeDataUrl = null;

    if (this.socket) {
      try {
        this.socket.end(undefined);
      } catch {}
      this.socket = null;
    }

    if (fs.existsSync(this.sessionDir)) {
      try {
        fs.rmSync(this.sessionDir, { recursive: true, force: true });
        fs.mkdirSync(this.sessionDir, { recursive: true });
      } catch {}
    }

    await prisma.deviceSession.deleteMany({
      where: { sessionName: 'default-session' },
    });

    if (this.io) {
      this.io.emit('whatsapp:status', { status: 'DISCONNECTED' });
    }

    return { success: true, message: 'Device session disconnected successfully' };
  }

  async checkNumberOnWhatsApp(phone: string): Promise<{ exists: boolean; jid?: string }> {
    if (!this.socket) {
      return { exists: true, jid: `${phone.replace(/[^0-9]/g, '')}@s.whatsapp.net` };
    }

    try {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const results = await this.socket.onWhatsApp(cleanPhone);
      const result = results && results.length > 0 ? results[0] : null;
      return {
        exists: !!result?.exists,
        jid: result?.jid,
      };
    } catch (err) {
      console.warn('Error checking number on WhatsApp:', err);
      return { exists: true, jid: `${phone.replace(/[^0-9]/g, '')}@s.whatsapp.net` };
    }
  }

  async sendMessage(
    to: string,
    rawText: string,
    options: { simulateTyping?: boolean; parseSpintax?: boolean } = { simulateTyping: true, parseSpintax: true }
  ) {
    // 1. Anti-Ban: Apply Spintax Parser
    const text = options.parseSpintax !== false ? AntiBanUtil.parseSpintax(rawText) : rawText;

    if (!this.socket) {
      // Simulate successful dispatch for testing / offline demo with Anti-Ban metadata
      console.log(`[ANTI-BAN SIMULATED] Sending humanized message to ${to}: ${text}`);
      return {
        id: `sim-${Date.now()}`,
        status: 'SENT',
        to,
        text,
        simulated: true,
        antiBan: {
          typingDurationMs: AntiBanUtil.calculateTypingDurationMs(text.length),
          spintaxApplied: true,
        },
      };
    }

    const cleanNumber = to.replace(/[^0-9]/g, '');
    const formattedJid = to.includes('@s.whatsapp.net') ? to : `${cleanNumber}@s.whatsapp.net`;

    // 2. Anti-Ban: Verify number exists on WhatsApp
    const numberCheck = await this.checkNumberOnWhatsApp(cleanNumber);
    if (!numberCheck.exists) {
      throw new Error(`Nomor ${to} tidak terdaftar di WhatsApp.`);
    }

    const targetJid = numberCheck.jid || formattedJid;

    // 3. Anti-Ban: Simulate Human Presence ('composing' / sedang mengetik...)
    let typingDuration = 0;
    if (options.simulateTyping !== false) {
      typingDuration = AntiBanUtil.calculateTypingDurationMs(text.length);
      try {
        await this.socket.presenceSubscribe(targetJid);
        await this.socket.sendPresenceUpdate('composing', targetJid);
        console.log(`⏳ Anti-Ban: Simulating 'composing' presence to ${targetJid} for ${typingDuration}ms`);
        await AntiBanUtil.sleep(typingDuration);
        await this.socket.sendPresenceUpdate('paused', targetJid);
      } catch (presenceErr) {
        console.warn('Presence simulation error (proceeding):', presenceErr);
      }
    }

    // 4. Dispatch actual message
    const res = await this.socket.sendMessage(targetJid, { text });
    return {
      ...res,
      antiBan: {
        typingDurationMs: typingDuration,
        spintaxApplied: true,
      },
    };
  }

  async handleInboundAiReply(fromJid: string, text: string, pushName: string) {
    if (!text || text.trim().length === 0) return;

    try {
      const cleanDigits = fromJid.replace(/[^0-9]/g, '');
      const phoneNumber = cleanDigits.startsWith('+') ? cleanDigits : `+${cleanDigits}`;

      // 1. Dapatkan sesi device aktif
      const session = await prisma.deviceSession.findUnique({
        where: { sessionName: 'default-session' },
      });

      // 2. Upsert kontak pelanggan di database MySQL
      let contact = await prisma.contact.findUnique({
        where: { phoneNumber },
      });

      if (!contact) {
        contact = await prisma.contact.create({
          data: {
            name: pushName || phoneNumber,
            phoneNumber,
            tags: 'Inbound Prospek',
            lastActiveAt: new Date(),
          },
        });
      } else {
        await prisma.contact.update({
          where: { id: contact.id },
          data: {
            name: contact.name.startsWith('+') && pushName ? pushName : contact.name,
            lastActiveAt: new Date(),
          },
        });
      }

      // 3. Simpan pesan masuk (INBOUND) ke tabel messages
      const inboundMsg = await prisma.message.create({
        data: {
          sessionId: session?.id || null,
          contactId: contact.id,
          direction: 'INBOUND',
          status: 'READ',
          content: text,
          timestamp: new Date(),
        },
      });

      // 4. Emit event real-time ke frontend (Chat History & Dashboard)
      if (this.io) {
        this.io.emit('whatsapp:message:inbound', {
          from: fromJid,
          text,
          contactId: contact.id,
          timestamp: new Date(),
        });
        this.io.emit('chats:new_message', {
          contactId: contact.id,
          message: inboundMsg,
        });
      }

      // 5. Periksa konfigurasi AI
      const aiSetting = await aiService.getSettings();
      if (aiSetting.humanFallback === false) {
        console.log(`⏸️ AI Auto-Reply sedang dijeda oleh pengaturan admin.`);
        return;
      }

      // 6. Generate respon cerdas dari Google Gemini AI
      console.log(`🤖 AI Sales Agent sedang menganalisis pesan dari ${phoneNumber}...`);
      const aiReply = await aiService.generateResponse(text);

      // 7. Terapkan 5-Layer Anti-Ban & Human Simulation
      // Jeda membaca pesan (1.5 - 3 detik)
      const readDelay = AntiBanUtil.getHumanJitterMs(2);
      await AntiBanUtil.sleep(readDelay);

      // Simulasi status mengetik ('composing') di WhatsApp pelanggan
      if (this.socket) {
        try {
          await this.socket.presenceSubscribe(fromJid);
          await this.socket.sendPresenceUpdate('composing', fromJid);
          const typingDuration = AntiBanUtil.calculateTypingDurationMs(aiReply.length);
          console.log(`⏳ AI Typing Presence ke ${fromJid} selama ${typingDuration}ms...`);
          await AntiBanUtil.sleep(typingDuration);
          await this.socket.sendPresenceUpdate('paused', fromJid);
        } catch (presErr) {
          console.warn('Presence simulation warning:', presErr);
        }

        // Kirim pesan balasan AI ke WhatsApp pelanggan
        await this.socket.sendMessage(fromJid, { text: aiReply });
        console.log(`🚀 [AI AUTO-REPLY TERKIRIM] ke ${phoneNumber}: "${aiReply}"`);
      }

      // 8. Simpan pesan balasan AI (OUTBOUND) ke tabel messages
      const outboundMsg = await prisma.message.create({
        data: {
          sessionId: session?.id || null,
          contactId: contact.id,
          direction: 'OUTBOUND',
          status: 'DELIVERED',
          content: aiReply,
          timestamp: new Date(),
        },
      });

      // 9. Emit event outbound ke UI Chat History
      if (this.io) {
        this.io.emit('chats:new_message', {
          contactId: contact.id,
          message: outboundMsg,
        });
      }

      // 10. Catat aktivitas ke tabel activity_logs
      await logActivity({
        actorName: 'ProSphere AI Sales Agent',
        actorEmail: 'ai-agent@prosphere.ai',
        action: 'AI_AUTO_REPLY',
        details: `Otomatis membalas pesan prospek ${contact.name} (${phoneNumber}): "${text}" -> "${aiReply.substring(0, 80)}..."`,
      });
    } catch (err: any) {
      console.error('Failed to handle inbound AI auto-reply:', err?.message || err);
    }
  }
}

export const whatsappService = new WhatsAppService();
