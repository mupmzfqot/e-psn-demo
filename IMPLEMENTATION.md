# Implementation Plan — e-PSN Portal Prototype

## Current State

Bare Vite + TypeScript scaffold with existing admin prototype pages (login, dashboard, aduan, tempahan, pengguna) using TailwindCSS v4 CDN + Alpine.js CDN.

**Existing pages (keep, may need refinement):** `login.html`, `dashboard.html`, `aduan.html`, `aduan-detail.html`, `tempahan.html`, `tempahan-detail.html`, `pengguna.html`

**Files to remove:** `src/counter.ts`, `src/style.css`, `src/typescript.svg`, `tsconfig.json`

**Files to replace:** `src/main.ts` → `src/main.js`, `index.html`, `package.json`

---

## Modules (from PDF specification)

| Module | Pages |
|--------|-------|
| Modul Kalendar Takwim | `takwim.html`, `admin/takwim.html`, `admin/takwim-detail.html` |
| Pembangunan Kandungan | `galeri.html`, `program.html` |
| Pengurusan Pengunjung | `admin/pengunjung.html` |
| Modul Operasi & Tempahan | `tempahan-baru.html`, `tempahan-semak.html`, `admin/fasiliti.html`, `admin/operasi.html` |
| Modul Khidmat Pelanggan | `aduan-baru.html`, `aduan-semak.html`, `admin/laporan.html` |
| AI Chatbot | Floating widget in all public pages |
| Pengurusan Pengguna | `pengguna.html` (existing) |
| Portal Landing | `index.html` |

---

## Phase 1 — Project Setup

Goal: migrate from CDN-based to npm-based Tailwind + Alpine before building remaining pages.

### 1.1 Update `package.json`

```json
{
  "name": "e-psn",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev":     "vite",
    "build":   "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite":           "^6.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss":    "^4.0.0"
  },
  "dependencies": {
    "alpinejs": "^3.14.0"
  }
}
```

### 1.2 Create `vite.config.js`

Multi-page entry for all HTML files.

```js
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index:              resolve(__dirname, 'index.html'),
        login:              resolve(__dirname, 'login.html'),
        takwim:             resolve(__dirname, 'takwim.html'),
        galeri:             resolve(__dirname, 'galeri.html'),
        program:            resolve(__dirname, 'program.html'),
        aduanBaru:          resolve(__dirname, 'aduan-baru.html'),
        aduanSemak:         resolve(__dirname, 'aduan-semak.html'),
        tempahanBaru:       resolve(__dirname, 'tempahan-baru.html'),
        tempahanSemak:      resolve(__dirname, 'tempahan-semak.html'),
        dashboard:          resolve(__dirname, 'dashboard.html'),
        aduan:              resolve(__dirname, 'aduan.html'),
        aduanDetail:        resolve(__dirname, 'aduan-detail.html'),
        tempahan:           resolve(__dirname, 'tempahan.html'),
        tempahanDetail:     resolve(__dirname, 'tempahan-detail.html'),
        pengguna:           resolve(__dirname, 'pengguna.html'),
        adminTakwim:        resolve(__dirname, 'admin/takwim.html'),
        adminTakwimDetail:  resolve(__dirname, 'admin/takwim-detail.html'),
        adminPengunjung:    resolve(__dirname, 'admin/pengunjung.html'),
        adminFasiliti:      resolve(__dirname, 'admin/fasiliti.html'),
        adminOperasi:       resolve(__dirname, 'admin/operasi.html'),
        adminLaporan:       resolve(__dirname, 'admin/laporan.html'),
      }
    }
  }
})
```

### 1.3 Create `src/style.css`

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-psn-teal:      #0d9488;
  --color-psn-teal-dark: #0f766e;
  --color-psn-teal-light:#14b8a6;
}
```

### 1.4 Create `src/main.js` (delete `src/main.ts`)

```js
import './style.css'
import Alpine from 'alpinejs'

window.Alpine = Alpine

// Initialize dark mode before Alpine to prevent flash
if (localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
}

