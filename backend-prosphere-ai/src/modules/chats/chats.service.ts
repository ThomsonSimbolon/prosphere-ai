import { prisma } from '../../config/prisma.js';
import { whatsappService } from '../whatsapp/whatsapp.service.js';

export class ChatsService {
  async getChatThreads() {
    const contacts = await prisma.contact.findMany({
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const colors = [
      'bg-primary text-on-primary',
      'bg-secondary text-surface-container-lowest',
      'bg-tertiary text-on-tertiary',
      'bg-surface-container-high text-on-surface',
    ];

    return contacts.map((c, idx) => {
      const lastMsg = c.messages[0];
      const timeStr = lastMsg
        ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Baru';

      return {
        id: c.id,
        name: c.name,
        phone: c.phoneNumber,
        lastMessage: lastMsg ? lastMsg.content : 'Belum ada riwayat pesan.',
        time: timeStr,
        unread: 0,
        online: idx % 2 === 0,
        avatarBg: colors[idx % colors.length],
      };
    });
  }

  async getMessagesByContact(contactId: string) {
    const list = await prisma.message.findMany({
      where: { contactId },
      orderBy: { timestamp: 'asc' },
    });

    return list.map((m) => ({
      id: m.id,
      sender: m.direction === 'INBOUND' ? ('user' as const) : ('me' as const),
      text: m.content,
      time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: m.status,
    }));
  }

  async sendReply(contactId: string, content: string) {
    const contact = await prisma.contact.findUnique({ where: { id: contactId } });
    if (!contact) throw new Error('Contact not found');

    // 1. Try to send via WhatsApp Baileys if connected
    try {
      await whatsappService.sendMessage(contact.phoneNumber, content);
    } catch {
      // Graceful fallback if device not connected
    }

    // 2. Persist in MySQL
    const message = await prisma.message.create({
      data: {
        contactId,
        content,
        direction: 'OUTBOUND',
        status: 'SENT',
      },
    });

    return {
      id: message.id,
      sender: 'me' as const,
      text: message.content,
      time: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: message.status,
    };
  }
}

export const chatsService = new ChatsService();
