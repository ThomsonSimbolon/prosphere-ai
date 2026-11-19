import { Request, Response } from 'express';
import { contactsService } from './contacts.service.js';

export async function getContacts(req: Request, res: Response) {
  try {
    const list = await contactsService.getContacts();
    return res.status(200).json({ success: true, data: list });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createContact(req: Request, res: Response) {
  try {
    const contact = await contactsService.createContact(req.body);
    return res.status(201).json({ success: true, data: contact });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getGroups(req: Request, res: Response) {
  try {
    const groups = await contactsService.getGroups();
    return res.status(200).json({ success: true, data: groups });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createGroup(req: Request, res: Response) {
  try {
    const group = await contactsService.createGroup(req.body);
    return res.status(201).json({ success: true, data: group });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