Alpine.start()
```

### 1.5 Update existing prototype pages

Replace CDN `<script src="https://cdn.tailwindcss.com">` and Alpine CDN with:
```html
<link rel="stylesheet" href="/src/style.css">  <!-- dev only -->
<script type="module" src="/src/main.js"></script>
```

---

## Shared Layout

### Admin Sidebar (copy into every admin page, change active nav item)

Fixed, w-64, `bg-white dark:bg-gray-950`, border-r.

```
Logo: src/logo.png + "e-PSN" + "Portal Admin"
─────────────────────────────────────────────
UTAMA
  Dashboard

PORTAL
  Kalendar Takwim         (badge: activity count)
  Galeri & Program

OPERASI
  Sistem Tempahan         (badge: pending count)
  Pengurusan Fasiliti
  Log Operasi Harian

KHIDMAT PELANGGAN
  Sistem Aduan            (badge: new count)
  Laporan & Statistik

PENGURUSAN
  Pengurusan Pengunjung
  Pengurusan Pengguna
  Tetapan
─────────────────────────────────────────────
Avatar + Nama + Jawatan + Log Keluar icon
```

Active item: `bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold`

### Admin Header (copy into every admin page)

Sticky, h-16, white/gray-950, border-b.
Left: hamburger (mobile) + breadcrumb
Right: search bar | dark toggle | bell (red dot) | avatar

### Public Navbar (copy into every public page)

```
[logo + "Pusat Sains Negara"]    Utama | Aktiviti | Galeri | Program | Hubungi
                                 [Semak Aduan] [Buat Tempahan] [BM | EN]
