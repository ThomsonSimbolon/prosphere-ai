import { Request, Response } from 'express';
import { jobsService } from './jobs.service.js';

export async function getJobs(req: Request, res: Response) {
  try {
    const jobs = await jobsService.getJobs();
    return res.status(200).json({ success: true, data: jobs });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createJob(req: Request, res: Response) {
  try {
    const job = await jobsService.createJob(req.body);
    return res.status(201).json({ success: true, data: job });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function toggleJob(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const updated = await jobsService.toggleJob(id);
    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
