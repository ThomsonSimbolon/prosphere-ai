import { Request, Response } from 'express';
import { loginUser, getUserById } from './auth.service.js';
import { logActivity } from '../logs/logs.service.js';

export const handleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
      return;
    }

    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
    const result = await loginUser(email, password, ipAddress);

    res.status(200).json({
      success: true,
      message: 'Login berhasil.',
      data: result,
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.message || 'Login gagal.',
    });
  }
};

export const handleGetCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser.id) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const user = await getUserById(authUser.id);
    if (!user || user.status !== 'ACTIVE') {
      res.status(401).json({ success: false, message: 'Akun tidak aktif atau tidak ditemukan.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const handleLogout = async (req: Request, res: Response): Promise<void> => {
  try {
    const authUser = (req as any).user;
    if (authUser) {
      await logActivity({
        userId: authUser.id,
        actorName: authUser.name,
        actorEmail: authUser.email,
        action: 'LOGOUT',
        details: 'User melakukan logout.',
      });
    }
    res.status(200).json({ success: true, message: 'Logout berhasil.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
