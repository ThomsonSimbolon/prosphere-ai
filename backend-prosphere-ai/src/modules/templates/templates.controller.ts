import { Request, Response } from 'express';
import { templatesService } from './templates.service.js';

export async function getTemplates(req: Request, res: Response) {
  try {
    const list = await templatesService.getTemplates();
    return res.status(200).json({ success: true, data: list });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createTemplate(req: Request, res: Response) {
  try {
    const created = await templatesService.createTemplate(req.body);
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
