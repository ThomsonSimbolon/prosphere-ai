import { Request, Response } from 'express';
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from './users.service.js';

export const handleGetStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await getAllStaff();
    res.status(200).json({ success: true, data: staff });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const handleCreateStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      res.status(400).json({ success: false, message: 'Semua field (name, email, password, role) wajib diisi.' });
      return;
    }

    const admin = (req as any).user;
    const staff = await createStaff({ name, email, password, role }, admin);
    res.status(201).json({ success: true, message: 'Staf berhasil ditambahkan.', data: staff });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const handleUpdateStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const admin = (req as any).user;
    const updated = await updateStaff(id, req.body, admin);
    res.status(200).json({ success: true, message: 'Data staf berhasil diperbarui.', data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const handleDeleteStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const admin = (req as any).user;
    await deleteStaff(id, admin);
    res.status(200).json({ success: true, message: 'Staf berhasil dihapus.' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