```

Mobile: hamburger → drawer. Sticky, bg-white/gray-950, border-b, shadow-sm.

### Dark Mode Toggle

All pages: `x-data` on `<body>`, `dark` initialized from `document.documentElement.classList.contains('dark')`. Toggle writes to `localStorage` and toggles `dark` class on `<html>`.

---

## Phase 2 — Public Portal Pages

### Page 1 — `index.html` (Portal Landing)

**Alpine state:** `x-data="{ lang: 'bm', chatOpen: false }"`

**Sections (top to bottom):**

1. **Top utility bar** (teal-700, h-8, text-xs white)
   - Left: phone 03-2698 6211 · email psn@psn.gov.my
   - Right: language toggle BM / EN + social icons (Facebook, Instagram, YouTube)

2. **Navbar** (see Shared Layout above)

3. **Hero** (min-h-screen, teal gradient bg)
   - Headline: "Meneroka Sains, Membentuk Masa Depan"
   - Subheadline: tagline
   - Two CTA buttons: "Buat Tempahan" (white filled) + "Jelajahi Aktiviti" (white outlined)
   - Scroll indicator arrow

4. **Stats strip** (white, border-y, py-8)
   - 4 stats: 2.5 Juta Pengunjung | 50+ Program | 30 Tahun Khidmat | 200+ Pameran

5. **Upcoming Aktiviti** (section, bg-gray-50 dark:bg-gray-900)
   - Heading "Aktiviti Akan Datang"
   - 3-col card grid — each card: date badge (teal), tajuk, lokasi, masa, status badge (Awam/Dalaman)
   - "Lihat Semua Aktiviti" link → `takwim.html`

6. **Galeri Pameran** (section, white)
   - Heading "Galeri Pameran"
   - 4-col image grid with overlay: Fizik | Biologi | Teknologi | Angkasa
   - Each card: `hover:scale-105 transition-transform`, overlay shows tajuk + "Terokai →"
   - "Lihat Semua Galeri" link → `galeri.html`

7. **Program Pendidikan** (section, teal-50 dark:teal-950)
   - Heading "Program Pendidikan"
   - 2-col: Inreach Programs card + Outreach Programs card
   - Each: icon, description, senarai jenis program, "Daftar Sekarang" button

8. **Statistik Pengunjung** (section, white)
   - Heading "Statistik Pengunjung" + "(Data Terbuka Kerajaan)"
   - 3 stat cards: Pengunjung Hari Ini | Bulan Ini | Tahun Ini
   - CSS bar chart: weekly visitor trend (Mon–Sun bars)
   - "Lihat Data Penuh" → `admin/pengunjung.html`

9. **Khidmat Pelanggan strip** (teal-700 bg, white text)
   - "Ada aduan atau cadangan?" + "Hantar Aduan" button → `aduan-baru.html`

10. **AI Chatbot widget** (fixed bottom-right)
    - Floating teal circle button with chat icon
    - `x-show="chatOpen"` → chat window (200×320px): header "Tanya e-PSN", message bubbles (mock: "Assalamualaikum! Boleh saya bantu anda?"), input field + send

11. **Footer** (gray-950 dark, 4-col)
    - Tentang PSN | Perkhidmatan | Pautan Pantas | Hubungi Kami
    - Address: Jalan Perdana, 50480 KL · 03-2698 6211
    - © 2025 Pusat Sains Negara

---

### Page 2 — `takwim.html` (Kalendar Takwim — Public)

**Alpine state:** `x-data="{ view: 'list', month: 3, year: 2025, filter: 'semua' }"`

**Sections:**

1. **Navbar** + page hero (teal gradient, h-40): "Kalendar Aktiviti PSN"

2. **Filter + View Toggle**
   - Filter pills: Semua | Pameran | Program | Majlis | Bengkel (`x-on:click`, active = teal filled)
   - View toggle: List view / Calendar grid view (`x-model="view"`)

3. **List View** (`x-show="view === 'list'"`)
   - Month group headers: "Mac 2025"
   - Activity cards in vertical list:
     - Date block (teal, day + month abbreviation)
     - Tajuk, kategori badge, lokasi (PSN / Online), masa, status (Awam/Dalaman)
     - "Lihat Butiran" link

4. **Calendar Grid View** (`x-show="view === 'calendar'"`, `x-cloak`)
   - Month navigation: ← Mac 2025 →
   - 7-col grid (Ahd–Sab), 5 weeks
   - Days with events: teal dot indicator + short event title on hover
   - Today highlighted with ring-2

5. **Mock events:**

| Tarikh | Tajuk | Kategori | Masa | Status |
|--------|-------|----------|------|--------|
| 12 Mac | Pameran Interaktif Fizik Kuantum | Pameran | 9:00–17:00 | Awam |
| 15 Mac | Program Inreach SMK Kepong | Program | 10:00–12:00 | Awam |
| 18 Mac | Bengkel Astronomi Remaja | Bengkel | 14:00–17:00 | Awam |
| 20 Mac | Mesyuarat Pengurusan PSN | Majlis | 9:00–11:00 | Dalaman |
| 25 Mac | Hari Sains Sedunia | Majlis | 8:00–18:00 | Awam |

---

### Page 3 — `galeri.html` (Galeri Pameran — Public)

**Alpine state:** `x-data="{ tab: 'semua', lightbox: false, activeImg: '' }"`

**Sections:**

1. **Navbar** + hero: "Galeri Pameran"

2. **Gallery Tabs:** Semua | Indoor | Outdoor | Sains Hayat | Fizik | Teknologi | Angkasa

3. **Gallery Grid** (3-col → 2-col mobile, `gap-4`)
   - Each card: `aspect-video bg-gray-200 dark:bg-gray-700` placeholder + overlay (tajuk, kategori, "Lihat →")
   - Click → `lightbox = true, activeImg = item.title`
   - `hover:scale-105 transition-transform duration-300`

4. **Lightbox modal** (`x-show="lightbox"`, fixed overlay)
   - Large image placeholder + tajuk + penerangan (2–3 sentences)
   - ← → arrows to navigate + × close button

5. **Gallery items (mock):**
   - Galeri Sains Hayat (Indoor) — Pameran sel hidup dan ekosistem
   - Galeri Fizik & Tenaga (Indoor) — Demonstrasi tenaga dan graviti
   - Galeri Teknologi & Inovasi (Indoor) — Robot dan kecerdasan buatan
   - Galeri Angkasa Lepas (Indoor) — Simulasi planet dan bintang
   - Taman Sains Luar (Outdoor) — Peralatan sains luar bilik
   - Menara Cerap (Outdoor) — Teleskop dan pemerhatian bintang

---

### Page 4 — `program.html` (Program Pendidikan — Public)

**Alpine state:** `x-data="{ tab: 'inreach', selected: null }"`

**Sections:**

1. **Navbar** + hero: "Program Pendidikan"

2. **Tab toggle:** Inreach (PSN datang ke sekolah) | Outreach (Sekolah ke PSN)
   Active tab: border-b-2 border-teal-600 text-teal-600

3. **Program Cards grid** (3-col)
   - Each card: kategori badge, tajuk, sasaran (primary/secondary/public), penerangan, durasi, yuran, "Daftar / Buat Tempahan" button → `tempahan-baru.html`

4. **Inreach programs (mock):**
   - Jelajah Sains Asas — Primary, 2 jam, percuma
   - Bengkel Kimia Menyeronokkan — Secondary, 3 jam, RM15/pelajar
   - Program STEM Sekolah Rendah — Primary, 1 hari, RM20/pelajar

5. **Outreach programs (mock):**
   - Lawatan Galeri Berpandu — All ages, 2 jam, RM10/orang
   - Bengkel Robotik — Secondary, 4 jam, RM50/pelajar
   - Demo Sains Interaktif — Primary, 90 min, RM8/pelajar

6. **Survey section** (card at bottom)
   - "Maklum Balas Program" heading
   - 5-star rating component (`x-data="{ rating: 0 }"`, stars turn teal on hover/click)
   - Textarea for comments + "Hantar" button

---

### Page 5 — `aduan-baru.html` (Hantar Aduan — Public)

**Alpine state:** `x-data="{ step: 1, jenis: 'aduan', submitted: false, refNo: '' }"`

**Step progress bar** (3 steps): Maklumat → Butiran → Hantar

**Step 1 — Maklumat Pengadu**
- Nama Penuh (text)
- No. Kad Pengenalan (text, `000000-00-0000`)
- No. Telefon (text)
- Alamat Emel (email) — notifikasi akan dihantar ke sini
- Jenis Penyertaan: radio — Aduan | Maklum Balas | Cadangan (`x-model="jenis"`)

**Step 2 — Butiran**
- Kategori: select (Kemudahan Bangunan | Perkhidmatan Kaunter | Program & Aktiviti | Sistem IT | Kebersihan | Lain-lain)
- Tajuk (text, max 100 chars)
- Penerangan (textarea, max 1000 chars, char counter)
- Tarikh Kejadian (date, `x-show="jenis === 'aduan'"`)
- Lokasi (text, `x-show="jenis === 'aduan'"`)
- Lampiran (file, `.jpg,.png,.pdf`, max 5MB, `x-show="jenis === 'aduan'"`)
- Semak kotak: Saya mengesahkan maklumat adalah benar

**Step 3 — Semak & Hantar**
- Read-only summary of entered data
- "Hantar" button → `submitted = true, refNo = 'ADU-2025-' + Math.floor(Math.random()*9000+1000)`

**Success state** (`x-show="submitted"`):
- Green checkmark circle
- "Aduan Berjaya Dihantar!" heading
- No. Rujukan: `ADU-2025-XXXX` (gold/amber, monospace)
- "Notifikasi akan dihantar ke emel anda dalam masa 24 jam"
- Two buttons: "Semak Status Aduan" → `aduan-semak.html` | "Kembali ke Laman Utama" → `index.html`

---

### Page 6 — `aduan-semak.html` (Semak Status Aduan — Public)

**Alpine state:** `x-data="{ searched: true, notFound: false }"`

**Search card** (centered, max-w-xl):
- Input: "Masukkan No. Rujukan (cth: ADU-2025-0248)"
- Input: "Alamat Emel Pemohon"
- "Semak Status" button (teal)

**Result card** (shown by default with mock data):
- Status badge (large, centered): "Dalam Proses" (yellow pill)
- Butiran: No. Rujukan | Jenis | Kategori | Tarikh Hantar | Tarikh Sasaran Selesai

**Vertical timeline** (5 steps):
1. ✓ Aduan Diterima — ADU-2025-0248 direkodkan — 10 Mac 2025, 9:32 pagi
2. ✓ Dalam Semakan — Pegawai sedang menyemak aduan — 10 Mac 2025, 2:00 ptg
3. ● Tindakan Sedang Diambil — gold pulsing dot
4. ○ Maklum Balas Diberikan — gray
5. ○ Selesai — gray

**Maklum Balas Pegawai card** (if status >= Tindakan):
- Nota dari pegawai PSN (mock: "Pasukan penyelenggaraan telah dihubungi...")

---

### Page 7 — `tempahan-baru.html` (Permohonan Tempahan — Public)

**Alpine state:** `x-data="{ step: 1, jenisTempahan: 'fasiliti', submitted: false }"`

**Step bar** (4 steps): Jenis → Butiran → Peserta → Hantar

**Step 1 — Pilih Jenis Tempahan**
- Radio cards (large, with icon + desc):
  - Lawatan ke PSN (icon: building) — Lawatan umum / berkumpulan
  - Program Inreach (icon: school) — PSN datang ke institusi anda
  - Program Outreach (icon: users) — Bawa pelajar ke PSN
  - Sewaan Fasiliti (icon: calendar) — Bilik seminar, dewan, makmal

**Step 2 — Maklumat Pemohon & Tarikh**
- Nama Pemohon / Institusi (text)
- No. Kad Pengenalan / No. Pendaftaran (text)
- No. Telefon + Emel
- Fasiliti/Program: select (populated based on Step 1 choice)
- Tarikh Tempahan (date)
- Masa Mula / Masa Tamat (time inputs)
- Tujuan (textarea)

**Step 3 — Maklumat Peserta**
- Bilangan Peserta (number)
- Peringkat: radio (Tadika | Rendah | Menengah | Dewasa | Pelbagai)
- Keperluan Khas: checkbox (OKU | Berkerusi Roda | Penterjemah)
- Keperluan Peralatan: checkbox group (Projektor | PA System | Laptop | Meja Tambahan)

**Step 4 — Semak & Hantar**
- Summary + Fee estimate (if applicable)
- "Hantar Permohonan" → success state with ref `TMP-2025-XXXX`
- Note: "Pengesahan akan dihantar ke emel anda setelah permohonan disemak (1-3 hari bekerja)"

---

### Page 8 — `tempahan-semak.html` (Semak Status Tempahan — Public)

Same layout as `aduan-semak.html` but for bookings.

**Alpine state:** `x-data="{ searched: true }"`

**Result card** shows:
- Fasiliti/Program | Tarikh | Masa | Bil. Peserta | Status

**Timeline** (4 steps):
1. ✓ Permohonan Diterima
2. ✓ Dalam Semakan
3. ● Menunggu Kelulusan — pulsing dot
4. ○ Disahkan / Ditolak

If Disahkan → "Surat Kelulusan" download button (PDF icon)

---

## Phase 3 — Admin Panel Pages

All admin pages use the shared **Sidebar** + **Header** from Phase 1. Build `dashboard.html` sidebar first, copy verbatim to all admin pages.

---

### Page 9 — `dashboard.html` (Admin Dashboard) — EXISTING, refine only

**Refine to add:**
- Quick stats for all modules: Aduan Baharu | Tempahan Menunggu | Aktiviti Minggu Ini | Pengunjung Hari Ini
- Replace "Upcoming Tempahan" table with a combined activity feed

---

### Page 10 — `admin/takwim.html` (Pengurusan Kalendar Takwim)

**Alpine state:** `x-data="{ view: 'list', showAdd: false, filterStatus: 'semua' }"`

Active nav: Kalendar Takwim

**Page header:** "Kalendar Takwim" + "Tambah Aktiviti" button → `showAdd = true`

**Add Aktiviti Modal** (`x-show="showAdd"`):
- Tajuk Aktiviti (text)
- Kategori: select (Pameran | Program | Majlis | Bengkel | Lawatan)
- Tarikh Mula / Tarikh Tamat (date)
- Masa Mula / Masa Tamat (time)
- Lokasi (text) + Koordinat GeoLokasi (lat, lng inputs)
- Status Capaian: radio — Awam | Dalaman
- Penerangan (textarea)
- "Simpan" button

**Filter bar:**
- Tabs: Semua | Awam | Dalaman | Akan Datang | Selesai
- Month/Year selector

**Data table:**
- Columns: ☐ | Tajuk | Kategori | Tarikh | Masa | Lokasi | Status | Statistik | Tindakan
- Status badges: Awam (teal) | Dalaman (purple) | Selesai (gray) | Dibatalkan (red)
- Statistik column: "124 penglibatan · 3 jam" (small text)
- Tindakan: view | edit | toggle status | delete

**Pagination** + record count

---

### Page 11 — `admin/takwim-detail.html` (Butiran Aktiviti)

**Alpine state:** `x-data="{ editMode: false }"`

Active nav: Kalendar Takwim

**Two-column layout** (xl:grid-cols-3):

**Left (2 cols):**
1. Maklumat Aktiviti card — all fields read-only, "Edit" button → `editMode = true`
2. Lokasi & GeoLokasi card — static map placeholder (gray div, crosshair icon), coordinates display
3. Statistik Impak card:
   - Total Penglibatan: **124 orang**
   - Durasi: **3 jam**
   - CSS bar chart: participation by day (if multi-day event)

**Right (1 col):**
1. Status card — current badge + toggle Awam/Dalaman button
2. Maklumat Tambahan — Tarikh Cipta | Dicipta Oleh | Terakhir Dikemas kini
3. Quick actions: Edit | Padam | Duplikat Aktiviti

---

### Page 12 — `admin/pengunjung.html` (Pengurusan Pengunjung)

**Alpine state:** `x-data="{ period: 'minggu', year: 2025 }"`

Active nav: Pengurusan Pengunjung

**Page header:** "Statistik Pengunjung" + "(Data Terbuka Kerajaan)" badge + "Eksport" button

**4 stat cards:**
- Hari Ini: **342** orang (green +12% vs semalam)
- Bulan Ini: **8,450** orang
- Tahun Ini: **45,210** orang
- Purata Harian: **287** orang

**Period toggle:** Harian | Mingguan | Bulanan | Tahunan (`x-model="period"`)

**Visitor trend chart** (CSS bar chart, white card):
- `x-show="period === 'minggu'"` — 7 bars (Mon–Sun), each bar height proportional to count
- `x-show="period === 'bulan'"` — 30 bars (days of month), narrower bars
- Bar labels below, count above each bar

**Breakdown table** (white card):
- Columns: Tarikh | Dewasa | Kanak-kanak | OKU | Warga Emas | Jumlah | Berbanding Semalam
- 7 rows (last 7 days)
- "Jumlah" column bold
- "Berbanding" column: green ↑ / red ↓ arrow + percentage

**Demografi card** (side by side):
- Warganegara: CSS horizontal bars (Malaysia 78%, Asing 22%)
- Jenis Kumpulan: Individu | Sekolah | Keluarga | Korporat — horizontal bars

---

### Page 13 — `admin/fasiliti.html` (Pengurusan Fasiliti)

**Alpine state:** `x-data="{ showAdd: false, fasiliti: [...] }"`

Active nav: Pengurusan Fasiliti

**Page header:** "Pengurusan Fasiliti" + "Tambah Fasiliti" button

**Add Fasiliti Modal** (`x-show="showAdd"`):
- Nama Fasiliti (text)
- Jenis: select (Dewan | Bilik Seminar | Makmal | Ruang Pameran | Luar)
- Kapasiti (number)
- Lokasi/Tingkat (text)
- Yuran Sewa (RM/jam — number)
- Peralatan Tersedia: checkboxes (Projektor | PA System | Papan Putih | WiFi | Pendingin Hawa)
- Status: Aktif / Tidak Aktif
- Gambar (file upload placeholder)

**Fasiliti Cards grid** (3-col):

Each card (white, border, shadow-sm):
- Gray image placeholder (aspect-video) with facility icon overlay
- Nama Fasiliti (bold) + Jenis badge
- Lokasi + Kapasiti icons
- Availability bar: "Hari Ini: 3/5 slot ditempah" with teal progress bar
- Status toggle: Aktif (green) / Tidak Aktif (red)
- Footer row: "Edit" | "Jadual" | "Lihat Tempahan"

**Fasiliti mock data:**

| Fasiliti | Jenis | Kapasiti | Yuran/jam | Status |
|----------|-------|----------|-----------|--------|
| Dewan Utama | Dewan | 500 | RM200 | Aktif |
| Bilik Seminar A | Bilik Seminar | 80 | RM80 | Aktif |
| Bilik Seminar B | Bilik Seminar | 40 | RM60 | Aktif |
| Makmal Sains | Makmal | 30 | RM100 | Aktif |
| Bilik Pameran Khas | Ruang Pameran | 150 | RM150 | Aktif |
| Planetarium | Ruang Pameran | 200 | RM180 | Tidak Aktif |

---

### Page 14 — `admin/operasi.html` (Log Operasi Harian)

**Alpine state:** `x-data="{ date: '2025-03-11', showAdd: false, tab: 'log' }"`

Active nav: Log Operasi Harian

**Page header:** "Log Operasi Harian" + date picker (default today) + "Tambah Log" button

**Tab bar:** Log Harian | Galeri Pameran | Aset & Bahan

**Tab 1 — Log Harian** (`x-show="tab === 'log'"`)

Daily summary card (row of 4):
- Status Operasi: BEROPERASI (green pill)
- Masa Operasi: 9:00 pagi – 5:00 petang
- Pegawai Bertugas: 3 orang
- Pengunjung: 342 orang

**Log entries table:**
- Columns: Masa | Perkara | Catatan | Oleh | Tindakan
- Rows (mock): 09:00 Galeri dibuka | 10:30 Kumpulan sekolah tiba (65 orang) | 12:00 Waktu rehat | 14:00 Program demo sains | 16:45 Persediaan tutup
- "Tambah Log" inline form at bottom

**Tab 2 — Galeri Pameran** (`x-show="tab === 'galeri'"`)

Gallery management table:
- Columns: Galeri | Status | Pameran Aktif | Bil. Aset | Tindakan
- 6 rows matching gallery sections
- Status: Dibuka (green) / Penyelenggaraan (yellow) / Ditutup (red)

**Tab 3 — Aset & Bahan** (`x-show="tab === 'aset'"`)

Assets table:
- Columns: ID Aset | Nama | Galeri | Kondisi | Tarikh Semakan | Tindakan
- Kondisi badges: Baik (green) | Perlu Perhatian (yellow) | Rosak (red)
- 8 mock rows

---

### Page 15 — `admin/laporan.html` (Laporan & Statistik)

**Alpine state:** `x-data="{ tab: 'aduan', period: 'bulan' }"`

Active nav: Laporan & Statistik

**Page header:** "Laporan & Statistik" + "Eksport Excel" + "Eksport PDF" buttons

**Module tabs:** Aduan & Maklum Balas | Tempahan | Pengunjung | Aktiviti

**Filter row:** date range | period (harian/mingguan/bulanan) | "Jana Laporan" button

---

**Tab 1 — Aduan & Maklum Balas** (`x-show="tab === 'aduan'"`)

4 summary cards:
- Jumlah Diterima: **156** | Aduan: 98 | Maklum Balas: 45 | Cadangan: 13
- Selesai: **134** (85.9%)
- Dalam Proses: **18**
- Purata Masa Selesai: **2.4 hari**

CSS bar chart: "Aduan Mengikut Kategori" — horizontal bars:
- Kemudahan Bangunan: 45 (29%)
- Perkhidmatan Kaunter: 38 (24%)
- Program & Aktiviti: 31 (20%)
- Sistem IT: 24 (15%)
- Kebersihan: 18 (12%)

Monthly breakdown table (12 months):
- Columns: Bulan | Diterima | Selesai | Dalam Proses | Kadar Selesai | Purata Masa (hari)
- Bold total row

---

**Tab 2 — Tempahan** (`x-show="tab === 'tempahan'"`)

4 summary cards:
- Jumlah Permohonan: **312**
- Disahkan: **267** (85.6%)
- Ditolak: **28** (9.0%)
- Menunggu: **17**

"Mengikut Fasiliti" horizontal CSS bars + "Mengikut Jenis Tempahan" horizontal bars

Monthly table: same structure as Tab 1

---

**Tab 3 — Pengunjung** (`x-show="tab === 'pengunjung'"`)

Monthly visitor table + CSS bar chart for trend

---

**Tab 4 — Aktiviti** (`x-show="tab === 'aktiviti'"`)

Table: Aktiviti | Kategori | Tarikh | Penglibatan | Durasi | Status
+ "Jumlah Penglibatan" stat card

---

## Shared Conventions

**Status badges:** `rounded-full px-2 py-0.5 text-xs font-medium`

| Status | Style |
|--------|-------|
| Baharu / Baru Diterima | `bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400` |
| Dalam Proses / Menunggu | `bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400` |
| Selesai / Disahkan / Aktif | `bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400` |
| Ditolak / Dibatalkan | `bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400` |
| Awam | `bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300` |
| Dalaman | `bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400` |

**Form inputs:** `w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500`

**Primary button:** `bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors`

**Outlined button:** `border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 text-sm font-medium transition-colors`

**Card:** `bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm`

**CSS bar chart pattern:**
```html
<div class="flex items-end gap-1 h-32">
  <div class="flex-1 bg-teal-500 rounded-t" style="height: 65%"></div>
  <!-- repeat per data point -->
