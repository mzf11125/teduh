# Teduh.app

Progressive Web App (PWA) for managing housing facility bookings such as swimming pools, basketball courts, tennis courts, and futsal fields.

## Features

- 🏊 **Booking Facilities** - Book swimming pools, basketball, tennis, and futsal courts
- 📅 **Interactive Calendar** - Choose available date and time slots
- 🎫 **QR Code Tickets** - Each booking has a QR code for check-in
- 👴 **Elderly Friendly** - Large fonts, easy-to-press buttons, high contrast
- 🔔 **Notifications** - Push notification, email, and WhatsApp
- 📱 **PWA** - Install on homescreen, works offline
- 👨‍💼 **Admin Panel** - Manage facilities, bookings, and residents

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State**: Zustand, React Query
- **PWA**: next-pwa, Web Push API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account ([sign up free](https://supabase.com))
- Twilio account (optional, for WhatsApp)

### Installation

1. Clone repository:
```bash
git clone https://github.com/yourusername/teduh.git
cd teduh
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Supabase credentials.

4. Setup Supabase database:
```bash
# Create a new project in Supabase dashboard
# Then run SQL migration in SQL Editor
# Migration files are in: supabase/migrations/001_initial_schema.sql
```

5. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Build

```bash
npm run build
npm start
```

## Folder Structure

```
teduh/
├── app/                    # Next.js app router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (main)/            # Main pages (home, bookings, profile)
│   ├── (admin)/           # Admin pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Feature components
├── lib/                  # Utility functions
├── public/               # Static assets
├── supabase/             # Database migrations
└── types/                # TypeScript types
```

## Accessibility

This app is designed with high accessibility standards for elderly users:

- **Minimum font**: 18px for body text
- **Touch target**: Minimum 48px (WCAG AAA)
- **Contrast ratio**: Minimum 7:1 for text
- **Simple navigation**: Maximum 2 levels
- **Clear labels**: All icons have supporting text

## License

MIT License - see LICENSE file for details

---

# Teduh.app

Progressive Web App (PWA) untuk mengelola pemesanan fasilitas perumahan seperti kolam renang, lapangan basket, tenis, dan futsal.

## Fitur

- 🏊 **Booking Fasilitas** - Pesan kolam renang, lapangan basket, tenis, dan futsal
- 📅 **Kalender Interaktif** - Pilih tanggal dan waktu slot yang tersedia
- 🎫 **Tiket QR Code** - Setiap pesanan memiliki QR code untuk check-in
- 👴 **Ramah Lansia** - Desain dengan font besar, tombol mudah ditekan, dan kontras tinggi
- 🔔 **Notifikasi** - Push notification, email, dan WhatsApp
- 📱 **PWA** - Install di homescreen, works offline
- 👨‍💼 **Admin Panel** - Kelola fasilitas, pesanan, dan warga

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State**: Zustand, React Query
- **PWA**: next-pwa, Web Push API

## Memulai

### Prasyarat

- Node.js 18+ terinstall
- Akun Supabase ([daftar gratis](https://supabase.com))
- Akun Twilio (opsional, untuk WhatsApp)

### Instalasi

1. Clone repository:
```bash
git clone https://github.com/yourusername/teduh.git
cd teduh
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan kredensial Supabase Anda.

4. Setup database Supabase:
```bash
# Buat project baru di Supabase dashboard
# Lalu jalankan migration SQL di SQL Editor
# File migration ada di: supabase/migrations/001_initial_schema.sql
```

5. Jalankan development server:
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Deploy

### Vercel (Disarankan)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Build Manual

```bash
npm run build
npm start
```

## Struktur Folder

```
teduh/
├── app/                    # Next.js app router
│   ├── (auth)/            # Halaman auth (login, register)
│   ├── (main)/            # Halaman utama (home, bookings, profile)
│   ├── (admin)/           # Halaman admin
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Komponen fitur
├── lib/                  # Utility functions
├── public/               # Static assets
├── supabase/             # Database migrations
└── types/                # TypeScript types
```

## Aksesibilitas

Aplikasi ini dirancang dengan standar aksesibilitas tinggi untuk pengguna lansia:

- **Font minimum**: 18px untuk body text
- **Touch target**: Minimum 48px (WCAG AAA)
- **Rasio kontras**: Minimum 7:1 untuk text
- **Navigasi sederhana**: Maksimal 2 level
- **Label jelas**: Semua icon memiliki teks pendukung

## Lisensi

MIT License - lihat file LICENSE untuk detail
