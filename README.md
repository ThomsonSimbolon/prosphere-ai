# ⚡ ProSphere AI — Enterprise WhatsApp Automation, CRM & AI Sales Agent Platform

![ProSphere AI Platform](screenshot.png)

ProSphere AI adalah platform otomasi WhatsApp modern, CRM omnichannel, dan agen sales cerdas bertenaga **Google Gemini AI** yang dirancang untuk skala enterprise. Dibangun dengan arsitektur modular yang rapi, cepat, dan berstandar industri dengan pemisahan penuh antara Frontend (Next.js 16) dan Backend (Express TypeScript + Prisma ORM + Baileys Multi-Device).

---

## 🏗️ Tech Stack & Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                 FRONTEND (PORT 5173)                        │
│   Next.js 16 (App Router) + React 19 + Tailwind CSS v4     │
│   TypeScript + Orbit Glowing Preloader + Material Symbols   │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST API & WebSocket (HTTP: 8000)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND (PORT 8000)                         │
│   Express.js + TypeScript (Modular Clean Architecture)      │
│   Socket.io + Pino Logger + Anti-Ban Engine                 │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│   DATABASE (PORT 3306)       │ │     WHATSAPP & AI ENGINE   │
│   MySQL (Laragon)            │ │   - @whiskeysockets/baileys│
│   Prisma ORM (11 Tabel)      │ │   - Google Gemini API      │
│   prosphere_ai               │ │     (gemini-3.5-flash-lite)│
└──────────────────────────────┘ └────────────────────────────┘
```

| Komponen | Teknologi | Alasan & Kegunaan |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16 (App Router)** | Fast Turbopack bundler, SSR/CSR fleksibel, arsitektur folder modular. |
| **Styling & Design System** | **Tailwind CSS v4** | Dark enterprise theme (`#0c0e14`, `#9ee939` Lime Neon, `#005c4b` WhatsApp Dark). |
| **Backend Framework** | **Express.js + TypeScript** | Struktur modular bersih per-fitur (*controller, service, routes*). |
| **Database ORM** | **Prisma ORM** | Type-safe query engine, auto-migration, dan relasi tabel terstruktur. |
| **Database Server** | **MySQL (Laragon @ 3306)** | Database relasional lokal cepat untuk transaksi, kontak, dan pesan. |
| **WhatsApp Gateway** | **@whiskeysockets/baileys** | Multi-Device WebSocket resmi WhatsApp Web, ringan, tanpa browser headless Chrome. |
| **Artificial Intelligence** | **Google Gemini 1.5 / 3.5 Flash-Lite** | Respon penalaran cepat (1–2 detik) untuk AI Sales Agent & Customer Service otonom. |

---

## 📁 Struktur Direktori Proyek

```
template-dashboard/
├── README.md                      # Dokumentasi komprehensif proyek
├── .gitignore                     # Konfigurasi git ignore root
├── screenshot.png                 # Pratinjau desain platform
├── index.html                     # Referensi mockup awal
│
├── frontend-prosphere-ai/         # APLIKASI FRONTEND (PORT 5173)
│   ├── .env.local                 # Konfigurasi URL API backend
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── app/
│       │   ├── page.tsx           # High-Converting SaaS Landing Page publik
│       │   ├── layout.tsx         # Root layout dengan Anti-FOUC & Google Fonts
│       │   ├── globals.css        # Tailwind CSS v4 styling & color tokens
│       │   ├── dashboard/         # Dashboard utama (KPI, bar chart, order stats)
│       │   ├── devices/           # Sesi WhatsApp Multi-Device & QR Scanner
│       │   ├── chat-history/      # Inbox obrolan live chat WhatsApp
│       │   ├── crm/               # Kanban pipeline CRM deals
│       │   ├── bookings/          # Reservasi & jadwal pertemuan
│       │   ├── scheduled-jobs/    # Jadwal tugas cron otomatis
│       │   ├── single-message/    # Pengirim pesan instan langsung
│       │   ├── bulk-messages/     # Mesin kampanye broadcast massal
│       │   ├── templates/         # Manajemen preset pesan cepat
│       │   ├── contacts/          # Database kontak pelanggan
│       │   ├── groups/            # Segmentasi cerdas grup kontak
│       │   ├── ai-settings/       # Konfigurasi parameter LLM Gemini
│       │   ├── chatbot-flows/     # Perancang diagram alur visual bot
│       │   └── ai-sales-agent/    # Simulator percakapan AI Sales Agent
│       ├── components/            # Komponen modular reusable (Shell, Header, Sidebar, Cards)
│       └── lib/
│           └── api.ts             # Klien fetch API terpusat ke backend
│
└── backend-prosphere-ai/          # APLIKASI BACKEND (PORT 8000)
    ├── .env                       # Variabel environment (Database URL & Gemini Key)
    ├── package.json
    ├── tsconfig.json
    ├── prisma/
    │   ├── schema.prisma          # Skema 11 model tabel Prisma MySQL
    │   └── seed.ts                # Database seeder awal
    ├── scripts/
    │   └── clear-database.ts      # Script pembersih database (0 data)
    └── src/
        ├── server.ts              # Entry point bootstrap HTTP & Socket.io
        ├── app.ts                 # Express setup, middleware, & CORS
        ├── config/
        │   ├── env.ts             # Validasi environment Zod
        │   └── prisma.ts          # Singleton Prisma Client
        ├── routes/
        │   └── index.ts           # Router sentral seluruh endpoint API
        └── modules/               # Modul Fitur Modular:
            ├── analytics/         # Telemetri dashboard real-time
            ├── whatsapp/          # Baileys gateway, QR generator, & Anti-Ban
            ├── ai/                # Integrasi Google Gemini API & prompt persona
            ├── crm/               # Manajemen leads & pipeline deals
            ├── contacts/          # Kontak & Contact Groups
            ├── bookings/          # Reservasi janji temu
            ├── templates/         # Template pesan WhatsApp
            ├── broadcast/         # Antrean broadcast kampanye massal
            ├── flows/             # Alur aturan chatbot
            ├── jobs/              # Jadwal otomatisasi cron
            └── chats/             # Thread inbox & riwayat pesan
```

