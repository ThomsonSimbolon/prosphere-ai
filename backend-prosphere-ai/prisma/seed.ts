import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ProSphere AI initial database...');

  // 1. Initial Device Session
  await prisma.deviceSession.upsert({
    where: { sessionName: 'default-session' },
    update: {},
    create: {
      sessionName: 'default-session',
      phoneNumber: '+62 812-3456-7890',
      status: 'CONNECTED',
      batteryPercentage: 94,
      lastConnectedAt: new Date(),
    },
  });

  // 2. Initial Contact Groups
  let vipGroup = await prisma.contactGroup.findFirst({ where: { name: 'VIP Buyers & High Spenders' } });
  if (!vipGroup) {
    vipGroup = await prisma.contactGroup.create({
      data: {
        name: 'VIP Buyers & High Spenders',
        description: 'Pelanggan dengan total transaksi di atas Rs5,000.',
      },
    });
  }

  let b2bGroup = await prisma.contactGroup.findFirst({ where: { name: 'Corporate & Business Leads' } });
  if (!b2bGroup) {
    b2bGroup = await prisma.contactGroup.create({
      data: {
        name: 'Corporate & Business Leads',
        description: 'Lead dari perusahaan, instansi, dan UMKM.',
      },
    });
  }

  // 3. Initial Contacts
  const contact1 = await prisma.contact.upsert({
    where: { phoneNumber: '+6281322349811' },
    update: {},
    create: {
      name: 'Dimas Wicaksono',
      phoneNumber: '+6281322349811',
      tags: JSON.stringify(['VIP', 'Hot Lead']),
      groupId: vipGroup.id,
    },
  });

  const contact2 = await prisma.contact.upsert({
    where: { phoneNumber: '+6285711223344' },
    update: {},
    create: {
      name: 'Siti Rahmawati (PT Megah Buana)',
      phoneNumber: '+6285711223344',
      tags: JSON.stringify(['Corporate', 'Active Buyer']),
      groupId: b2bGroup.id,
    },
  });

  // 4. Initial CRM Leads
  const leadCount = await prisma.lead.count();
  if (leadCount === 0) {
    await prisma.lead.createMany({
      data: [
        {
          contactId: contact1.id,
          name: 'Dimas Wicaksono',
          company: 'CV Prima Mandiri',
          stage: 'NEW',
          value: 1200.0,
          source: 'WhatsApp Inbound',
        },
        {
          contactId: contact2.id,
          name: 'Siti Rahmawati',
          company: 'PT Megah Buana',
          stage: 'QUALIFIED',
          value: 3500.0,
          source: 'AI Sales Agent',
        },
        {
          name: 'Hendra Gunawan',
          company: 'PT Logistik Cepat',
          stage: 'CONTACTED',
          value: 2500.0,
          source: 'Bulk Campaign',
        },
        {
          name: 'Zenax Solutions',
          company: 'Zenax Group',
          stage: 'CLOSED_WON',
          value: 5000.0,
          source: 'Website Form',
        },
      ],
    });
  }

  // 5. Initial Bookings
  const bookingCount = await prisma.booking.count();
  if (bookingCount === 0) {
    await prisma.booking.createMany({
      data: [
        {
          clientName: 'Budi Santoso',
          clientPhone: '+62 878-9900-1122',
          serviceName: 'Demo ProSphere AI Enterprise',
          scheduledAt: new Date(Date.now() + 2 * 86400000),
          status: 'CONFIRMED',
        },
        {
          clientName: 'Clara Devina',
          clientPhone: '+62 812-4433-2211',
          serviceName: 'Konsultasi Automasi WhatsApp',
          scheduledAt: new Date(Date.now() + 3 * 86400000),
          status: 'CONFIRMED',
        },
      ],
    });
  }

  // 6. Initial Templates
  const templateCount = await prisma.template.count();
  if (templateCount === 0) {
    await prisma.template.createMany({
      data: [
        {
          title: 'Welcome & Onboarding',
          category: 'General',
          content: 'Halo {{name}}! Selamat datang di ProSphere AI. Akun Anda telah siap digunakan.',
          usageCount: 210,
        },
        {
          title: 'Pembayaran Tagihan / Invoice',
          category: 'Finance',
          content: 'Yth. {{name}}, invoice nomor {{invoice_no}} sebesar {{amount}} telah terbit. Mohon selesaikan sebelum {{due_date}}.',
          usageCount: 150,
        },
        {
          title: 'Konfirmasi Janji Temu',
          category: 'Bookings',
          content: 'Halo {{name}}, jadwal temu Anda untuk layanan {{service}} telah dikonfirmasi pada {{datetime}}.',
          usageCount: 85,
        },
      ],
    });
  }

  // 7. Initial AI Settings
  await prisma.aiSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      modelName: 'gemini-3.5-flash-lite',
      temperature: 0.7,
      systemPrompt: 'Anda adalah ProSphere AI Assistant, asisten sales dan layanan pelanggan resmi yang ramah, sopan, dan persuasif. Tugas utama Anda adalah menyapa calon pembeli, menjawab pertanyaan seputar katalog produk, mencatat nomor pesanan, dan mengarahkan mereka untuk konfirmasi pembayaran.',
      humanFallback: true,
    },
  });

  // 8. Initial Chatbot Flows
  const flowCount = await prisma.chatbotFlow.count();
  if (flowCount === 0) {
    await prisma.chatbotFlow.createMany({
      data: [
        {
          name: 'Auto-Greeting & Intent Detection',
          trigger: 'Keyword: "Halo", "Pagi", "Info"',
          stepsCount: 4,
          isActive: true,
          executions: 1420,
        },
        {
          name: 'Automated Lead Qualification & CRM Sync',
          trigger: 'Interest detected in AI Package',
          stepsCount: 6,
          isActive: true,
          executions: 485,
        },
        {
          name: 'Instant Booking & Schedule Generator',
          trigger: 'Keyword: "Jadwal", "Booking", "Demo"',
          stepsCount: 5,
          isActive: true,
          executions: 98,
        },
        {
          name: 'FAQ & Price List Catalog Delivery',
          trigger: 'Keyword: "Harga", "Brosur", "Katalog"',
          stepsCount: 3,
          isActive: false,
          executions: 610,
        },
      ],
    });
  }

  // 9. Initial Scheduled Jobs
  const jobCount = await prisma.scheduledJob.count();
  if (jobCount === 0) {
    await prisma.scheduledJob.createMany({
      data: [
        {
          title: 'Daily Morning Follow-up Leads',
          cron: 'Setiap Hari @ 09:00 WIB',
          target: 'Group: Warm Leads (240 Kontak)',
          status: 'ACTIVE',
          nextRun: 'Besok, 09:00',
        },
        {
          title: 'Automated Invoice Payment Reminder',
          cron: 'Setiap 3 Hari',
          target: 'Filter: Unpaid Orders',
          status: 'ACTIVE',
          nextRun: '20 Nov, 10:00',
        },
        {
          title: 'Weekly Promo Broadcast: Weekend Deals',
          cron: 'Jumat @ 16:00 WIB',
          target: 'Group: All Subscribers (1,250 Kontak)',
          status: 'ACTIVE',
          nextRun: '21 Nov, 16:00',
        },
        {
          title: 'Chatbot Retargeting Inactive Contacts',
          cron: '1x per Minggu',
          target: 'Group: Inactive >30 Days',
          status: 'PAUSED',
          nextRun: 'Tertunda',
        },
      ],
    });
  }

  // 10. Initial Messages linked to Contacts for Chat History
  const msgCount = await prisma.message.count();
  if (msgCount === 0) {
    await prisma.message.create({
      data: {
        contactId: contact1.id,
        direction: 'INBOUND',
        content: 'Halo kak, apakah paket AI ProSphere bisa custom flow WhatsApp?',
        status: 'DELIVERED',
      },
    });
    await prisma.message.create({
      data: {
        contactId: contact1.id,
        direction: 'OUTBOUND',
        content: 'Halo kak Dimas! Tentu saja, ProSphere AI mendukung visual drag-and-drop flow builder dan integrasi LLM Gemini kustom.',
        status: 'READ',
      },
    });
    await prisma.message.create({
      data: {
        contactId: contact2.id,
        direction: 'INBOUND',
        content: 'Invoice pesanan #ORD-8812 sudah kami transfer ya',
        status: 'DELIVERED',
      },
    });
    await prisma.message.create({
      data: {
        contactId: contact2.id,
        direction: 'OUTBOUND',
        content: 'Terima kasih Bu Siti! Pembayaran telah diverifikasi oleh sistem. Tim kami sedang menyiapkan konfigurasi server.',
        status: 'READ',
      },
    });
  }

  console.log('✅ ProSphere AI database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
