import { prisma } from '../../config/prisma.js';

export class FlowsService {
  async getFlows() {
    const list = await prisma.chatbotFlow.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return list.map((f) => ({
      id: f.id,
      name: f.name,
      trigger: f.trigger,
      steps: f.stepsCount,
      active: f.isActive,
      executions: `${f.executions.toLocaleString()}x`,
    }));
  }

  async createFlow(data: { name: string; trigger: string; stepsCount?: number }) {
    return prisma.chatbotFlow.create({
      data: {
        name: data.name,
        trigger: data.trigger,
        stepsCount: data.stepsCount || 3,
        isActive: true,
        executions: 0,
      },
    });
  }

  async toggleFlow(id: string) {
    const current = await prisma.chatbotFlow.findUnique({ where: { id } });
    if (!current) throw new Error('Flow not found');

    return prisma.chatbotFlow.update({
      where: { id },
      data: { isActive: !current.isActive },
    });
  }
}

export const flowsService = new FlowsService();
