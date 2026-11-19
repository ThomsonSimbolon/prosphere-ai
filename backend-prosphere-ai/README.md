# ProSphere AI - Backend Architecture (`backend-prosphere-ai`)

Backend enterprise untuk platform **ProSphere AI** yang menangani **WhatsApp Multi-Device Gateway**, **Autonomous AI Sales Agent (Google Gemini)**, **Live Telemetry Dashboard**, **CRM Sales Pipeline**, dan **Antrean Siaran Pesan Massal (Anti-Ban)**.

Dibangun menggunakan **Node.js + TypeScript**, **Express**, **Prisma ORM**, **MySQL (Laragon)**, **Baileys**, dan **Socket.io**.

---

## 📁 Struktur Direktori Modular

```
backend-prosphere-ai/
├── prisma/
│   ├── schema.prisma                  # Skema database MySQL (Models, Relations, Indexes)
│   └── seed.ts                        # Seeder data awal untuk demonstrasi
│
├── src/
│   ├── config/                        # Konfigurasi Lingkungan Terpusat
│   │   ├── env.ts                     # Variabel .env (PORT: 8000, DB, API Keys)
│   │   └── prisma.ts                  # Koneksi client Prisma terkelola
│   │
│   ├── modules/                       # Modul Fitur Independen (Mudah Maintenance)
│   │   ├── analytics/                 # Agregasi metrik KPI & grafik 7 hari dashboard
│   │   ├── whatsapp/                  # Gateway Baileys multi-device & event socket
│   │   ├── ai/                        # Integrasi Google Gemini & simulasi percakapan
│   │   ├── crm/                       # Leads & pipeline penjualan Kanban
│   │   ├── contacts/                  # Buku kontak & segmentasi grup
│   │   ├── bookings/                  # Penjadwalan janji temu otomatis
│   │   ├── templates/                 # Preset template pesan cepat
│   │   └── broadcast/                 # Kampanye siaran massal dengan jeda anti-ban
│   │
│   ├── routes/                        # Central Router penyatu endpoint di /api
│   ├── app.ts                         # Konfigurasi Express, CORS, & Middleware
│   └── server.ts                      # Bootstrap server HTTP & Socket.io pada port 8000
│
├── .env                               # Kredensial lokal (MySQL Laragon, Port 8000)
└── tsconfig.json                      # Konfigurasi TypeScript NodeNext
```

---

## 🚀 Cara Menjalankan Backend

### 1. Masuk ke direktori backend
```bash
cd backend-prosphere-ai
```

### 2. Jalankan Mode Development (Port 8000)
```bash
npm run dev
```
Server akan aktif di:
- **API URL:** `http://localhost:8000`
- **Health Check:** `http://localhost:8000/api/health`
- **WebSocket Gateway:** `ws://localhost:8000`

### 3. Perintah Database (Prisma + MySQL Laragon)
```bash
# Sinkronisasi skema ke MySQL
npm run db:push

# Mengisi data awal (seed)
npm run db:seed

# Membuka Prisma Studio (GUI Database di Browser)
npm run db:studio
```

---

## 📡 Daftar Endpoint API Utama

| Modul | Method | Endpoint | Deskripsi |
|---|---|---|---|
| **Health** | `GET` | `/api/health` | Status kesehatan server |
| **Analytics** | `GET` | `/api/analytics/dashboard` | Data KPI, grafik mingguan, & summary status |
| **WhatsApp** | `GET` | `/api/whatsapp/devices` | Daftar sesi WhatsApp & status online |
| **WhatsApp** | `POST` | `/api/whatsapp/session/start`| Inisiasi koneksi socket Baileys & emit QR Code |
| **WhatsApp** | `POST` | `/api/whatsapp/send` | Kirim pesan instan langsung ke nomor tujuan |
| **AI Agent** | `GET` | `/api/ai/settings` | Pengaturan model & system prompt persona |
| **AI Agent** | `POST` | `/api/ai/simulate` | Simulator respons otomatis AI untuk testing |
| **CRM** | `GET` | `/api/crm/pipeline` | Data kolom Kanban (New, Contacted, Won) |
| **CRM** | `POST` | `/api/crm/leads` | Tambah lead baru ke database |
| **Contacts** | `GET` | `/api/contacts` | Daftar kontak & tag kategori |
| **Contacts** | `GET` | `/api/contacts/groups` | Daftar grup segmentasi kontak |
| **Bookings** | `GET` | `/api/bookings` | Daftar janji temu terkonfirmasi |
| **Templates** | `GET` | `/api/templates` | Daftar template pesan cepat |
| **Broadcast** | `POST` | `/api/broadcast/campaigns` | Trigger kampanye siaran pesan massal |

---

## 💡 Panduan Maintenance Bagi Developer

1. **Menambah Fitur / Modul Baru:**
   - Buat sub-folder di `src/modules/[nama-modul]/`.
   - Buat file `service.ts` untuk logika bisnis dan `controller.ts` untuk HTTP handler.
   - Daftarkan endpoint-nya di `src/routes/index.ts`.
2. **Menambah Tabel Database:**
   - Buka `prisma/schema.prisma` dan tambahkan model baru.
   - Jalankan `npm run db:push` untuk sinkronisasi otomatis ke MySQL Laragon tanpa SQL manual.
