# Heal & Harmony

A Next.js landing page for a luxury Traditional Chinese Medicine and acupuncture clinic.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add environment variables in a `.env.local` file:
   ```bash
   DATABASE_URL=postgres://username:password@localhost:5432/yourdb
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Notes

- This template uses Next.js App Router, Tailwind CSS, and PostgreSQL.
- Add a hero background image at `public/hero-bg.jpg` and a doctor portrait at `public/doctor-portrait.jpg`.
- Use `db.ts` for PostgreSQL queries in server components or API routes.
