# Portal Masjid Nurul Jannah

Website modern untuk area publik jamaah dan CMS internal pengurus Masjid Nurul Jannah. Fondasi project ini memakai Next.js App Router, TypeScript strict, Tailwind CSS, shadcn/ui, Prisma, Auth.js, dan Supabase PostgreSQL.

## Stack

- Next.js App Router
- TypeScript strict
- Tailwind CSS
- shadcn/ui
- Prisma ORM
- Supabase PostgreSQL
- Auth.js / NextAuth
- React Hook Form + Zod
- TanStack Table
- Recharts
- Lucide React
- ESLint + Prettier

## Cara install

```bash
npm install
```

## Setup environment

```bash
cp .env.example .env
```

Isi minimal:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Database

Generate Prisma client:

```bash
npm run db:generate
```

Push schema:

```bash
npm run db:push
```

Atau migrasi lokal:

```bash
npm run db:migrate
```

Seed data:

```bash
npm run db:seed
```

## Menjalankan project

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Akun demo seed

- Admin Utama: `admin@nuruljannah.id` / `Admin123!`
- Bendahara: `bendahara@nuruljannah.id` / `Admin123!`
- Sekretaris: `sekretaris@nuruljannah.id` / `Admin123!`

## Deploy ke Vercel

1. Push project ke Git repository.
2. Import repository ke Vercel.
3. Tambahkan semua environment variables dari `.env.example`.
4. Arahkan `DATABASE_URL` ke Supabase PostgreSQL.
5. Jalankan migrasi atau `db push` sebelum dipakai.

## Integrasi Supabase

- Database utama memakai Supabase PostgreSQL melalui Prisma.
- Helper client browser sudah disiapkan di `src/lib/supabase.ts`.
- Struktur project tetap aman untuk self-hosted karena ketergantungan platform dibatasi pada environment variables standar.
