import { Request, Response } from 'express';
import { broadcastService } from './broadcast.service.js';

export async function getCampaigns(req: Request, res: Response) {
  try {
    const list = await broadcastService.getCampaigns();
    return res.status(200).json({ success: true, data: list });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createCampaign(req: Request, res: Response) {
  try {
    const created = await broadcastService.createCampaign(req.body);
    return res.status(201).json({
      success: true,
      message: 'Broadcast campaign initiated with anti-ban delay',
      data: created,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
