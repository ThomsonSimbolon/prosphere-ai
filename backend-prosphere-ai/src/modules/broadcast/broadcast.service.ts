import { prisma } from '../../config/prisma.js';
import { whatsappService } from '../whatsapp/whatsapp.service.js';
import { AntiBanUtil } from '../whatsapp/antiban.util.js';

export class BroadcastService {
  async getCampaigns() {
    return prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCampaign(data: {
    title: string;
    targetGroup: string;
    delaySeconds?: number;
    messageText: string;
  }) {
    // 1. Fetch target contacts from database
    let contacts = await prisma.contact.findMany({
      where: data.targetGroup && data.targetGroup !== 'Semua Kontak'
        ? { group: { name: data.targetGroup } }
        : {},
    });

    if (contacts.length === 0) {
      contacts = await prisma.contact.findMany({ take: 50 });
    }

    const totalTarget = contacts.length;

    // 2. Save campaign record
    const campaign = await prisma.campaign.create({
      data: {
        title: data.title,
        targetGroup: data.targetGroup,
        delaySeconds: data.delaySeconds || 5,
        messageText: data.messageText,
        status: totalTarget > 0 ? 'RUNNING' : 'COMPLETED',
        totalTarget: totalTarget,
        sentCount: 0,
        failedCount: 0,
      },
    });

    // 3. Trigger asynchronous background dispatch with Anti-Ban queue
    if (totalTarget > 0) {
      this.processCampaignQueue(campaign.id, contacts, data.messageText, data.delaySeconds || 5);
    }

    return campaign;
  }

  private async processCampaignQueue(
    campaignId: string,
    contacts: Array<{ id: string; name: string; phoneNumber: string }>,
    rawText: string,
    baseDelaySec: number
  ) {
    console.log(`🚀 [ANTI-BAN BROADCAST] Starting campaign ${campaignId} for ${contacts.length} recipients.`);
    let sentCount = 0;
    let failedCount = 0;
    const BATCH_SIZE = 25; // Cooldown every 25 messages
    const COOLDOWN_MS = 60000; // 1 minute cooldown

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];

      try {
        // Anti-Ban Layer 1: Batch Cooldown
        if (i > 0 && i % BATCH_SIZE === 0) {
          console.log(`⏸️ [ANTI-BAN COOLDOWN] Pausing campaign for ${COOLDOWN_MS / 1000}s after batch ${i}...`);
          await AntiBanUtil.sleep(COOLDOWN_MS);
        }

        // Anti-Ban Layer 2: Dynamic Random Gaussian Jitter
        const jitterMs = AntiBanUtil.getHumanJitterMs(baseDelaySec, 1000, 4000);
        console.log(`⏳ [ANTI-BAN JITTER] Waiting ${jitterMs}ms before dispatching to ${contact.name}...`);
        await AntiBanUtil.sleep(jitterMs);

        // Anti-Ban Layer 3: Dynamic Variable Replacement & Spintax
        const personalized = AntiBanUtil.replaceVariables(rawText, {
          name: contact.name,
          phone: contact.phoneNumber,
        });

        // Anti-Ban Layer 4: Dispatch with Typing Presence ('composing' simulation)
        await whatsappService.sendMessage(contact.phoneNumber, personalized, {
          simulateTyping: true,
          parseSpintax: true,
        });

        sentCount++;
      } catch (err: any) {
        console.error(`❌ [BROADCAST ERROR] Failed to send to ${contact.phoneNumber}:`, err.message);
        failedCount++;
      }

      // Update progress in database every 5 messages or at end
      if (sentCount % 5 === 0 || i === contacts.length - 1) {
        await prisma.campaign.update({
          where: { id: campaignId },
          data: {
            sentCount,
            failedCount,
            status: i === contacts.length - 1 ? 'COMPLETED' : 'RUNNING',
          },
        });
      }
    }

    console.log(`🏁 [ANTI-BAN BROADCAST] Campaign ${campaignId} finished. Sent: ${sentCount}, Failed: ${failedCount}`);
  }
}

export const broadcastService = new BroadcastService();
