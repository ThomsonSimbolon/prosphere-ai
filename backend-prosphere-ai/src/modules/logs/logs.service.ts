import { prisma } from '../../config/prisma.js';

export interface CreateLogParams {
  userId?: string | null;
  actorName: string;
  actorEmail: string;
  action: string;
  details?: string;
  ipAddress?: string;
}

export const logActivity = async (params: CreateLogParams) => {
  try {
    return await prisma.activityLog.create({
      data: {
        userId: params.userId || null,
        actorName: params.actorName,
        actorEmail: params.actorEmail,
        action: params.action,
        details: params.details || null,
        ipAddress: params.ipAddress || null,
      },
    });
  } catch (err) {
    console.error('Failed to write activity log:', err);
    return null;
  }
};

export const getActivityLogs = async (limit = 100) => {
  return await prisma.activityLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, name: true, role: true, email: true },
      },
    },
  });
};
