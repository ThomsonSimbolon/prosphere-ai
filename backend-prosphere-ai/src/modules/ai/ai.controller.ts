import { Request, Response } from 'express';
import { aiService } from './ai.service.js';

export async function getAiSettings(req: Request, res: Response) {
  try {
    const settings = await aiService.getSettings();
    return res.status(200).json({ success: true, data: settings });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateAiSettings(req: Request, res: Response) {
  try {
    const updated = await aiService.updateSettings(req.body);
    return res.status(200).json({
      success: true,
      message: 'AI settings updated successfully',
      data: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function simulateChat(req: Request, res: Response) {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  try {
    const response = await aiService.generateResponse(message);
    return res.status(200).json({
      success: true,
      data: {
        userMessage: message,
        aiResponse: response,
        timestamp: new Date(),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