---

## 🛡️ Mesin Anti-Ban 5-Layer (ProSphere Shield)

Platform ini mengintegrasikan perlindungan berlapis di dalam engine `whatsapp.service.ts` dan `antiban.util.ts` untuk melindungi nomor WhatsApp agar terhindar dari pemblokiran:

1. **Human Presence Simulation (`composing`)**:
   Sebelum pesan terkirim, engine mengirimkan sinyal status *"Sedang mengetik..."* ke nomor penerima selama 1.2 s/d 3.5 detik (menyesuaikan panjang karakter pesan).
2. **Dynamic Random Gaussian Jitter**:
   Menghindari pengiriman dengan interval waktu konstan/kaku. Jika jeda diatur 5 detik, sistem mengacaknya secara dinamis menjadi `6.2s, 8.1s, 5.4s, 7.3s`.
3. **Spintax Engine (`{A|B|C}`)**:
   Mendukung pengacakan variasi kata otomatis:
   `{Halo|Hai|Selamat siang} kak {{name}}, penawaran {spesial|eksklusif} Anda sudah aktif!`
4. **Batch Throttling & Auto-Cooldown**:
   Pada pengiriman broadcast massal, setiap 25 pesan terkirim berturut-turut, sistem otomatis istirahat (*sleep*) selama 60 detik sebelum melanjutkan antrean berikutnya.
5. **WhatsApp Number Pre-Validation (`onWhatsApp`)**:
   Engine memvalidasi nomor penerima terlebih dahulu. Mengirim ke nomor mati/tidak terdaftar dicegah secara otomatis untuk menjaga skor reputasi nomor.

---

## 📋 Daftar Rute & Endpoint API Backend

Base URL: `http://localhost:8000/api`

| Kategori | Method | Endpoint | Kegunaan |
| :--- | :---: | :--- | :--- |
| **System** | `GET` | `/health` | Pemeriksaan kesehatan server & timestamp |
| **Analytics** | `GET` | `/analytics/dashboard` | Telemetri KPI, grafik 7-hari, & status order |
| **WhatsApp** | `GET` | `/whatsapp/devices` | Daftar sesi perangkat WhatsApp terhubung |
| | `POST` | `/whatsapp/session/start` | Inisialisasi Baileys & generate QR code |
| | `POST` | `/whatsapp/disconnect` | Memutuskan sesi perangkat & reset auth |
| | `POST` | `/whatsapp/send` | Mengirim pesan langsung (Single Message) |
| **Gemini AI** | `GET` | `/ai/settings` | Mengambil konfigurasi model LLM & prompt |
| | `PUT` | `/ai/settings` | Memperbarui parameter model AI di MySQL |
| | `POST` | `/ai/simulate` | Simulator interaktif AI Sales Agent |
| **CRM Leads** | `GET` | `/crm/pipeline` | Mengambil 4 kolom tahapan deal kanban |
| | `POST` | `/crm/leads` | Menambah deal / lead baru ke pipeline |
| | `PATCH`| `/crm/leads/:id/stage`| Memperbarui tahapan status deal |
| **Contacts** | `GET` | `/contacts` | Mengambil seluruh buku kontak pelanggan |
| | `POST` | `/contacts` | Menyimpan kontak baru dengan tag |
| | `GET` | `/contacts/groups` | Mengambil daftar segmen grup kontak |
| | `POST` | `/contacts/groups` | Membuat grup kontak baru |
| **Bookings** | `GET` | `/bookings` | Mengambil daftar janji temu pelanggan |
| | `POST` | `/bookings` | Membuat reservasi jadwal baru |
| **Templates**| `GET` | `/templates` | Mengambil preset template pesan |
| | `POST` | `/templates` | Membuat template pesan cepat baru |
| **Broadcast**| `GET` | `/broadcast/campaigns` | Mengambil riwayat kampanye siaran |
| | `POST` | `/broadcast/campaigns` | Meluncurkan kampanye broadcast massal |
| **Flows** | `GET` | `/flows` | Mengambil alur aturan bot WhatsApp |
| | `POST` | `/flows` | Membuat alur aturan bot baru |
| | `PATCH`| `/flows/:id/toggle` | Mengubah status aktif/nonaktif alur |
| **Jobs** | `GET` | `/jobs` | Mengambil jadwal cron job otomatisasi |
| | `POST` | `/jobs` | Membuat jadwal tugas cron baru |
| | `PATCH`| `/jobs/:id/toggle` | Mengubah status aktif/jeda tugas cron |
| **Chats** | `GET` | `/chats` | Mengambil thread inbox obrolan pelanggan |
| | `GET` | `/chats/:id/messages` | Mengambil riwayat bubble chat per kontak |
| | `POST` | `/chats/:id/messages` | Mengirim balasan chat ke kontak |

