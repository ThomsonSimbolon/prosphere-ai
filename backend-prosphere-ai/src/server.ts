import http from 'http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { ENV } from './config/env.js';
import { connectDatabase } from './config/prisma.js';
import { whatsappService } from './modules/whatsapp/whatsapp.service.js';

async function bootstrap() {
  // 1. Connect to MySQL Database via Prisma
  await connectDatabase();

  // 2. Initialize Express Application
  const app = createApp();
  const server = http.createServer(app);

  // 3. Attach Socket.io WebSockets for Real-time WhatsApp Events
  const io = new Server(server, {
    cors: {
      origin: [ENV.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`⚡ WebSocket client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`🔌 WebSocket client disconnected: ${socket.id}`);
    });
  });

  // Inject Socket.io into WhatsApp Gateway
  whatsappService.setSocketServer(io);

  // 4. Start Server Listener on configured port (8000)
  server.listen(ENV.PORT, () => {
    console.log(`
=====================================================
🚀 ProSphere AI Enterprise Backend is RUNNING!
📡 HTTP & WebSocket Port : http://localhost:${ENV.PORT}
📊 API Health Check       : http://localhost:${ENV.PORT}/api/health
🌐 Connected Database    : MySQL (Laragon @ 3306)
🎯 Frontend Origin       : ${ENV.FRONTEND_URL}
=====================================================
    `);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal Bootstrap Error:', err);
  process.exit(1);
});
