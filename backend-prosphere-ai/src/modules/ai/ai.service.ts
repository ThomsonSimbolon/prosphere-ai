import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../../config/prisma.js';
import { ENV } from '../../config/env.js';

export class AiService {
  private getClient(): GoogleGenerativeAI | null {
    const key = process.env.GEMINI_API_KEY || ENV.GEMINI_API_KEY;
    if (key) {
      return new GoogleGenerativeAI(key);
    }
    return null;
  }

  async getSettings() {
    const setting = await prisma.aiSetting.findUnique({
      where: { id: 'default' },
    });
    return (
      setting || {
        id: 'default',
        modelName: 'gemini-3.5-flash-lite',
        temperature: 0.7,
        systemPrompt:
          'Anda adalah ProSphere AI Assistant, asisten sales dan layanan pelanggan resmi yang ramah, sopan, dan persuasif.',
        humanFallback: true,
      }
    );
  }

  async updateSettings(data: {
    modelName?: string;
    temperature?: number;
    systemPrompt?: string;
    humanFallback?: boolean;
  }) {
    return prisma.aiSetting.upsert({
      where: { id: 'default' },
      update: data,
      create: {
        id: 'default',
        modelName: data.modelName || 'gemini-3.5-flash-lite',
        temperature: data.temperature || 0.7,
        systemPrompt: data.systemPrompt || 'Anda adalah ProSphere AI Assistant.',
        humanFallback: data.humanFallback ?? true,
      },
    });
  }

  async generateResponse(customerMessage: string): Promise<string> {
    const setting = await this.getSettings();
    const genAI = this.getClient();
    const prompt = `${setting.systemPrompt}\n\nPesan dari calon pelanggan: "${customerMessage}"\n\nJawablah dengan sopan, persuasif, ringkas, dan tawarkan solusi atau aksi lanjutan:`;

    // 1. Try Live Gemini API with Target Model
    if (genAI) {
      try {
        const targetModel = setting.modelName || 'gemini-3.5-flash-lite';
        const model = genAI.getGenerativeModel({
          model: targetModel,
          generationConfig: {
            temperature: setting.temperature,
          },
        });

        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (err: any) {
        console.warn(`Gemini API call with ${setting.modelName} encountered an error:`, err?.message || err);

        // 2. Fallback to gemini-3.5-flash-lite if configured model had issues
        try {
          console.log('Attempting fallback with gemini-3.5-flash-lite...');
          const fallbackModel = genAI.getGenerativeModel({
            model: 'gemini-3.5-flash-lite',
            generationConfig: {
              temperature: setting.temperature,
            },
          });
          const result = await fallbackModel.generateContent(prompt);
          return result.response.text();
        } catch (fallbackErr: any) {
          console.warn('Gemini fallback attempt failed, using intelligent local heuristic fallback:', fallbackErr?.message || fallbackErr);
        }
      }
    }

    // 3. Intelligent local heuristic fallback
    const lower = customerMessage.toLowerCase();
    if (lower.includes('harga') || lower.includes('paket') || lower.includes('diskon')) {
      return `Halo Kak! Paket ProSphere AI mulai dari Rp299.000/bulan (Starter) hingga Rp699.000/bulan (Growth Pro). Untuk paket tahunan saat ini tersedia promo diskon hemat 25%! Boleh kami buatkan faktur demonya?`;
    }
    if (lower.includes('jadwal') || lower.includes('booking') || lower.includes('demo')) {
      return `Tentu Kak! Kami menyediakan sesi demo privat via Google Meet atau WhatsApp. Apakah Kakak berkenan di hari kerja jam 10:00 atau jam 14:00 WIB?`;
    }
    if (lower.includes('halo') || lower.includes('pagi') || lower.includes('siang')) {
      return `Halo! Terima kasih telah menghubungi ProSphere AI. Ada yang bisa kami bantu seputar otomatisasi WhatsApp dan sales closing bisnis Anda hari ini?`;
    }

    return `Terima kasih atas pertanyaannya! Pesan Kakak "${customerMessage}" telah kami terima. Tim ProSphere AI kami siap membantu kebutuhan bisnis Kakak.`;
  }
}

export const aiService = new AiService();
