import { Request, Response } from 'express';
import { flowsService } from './flows.service.js';

export async function getFlows(req: Request, res: Response) {
  try {
    const flows = await flowsService.getFlows();
    return res.status(200).json({ success: true, data: flows });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createFlow(req: Request, res: Response) {
  try {
    const flow = await flowsService.createFlow(req.body);
    return res.status(201).json({ success: true, data: flow });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function toggleFlow(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const updated = await flowsService.toggleFlow(id);
    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
