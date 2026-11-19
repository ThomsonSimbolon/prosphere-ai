import { prisma } from '../../config/prisma.js';

export class BookingsService {
  async getBookings() {
    const list = await prisma.booking.findMany({
      orderBy: { scheduledAt: 'asc' },
    });

    return list.map((b) => ({
      id: b.id,
      client: b.clientName,
      service: b.serviceName,
      date: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(b.scheduledAt),
      time: new Intl.DateTimeFormat('id-ID', { timeStyle: 'short' }).format(b.scheduledAt) + ' WIB',
      status: b.status === 'CONFIRMED' ? 'Confirmed' : 'Pending',
      phone: b.clientPhone,
    }));
  }

  async createBooking(data: {
    clientName: string;
    clientPhone: string;
    serviceName: string;
    scheduledAt: string | Date;
    status?: string;
  }) {
    return prisma.booking.create({
      data: {
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        serviceName: data.serviceName,
        scheduledAt: new Date(data.scheduledAt),
        status: data.status || 'CONFIRMED',
      },
    });
  }
}

export const bookingsService = new BookingsService();
