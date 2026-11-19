import { Request, Response } from 'express';
import { crmService } from './crm.service.js';

export async function getPipeline(req: Request, res: Response) {
  try {
    const pipeline = await crmService.getPipeline();
    return res.status(200).json({ success: true, data: pipeline });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createLead(req: Request, res: Response) {
  try {
    const lead = await crmService.createLead(req.body);
    return res.status(201).json({ success: true, data: lead });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateLeadStage(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { stage } = req.body;
    const updated = await crmService.updateStage(id, stage);
    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
