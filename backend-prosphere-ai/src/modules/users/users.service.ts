import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { logActivity } from '../logs/logs.service.js';

export interface CreateStaffDto {
  name: string;
  email: string;
  password: string;
  role: 'SUPER_ADMIN' | 'STAFF_SALES_CS' | 'STAFF_MARKETING';
}

export interface UpdateStaffDto {
  name?: string;
  email?: string;
  password?: string;
  role?: 'SUPER_ADMIN' | 'STAFF_SALES_CS' | 'STAFF_MARKETING';
  status?: 'ACTIVE' | 'INACTIVE';
}

export const getAllStaff = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const createStaff = async (dto: CreateStaffDto, adminUser: { id: string; name: string; email: string }) => {
  const existing = await prisma.user.findUnique({
    where: { email: dto.email.toLowerCase().trim() },
  });

  if (existing) {
    throw new Error('Email sudah terdaftar dalam sistem.');
  }

  const passwordHash = await bcrypt.hash(dto.password, 10);
  const newUser = await prisma.user.create({
    data: {
      name: dto.name,
      email: dto.email.toLowerCase().trim(),
      passwordHash,
      role: dto.role,
      status: 'ACTIVE',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  await logActivity({
    userId: adminUser.id,
    actorName: adminUser.name,
    actorEmail: adminUser.email,
    action: 'USER_CREATE',
    details: `Menambahkan staf baru: ${newUser.name} (${newUser.email}) dengan role ${newUser.role}`,
  });

  return newUser;
};

export const updateStaff = async (
  id: string,
  dto: UpdateStaffDto,
  adminUser: { id: string; name: string; email: string }
) => {
  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) {
    throw new Error('Pengguna tidak ditemukan.');
  }

  // Proteksi: Jika user adalah SUPER_ADMIN dan mencoba mengubah role menjadi non-admin, pastikan masih ada Super Admin lain yang aktif
  if (targetUser.role === 'SUPER_ADMIN' && dto.role && dto.role !== 'SUPER_ADMIN') {
    const activeSuperAdmins = await prisma.user.count({
      where: { role: 'SUPER_ADMIN', status: 'ACTIVE', id: { not: id } },
    });
    if (activeSuperAdmins === 0) {
      throw new Error('Tidak dapat mengubah role Super Admin terakhir. Harus ada setidaknya satu Super Admin aktif.');
    }
  }

  // Proteksi jika mencoba menonaktifkan Super Admin terakhir
  if (targetUser.role === 'SUPER_ADMIN' && dto.status === 'INACTIVE') {
    const activeSuperAdmins = await prisma.user.count({
      where: { role: 'SUPER_ADMIN', status: 'ACTIVE', id: { not: id } },
    });
    if (activeSuperAdmins === 0) {
      throw new Error('Tidak dapat menonaktifkan Super Admin terakhir.');
    }
  }

  const updateData: any = {};
  if (dto.name) updateData.name = dto.name;
  if (dto.email) updateData.email = dto.email.toLowerCase().trim();
  if (dto.role) updateData.role = dto.role;
  if (dto.status) updateData.status = dto.status;
  if (dto.password && dto.password.trim().length >= 6) {
    updateData.passwordHash = await bcrypt.hash(dto.password, 10);
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });

  await logActivity({
    userId: adminUser.id,
    actorName: adminUser.name,
    actorEmail: adminUser.email,
    action: 'USER_UPDATE',
    details: `Memperbarui data staf ${updated.name}: ${JSON.stringify(dto)}`,
  });

  return updated;
};

export const deleteStaff = async (id: string, adminUser: { id: string; name: string; email: string }) => {
  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) {
    throw new Error('Pengguna tidak ditemukan.');
  }

  if (targetUser.role === 'SUPER_ADMIN') {
    const activeSuperAdmins = await prisma.user.count({
      where: { role: 'SUPER_ADMIN', status: 'ACTIVE', id: { not: id } },
    });
    if (activeSuperAdmins === 0) {
      throw new Error('Tidak dapat menghapus Super Admin terakhir.');
    }
  }

  await prisma.user.delete({ where: { id } });

  await logActivity({
    userId: adminUser.id,
    actorName: adminUser.name,
    actorEmail: adminUser.email,
    action: 'USER_DELETE',
    details: `Menghapus staf: ${targetUser.name} (${targetUser.email})`,
  });

  return { success: true };
};
