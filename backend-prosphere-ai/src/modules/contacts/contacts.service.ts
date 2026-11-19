import { prisma } from '../../config/prisma.js';

export class ContactsService {
  async getContacts() {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return contacts.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phoneNumber,
      tags: c.tags ? JSON.parse(c.tags) : [],
      messages: c._count.messages,
      lastActive: 'Baru saja',
    }));
  }

  async createContact(data: { name: string; phoneNumber: string; tags?: string[]; groupId?: string }) {
    return prisma.contact.create({
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        groupId: data.groupId,
      },
    });
  }

  async getGroups() {
    const groups = await prisma.contactGroup.findMany({
      include: {
        _count: {
          select: { contacts: true },
        },
      },
    });

    return groups.map((g) => ({
      id: g.id,
      name: g.name,
      desc: g.description,
      count: g._count.contacts,
      icon: 'group',
      color: 'text-primary',
    }));
  }

  async createGroup(data: { name: string; description?: string }) {
    return prisma.contactGroup.create({
      data,
    });
  }
}

export const contactsService = new ContactsService();
