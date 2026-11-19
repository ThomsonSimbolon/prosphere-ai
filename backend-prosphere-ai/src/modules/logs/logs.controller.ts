import { Request, Response } from 'express';
import { getActivityLogs } from './logs.service.js';

export const handleGetActivityLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
    const logs = await getActivityLogs(limit);
    res.status(200).json({ success: true, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
