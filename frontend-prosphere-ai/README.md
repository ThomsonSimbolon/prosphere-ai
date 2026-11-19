# ProSphere AI Dashboard - Frontend

Frontend aplikasi dashboard **ProSphere AI** yang dibuat persis sesuai desain Stitch MCP menggunakan **Next.js (App Router)**, **Tailwind CSS**, dan **TypeScript**. Dibangun dengan arsitektur modular dan *clean code* terbaik untuk mempermudah *maintenance* dan pengembangan fitur oleh developer ke depannya.

---

## 📁 Struktur Direktori Modular

```
frontend-prosphere-ai/
├── src/
│   ├── app/                                # Next.js App Router
│   │   ├── globals.css                     # Design tokens (colors, spacing, fonts, utilities)
│   │   ├── layout.tsx                      # Root layout, Google Fonts, & metadata
│   │   └── page.tsx                        # Main dashboard page layout
│   │
│   ├── components/                         # Modular Components
│   │   ├── ui/                             # Reusable UI Primitives
│   │   │   ├── Icon.tsx                    # Google Material Symbols Icon wrapper
│   │   │   ├── Badge.tsx                   # Status badges (pulse, active, paid, etc.)
│   │   │   └── Card.tsx                    # Base surface container card
│   │   │
│   │   ├── layout/                         # Structural Layout Components
│   │   │   ├── Sidebar.tsx                 # Fixed navigation sidebar & footer branding
│   │   │   ├── Header.tsx                  # Top fixed header & quick action chips
│   │   │   └── DashboardShell.tsx          # Full dashboard responsive wrapper
│   │   │
│   │   └── dashboard/                      # Dashboard Feature Widgets
│   │       ├── PageHeader.tsx              # Title, Live Telemetry badge, time filters & refresh
│   │       ├── KpiMetricsGrid.tsx          # 5 top KPI cards (Messages, Rate, Orders, Revenue, Bookings)
│   │       ├── MessageAnalyticsCard.tsx    # Weekly bar chart & 3-column delivery breakdown
│   │       ├── SubMetricsGrid.tsx          # Avg Order & Connected Devices sub-cards
│   │       ├── BookingActivityBanner.tsx   # Booking activity banner link
│   │       ├── StatusCard.tsx              # Real-time status list & overall progress bar
│   │       ├── OrderStatisticsCard.tsx     # Order statistics list with status indicators
│   │       └── index.ts                    # Clean barrel export for dashboard widgets
│   │
│   ├── data/                               # Mock Data & Configurations
│   │   └── dashboardData.ts                # Data terpisah untuk metrik, navigasi, dan grafik
│   │
│   └── types/                              # Centralized TypeScript Definitions
│       └── dashboard.ts                    # Tipe data untuk KPI, Chart, Status, Navigasi, dsb.
│
├── public/                                 # Static assets & icons
├── tailwind.config.ts / globals.css        # Tailwind CSS theme configuration
├── package.json                            # Dependencies & scripts
└── tsconfig.json                           # TypeScript configuration
```

---

## 🎨 Design System & Palette

Warna dan token desain disesuaikan 100% dengan token Google Stitch:

| Token | Nilai Hex | Keterangan |
|---|---|---|
| `background` / `surface` | `#03170b` | Deep dark emerald background |
| `surface-container-low` | `#0b2013` | Sidebar & card background |
| `surface-container` | `#0f2417` | Inner container background |
| `primary` | `#9ee939` | Electric lime accent |
| `secondary` | `#4ae176` | Emerald green status/action |
| `error` | `#ffb4ab` | Failed status & error badge |
| `on-surface` | `#d0e9d4` | Primary text color |
| `on-surface-variant` | `#c1cab0` | Secondary / muted text color |

---

## 🚀 Menjalankan Proyek

### 1. Masuk ke direktori
```bash
cd frontend-prosphere-ai
```

### 2. Jalankan Server Development
```bash
pnpm dev
# atau npm run dev
```
Akses dashboard di browser melalui [http://localhost:3000](http://localhost:3000).

### 3. Build Produksi
```bash
pnpm build
# atau npm run build
```

---

## 💡 Panduan Maintenance Bagi Developer

1. **Mengubah Data / Menghubungkan ke API / Backend**:
   - Buka `src/data/dashboardData.ts` untuk melihat struktur data *mock*.
   - Saat integrasi dengan REST API atau WebSocket (misal: SWR atau TanStack Query), cukup gantikan data di `src/app/page.tsx` atau *custom hook* dengan response API yang mengikuti tipe di `src/types/dashboard.ts`.

2. **Menambah Menu Navigasi**:
   - Tambahkan item baru di array `NAVIGATION_GROUPS` pada `src/data/dashboardData.ts`. Icon menggunakan nama Google Material Symbols.

3. **Menambah Widget Baru**:
   - Buat komponen baru di `src/components/dashboard/[NamaWidget].tsx`.
   - Ekspor melalui `src/components/dashboard/index.ts`.
   - Sisipkan ke layout grid di `src/app/page.tsx`.
