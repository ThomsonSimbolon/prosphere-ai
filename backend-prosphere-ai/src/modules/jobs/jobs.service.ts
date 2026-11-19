import { prisma } from '../../config/prisma.js';

export class JobsService {
  async getJobs() {
    const jobs = await prisma.scheduledJob.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return jobs.map((j) => ({
      id: j.id,
      title: j.title,
      cron: j.cron,
      target: j.target,
      status: j.status === 'ACTIVE' ? 'Active' : 'Paused',
      nextRun: j.nextRun || 'Segera',
    }));
  }

  async createJob(data: { title: string; cron: string; target: string }) {
    return prisma.scheduledJob.create({
      data: {
        title: data.title,
        cron: data.cron,
        target: data.target,
        status: 'ACTIVE',
        nextRun: 'Besok, 09:00',
      },
    });
  }

  async toggleJob(id: string) {
    const job = await prisma.scheduledJob.findUnique({ where: { id } });
    if (!job) throw new Error('Job not found');

    const newStatus = job.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    return prisma.scheduledJob.update({
      where: { id },
      data: { status: newStatus },
    });
  }
}

export const jobsService = new JobsService();
