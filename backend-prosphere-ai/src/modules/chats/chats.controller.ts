import { Request, Response } from 'express';
import { chatsService } from './chats.service.js';

export async function getChatThreads(req: Request, res: Response) {
  try {
    const threads = await chatsService.getChatThreads();
    return res.status(200).json({ success: true, data: threads });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getContactMessages(req: Request, res: Response) {
  try {
    const contactId = req.params.contactId as string;
    const messages = await chatsService.getMessagesByContact(contactId);
    return res.status(200).json({ success: true, data: messages });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function sendChatMessage(req: Request, res: Response) {
  try {
    const contactId = req.params.contactId as string;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const message = await chatsService.sendReply(contactId, content);
    return res.status(201).json({ success: true, data: message });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
