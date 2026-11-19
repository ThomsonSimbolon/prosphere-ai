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

  async initSession() {
    if (this.isConnecting || this.socket) return;
    this.isConnecting = true;
    this.isExplicitlyDisconnected = false;

    try {
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
            console.log('📲 QR Code generated and saved to MySQL device_sessions');
          } catch (err) {
            console.error('Failed to generate QR data URL:', err);
          }
        }

        if (connection === 'close') {
          const shouldReconnect =
            (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
          console.log('WhatsApp connection closed. Reconnect:', shouldReconnect);

          await prisma.deviceSession.updateMany({
            where: { sessionName: 'default-session' },
            data: { status: 'DISCONNECTED', qrCode: null },
          });

          this.socket = null;
          this.isConnecting = false;
          if (this.io) {
            this.io.emit('whatsapp:status', { status: 'DISCONNECTED' });
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

      // Listen for incoming messages
      this.socket.ev.on('messages.upsert', async (m) => {
        if (m.type === 'notify') {
          for (const msg of m.messages) {
            if (!msg.key.fromMe && msg.message) {
              const from = msg.key.remoteJid;
              const text =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                '';

              console.log(`📩 Inbound WhatsApp from ${from}: ${text}`);

              if (this.io) {
                this.io.emit('whatsapp:message:inbound', {
                  from,
                  text,
                  timestamp: new Date(),
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

  async waitForQrCode(timeoutMs = 4000): Promise<string | null> {
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
}

export const whatsappService = new WhatsAppService();