---

## ⚙️ Variabel Lingkungan (Environment Variables)

### 1. Backend (`backend-prosphere-ai/.env`)
```env
# Server Port
PORT=8000
NODE_ENV=development

# MySQL Database (Laragon default: user=root, no password, host=localhost:3306)
DATABASE_URL="mysql://root:@localhost:3306/prosphere_ai"

# Frontend Origin for CORS
FRONTEND_URL="http://localhost:5173"

# Google Gemini API Key (Model Default: gemini-3.5-flash-lite)
GEMINI_API_KEY="AQ.Ab8RN6K1Ni49Qq8rltq1shtwiIzfn897m7Iw6ZEwpVU2A33zXg"
```

### 2. Frontend (`frontend-prosphere-ai/.env.local`)
```env
# Backend API Base URL
NEXT_PUBLIC_API_URL="http://localhost:8000/api"
```

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat
- **Node.js**: Versi 20 atau 24 LTS
- **Package Manager**: `npm` atau `pnpm`
- **Laragon**: MySQL aktif di port `3306`

### 2. Setup Database MySQL
1. Buka Laragon dan pastikan service **MySQL** berstatus `Start All`.
2. Buka phpMyAdmin di `http://localhost/phpmyadmin`.
3. Buat database baru bernama: `prosphere_ai` (Collation: `utf8mb4_unicode_ci`).

### 3. Menjalankan Backend API
```bash
cd backend-prosphere-ai

# 1. Install dependensi
npm install

# 2. Sinkronkan skema tabel ke MySQL
npm run db:push

# 3. Jalankan server backend (Port 8000)
npm run dev
```

### 4. Menjalankan Frontend
```bash
cd frontend-prosphere-ai

# 1. Install dependensi
pnpm install

# 2. Jalankan development server (Port 5173)
pnpm dev
```

Buka browser Anda di: **[http://localhost:5173](http://localhost:5173)**.

---

## 🔐 Sistem Role-Based Access Control (RBAC) & Kredensial Akun

ProSphere AI menerapkan sistem keamanan berlapis (*Defense in Depth*) dengan 3 Role utama:

| Role | Akun Default | Password | Akses Menu |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@prosphere.ai` | `admin123456` | Akses Penuh (100%), Devices QR, AI Settings, User Management, Activity Logs |
| **Staff Sales & CS** | `sales@prosphere.ai` | `sales123456` | Chat History, CRM Pipeline, Contacts, Bookings |
| **Staff Marketing** | `marketing@prosphere.ai` | `marketing123456` | Bulk Messages Broadcast, Templates, Contact Groups |

*Catatan: Tombol Quick-Fill akun demo tersedia langsung di halaman login (`/login`) untuk memudahkan pengujian.*

---

## 🛠️ Perintah Manajemen Database (NPM Scripts)

Di dalam folder `backend-prosphere-ai`, tersedia perintah cepat:

- `npm run db:push` : Mendorong perubahan skema `schema.prisma` ke database MySQL.
- `npm run db:clean`: **Mengosongkan seluruh isi data database (0 rows)** agar bersih untuk produksi.
- `npm run db:seed` : Mengisi database dengan data awal percontohan jika diperlukan.
- `npm run db:studio`: Membuka GUI interaktif Prisma Studio di browser untuk melihat seluruh isi tabel.

---

## 🔒 Panduan Setup Git & Push ke GitHub Private Repository

Untuk mendorong repository ini ke akun GitHub Private Anda bersama file `.env`:

```bash
# 1. Inisialisasi Git di root proyek
git init -b main

# 2. Tambahkan seluruh file proyek (termasuk .env sesuai permintaan)
git add .

# 3. Buat commit perdana
git commit -m "feat: complete ProSphere AI enterprise platform with anti-ban and dynamic MySQL integration"

# 4. Hubungkan ke repository GitHub Private Anda (Ganti URL di bawah dengan repo Anda)
git remote add origin https://github.com/<username-github-anda>/<nama-repo-private>.git

# 5. Push ke GitHub
git push -u origin main
```

---

## 📄 Lisensi & Hak Cipta
Hak Cipta © 2026 **ProSphere AI**. Dikembangkan untuk solusi otomatisasi percakapan WhatsApp & CRM cerdas tingkat enterprise.