</div>
```

**Dark mode:** All pages initialize `dark` class on `<html>` from `localStorage` in a `<script>` block in `<head>` before Alpine loads. Toggle via `document.documentElement.classList.toggle('dark')`.

**Language toggle (public pages):** `x-data="{ lang: 'bm' }"` on `<body>`. Elements use `x-show="lang === 'bm'"` / `x-show="lang === 'en'"` for bilingual content.

**AI Chatbot widget** (all public pages, fixed bottom-right):
```html
<div x-data="{ open: false }" class="fixed bottom-6 right-6 z-50">
  <div x-show="open" class="mb-3 w-72 h-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border ...">
    <!-- chat window -->
  </div>
  <button @click="open = !open" class="w-14 h-14 rounded-full bg-teal-600 ...">
    <!-- chat icon -->
  </button>
</div>
```

---

## Mock Data Reference

| Field | Value |
|-------|-------|
| Ref Aduan | ADU-2025-0248 |
| Ref Tempahan | TMP-2025-0090 |
| Pengadu | Lim Nadia · limnadia@email.com · 011-2345 6789 |
| Pemohon Tempahan | SMK Kepong Baru · rozita@smkkepong.edu.my |
| Fasiliti | Bilik Seminar A · Tingkat 2 Blok B · Kapasiti 80 |
| Tarikh Tempahan | 12 Mac 2025, 2:00–5:00 ptg |
| Pegawai Admin | Ahmad Hafiz · hafiz@psn.gov.my · Administrator |
| Alamat PSN | Jalan Perdana, 50480 Kuala Lumpur |
| Telefon PSN | 03-2698 6211 |
| Emel PSN | psn@psn.gov.my |

---

## Build Order

1. Phase 1 — setup (package.json, vite.config, style.css, main.js)
2. Refine existing admin pages (login, dashboard, aduan, tempahan, pengguna)
3. Admin pages: takwim → pengunjung → fasiliti → operasi → laporan
4. Public pages: index → takwim → galeri → program → aduan-baru → aduan-semak → tempahan-baru → tempahan-semak
5. Add AI chatbot widget to all public pages last
