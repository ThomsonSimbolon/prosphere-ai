import { prisma } from '../../config/prisma.js';

export class TemplatesService {
  async getTemplates() {
    const list = await prisma.template.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return list.map((t) => ({
      id: t.id,
      title: t.title,
      category: t.category,
      text: t.content,
      usage: `${t.usageCount}x`,
    }));
  }

  async createTemplate(data: { title: string; category?: string; content: string }) {
    return prisma.template.create({
      data: {
        title: data.title,
        category: data.category || 'General',
        content: data.content,
      },
    });
  }
}

export const templatesService = new TemplatesService();
