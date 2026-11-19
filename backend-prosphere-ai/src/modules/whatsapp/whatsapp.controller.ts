import { Request, Response } from 'express';
import { whatsappService } from './whatsapp.service.js';
import { prisma } from '../../config/prisma.js';

export async function getDevices(req: Request, res: Response) {
  try {
    const devices = await prisma.deviceSession.findMany();
    return res.status(200).json({
      success: true,
      data: devices,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function startSession(req: Request, res: Response) {
  try {
    // Inisialisasi ulang sesi WhatsApp dengan fresh state agar Baileys membuat QR code baru
    await whatsappService.initSession(true);
    // Tunggu Baileys menghasilkan QR Code (maks 5.5 detik)
    const qrCode = await whatsappService.waitForQrCode(5500);
    const status: any = await whatsappService.getSessionStatus();
    return res.status(200).json({
      success: true,
      message: qrCode ? 'QR code generated successfully' : 'Session initialization in progress',
      data: {
        ...status,
        qrCode: qrCode || status?.qrCode || null,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function disconnectDevice(req: Request, res: Response) {
  try {
    const result = await whatsappService.disconnectSession();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function sendDirectMessage(req: Request, res: Response) {
  const { phone, message } = req.body;
  if (!phone || !message) {
    return res.status(400).json({
      success: false,
      message: 'Parameter phone and message are required',
    });
  }

  try {
    const result = await whatsappService.sendMessage(phone, message);

    // Save record to DB
    await prisma.message.create({
      data: {
        content: message,
        direction: 'OUTBOUND',
        status: 'SENT',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Message dispatched successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
