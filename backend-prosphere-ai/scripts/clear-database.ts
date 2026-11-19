import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('🧹 Memulai pembersihan seluruh data seed di database MySQL prosphere_ai...');

  // Hapus data dengan urutan memperhatikan foreign key constraints
  const deletedMessages = await prisma.message.deleteMany();
  console.log(`- Deleted messages: ${deletedMessages.count}`);

  const deletedLeads = await prisma.lead.deleteMany();
  console.log(`- Deleted leads: ${deletedLeads.count}`);

  const deletedBookings = await prisma.booking.deleteMany();
  console.log(`- Deleted bookings: ${deletedBookings.count}`);

  const deletedCampaigns = await prisma.campaign.deleteMany();
  console.log(`- Deleted campaigns: ${deletedCampaigns.count}`);

  const deletedContacts = await prisma.contact.deleteMany();
  console.log(`- Deleted contacts: ${deletedContacts.count}`);

  const deletedContactGroups = await prisma.contactGroup.deleteMany();
  console.log(`- Deleted contact_groups: ${deletedContactGroups.count}`);

  const deletedTemplates = await prisma.template.deleteMany();
  console.log(`- Deleted templates: ${deletedTemplates.count}`);

  const deletedChatbotFlows = await prisma.chatbotFlow.deleteMany();
  console.log(`- Deleted chatbot_flows: ${deletedChatbotFlows.count}`);

  const deletedScheduledJobs = await prisma.scheduledJob.deleteMany();
  console.log(`- Deleted scheduled_jobs: ${deletedScheduledJobs.count}`);

  const deletedDeviceSessions = await prisma.deviceSession.deleteMany();
  console.log(`- Deleted device_sessions: ${deletedDeviceSessions.count}`);

  // Pastikan ai_settings tetap ada dengan konfigurasi default agar engine tidak crash
  await prisma.aiSetting.upsert({
    where: { id: 'default' },
    update: {
      modelName: 'gemini-3.5-flash-lite',
      temperature: 0.7,
      systemPrompt: 'Anda adalah ProSphere AI Assistant, asisten sales dan layanan pelanggan resmi yang ramah, sopan, dan persuasif.',
      humanFallback: true,
    },
    create: {
      id: 'default',
      modelName: 'gemini-3.5-flash-lite',
      temperature: 0.7,
      systemPrompt: 'Anda adalah ProSphere AI Assistant, asisten sales dan layanan pelanggan resmi yang ramah, sopan, dan persuasif.',
      humanFallback: true,
    },
  });
  console.log('- Verified default ai_settings preserved.');

  console.log('✅ Seluruh data seed berhasil dibersihkan! Database kini 100% kosong & bersih (0 rows).');
}

clearDatabase()
  .catch((err) => {
    console.error('❌ Gagal membersihkan database:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
