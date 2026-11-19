import { Request, Response } from 'express';
import { bookingsService } from './bookings.service.js';

export async function getBookings(req: Request, res: Response) {
  try {
    const list = await bookingsService.getBookings();
    return res.status(200).json({ success: true, data: list });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createBooking(req: Request, res: Response) {
  try {
    const created = await bookingsService.createBooking(req.body);
    return res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
