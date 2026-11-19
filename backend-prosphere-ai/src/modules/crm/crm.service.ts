import { prisma } from '../../config/prisma.js';

export class CrmService {
  async getPipeline() {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: { contact: true },
    });

    const columns = [
      {
        title: 'New Leads',
        key: 'NEW',
        color: 'border-primary',
        leads: leads
          .filter((l) => l.stage === 'NEW')
          .map((l) => ({
            id: l.id,
            name: l.name,
            company: l.company || '-',
            val: `Rs${Number(l.value).toLocaleString()}`,
            tag: l.source,
          })),
      },
      {
        title: 'Contacted',
        key: 'CONTACTED',
        color: 'border-secondary',
        leads: leads
          .filter((l) => l.stage === 'CONTACTED')
          .map((l) => ({
            id: l.id,
            name: l.name,
            company: l.company || '-',
            val: `Rs${Number(l.value).toLocaleString()}`,
            tag: l.source,
          })),
      },
      {
        title: 'Qualified / Demo',
        key: 'QUALIFIED',
        color: 'border-tertiary',
        leads: leads
          .filter((l) => l.stage === 'QUALIFIED')
          .map((l) => ({
            id: l.id,
            name: l.name,
            company: l.company || '-',
            val: `Rs${Number(l.value).toLocaleString()}`,
            tag: l.source,
          })),
      },
      {
        title: 'Closed Won',
        key: 'CLOSED_WON',
        color: 'border-primary-container',
        leads: leads
          .filter((l) => l.stage === 'CLOSED_WON')
          .map((l) => ({
            id: l.id,
            name: l.name,
            company: l.company || '-',
            val: `Rs${Number(l.value).toLocaleString()}`,
            tag: l.source,
          })),
      },
    ];

    return columns;
  }

  async createLead(data: {
    name: string;
    company?: string;
    stage?: string;
    value?: number;
    source?: string;
    notes?: string;
  }) {
    return prisma.lead.create({
      data: {
        name: data.name,
        company: data.company,
        stage: data.stage || 'NEW',
        value: data.value || 0.0,
        source: data.source || 'WhatsApp Inbound',
        notes: data.notes,
      },
    });
  }

  async updateStage(id: string, stage: string) {
    return prisma.lead.update({
      where: { id },
      data: { stage },
    });
  }
}

export const crmService = new CrmService();
