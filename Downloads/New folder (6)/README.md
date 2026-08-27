# InventarisKu

Aplikasi manajemen inventaris aset kantor. Data tersimpan di **Postgres** (Neon saat production). Preview lokal memakai PGLite otomatis.

## Fitur

- Dashboard kuantitas, kondisi baik, dan perlu perbaikan
- CRUD aset (nama, register, kode, kategori, kondisi, harga, foto)
- Filter & pencarian
- Cetak daftar dan cetak detail

## Stack

- Frontend: TanStack Start + React + Tailwind
- Backend: server functions (`src/lib/assets.server.ts`)
- Database: Postgres — skema di `migrations/0002_assets.sql`

Deploy ke Vercel memakai `DATABASE_URL` Postgres. Migrasi dijalankan saat `npm run build`.
