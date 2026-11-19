import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { logActivity } from '../modules/logs/logs.service.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'STAFF_SALES_CS' | 'STAFF_MARKETING';
  status: 'ACTIVE' | 'INACTIVE';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token otentikasi tidak ditemukan.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;

    // Verifikasi real-time ke database untuk memastikan akun belum dinonaktifkan atau diubah role-nya
    const liveUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    if (!liveUser) {
      res.status(401).json({
        success: false,
        message: 'Pengguna tidak ditemukan atau telah dihapus.',
      });
      return;
    }

    if (liveUser.status !== 'ACTIVE') {
      res.status(403).json({
        success: false,
        message: 'Akun Anda telah dinonaktifkan oleh Administrator.',
      });
      return;
    }

    req.user = liveUser as AuthenticatedUser;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: 'Sesi kedaluwarsa atau token tidak valid. Silakan login kembali.',
    });
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Otentikasi diperlukan.',
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';

      // Catat ke log percobaan akses tanpa izin
      await logActivity({
        userId: user.id,
        actorName: user.name,
        actorEmail: user.email,
        action: 'ACCESS_DENIED',
        details: `Percobaan akses terlarang ke [${req.method}] ${req.originalUrl} dengan role ${user.role}. Diperlukan salah satu dari: [${allowedRoles.join(', ')}].`,
        ipAddress,
      });

      res.status(403).json({
        success: false,
        message: 'Akses ditolak (403 Forbidden). Anda tidak memiliki wewenang untuk fitur ini.',
        requiredRoles: allowedRoles,
        currentRole: user.role,
      });
      return;
    }

    next();
  };
};
