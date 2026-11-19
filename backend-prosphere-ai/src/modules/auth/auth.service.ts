import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.js';
import { ENV } from '../../config/env.js';
import { logActivity } from '../logs/logs.service.js';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'STAFF_SALES_CS' | 'STAFF_MARKETING';
  status: 'ACTIVE' | 'INACTIVE';
}

export const seedSuperAdmin = async () => {
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      const passwordHash = await bcrypt.hash('admin123456', 10);
      const admin = await prisma.user.create({
        data: {
          name: 'Super Admin',
          email: 'admin@prosphere.ai',
          passwordHash,
          role: 'SUPER_ADMIN',
          status: 'ACTIVE',
        },
      });
      console.log('✅ Default Super Admin seeded successfully: admin@prosphere.ai / admin123456');

      await logActivity({
        userId: admin.id,
        actorName: admin.name,
        actorEmail: admin.email,
        action: 'SYSTEM_BOOTSTRAP',
        details: 'Initial Super Admin account created automatically.',
      });
    }
  } catch (err) {
    console.error('Error seeding default super admin:', err);
  }
};

export const loginUser = async (email: string, passwordPlain: string, ipAddress?: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    throw new Error('Email atau password salah.');
  }

  if (user.status !== 'ACTIVE') {
    await logActivity({
      userId: user.id,
      actorName: user.name,
      actorEmail: user.email,
      action: 'LOGIN_BLOCKED',
      details: 'Percobaan login ke akun yang dinonaktifkan.',
      ipAddress,
    });
    throw new Error('Akun Anda dinonaktifkan oleh Administrator.');
  }

  const isPasswordValid = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!isPasswordValid) {
    await logActivity({
      userId: user.id,
      actorName: user.name,
      actorEmail: user.email,
      action: 'LOGIN_FAILED',
      details: 'Password tidak cocok.',
      ipAddress,
    });
    throw new Error('Email atau password salah.');
  }

  // Generate JWT token (expired dalam 7 hari)
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    ENV.JWT_SECRET,
    { expiresIn: '7d' }
  );

  await logActivity({
    userId: user.id,
    actorName: user.name,
    actorEmail: user.email,
    action: 'LOGIN_SUCCESS',
    details: `Login berhasil sebagai role ${user.role}`,
    ipAddress,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    token,
  };
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
};
