# Lore - A tiny daily conversation with yourself

Lore is a Vietnamese-first daily journaling web application. This repository contains the foundational code based on Next.js App Router, Tailwind CSS, Prisma, and next-intl.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4, `next-themes` (Dark/Light mode)
- **Database**: PostgreSQL (via Prisma ORM)
- **Localization**: `next-intl` (vi/en)
- **UI Components**: custom components built with Tailwind, Sonner (Toasts), Lucide React (Icons)
- **Validation**: Zod

## Getting Started

### 1. Environment Setup
Copy the `.env.example` (or create a `.env` file) and provide your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/lore"
```

### 2. Database Initialization
Run Prisma to sync the schema to your database:
```bash
npx prisma db push
```
And generate the client:
```bash
npx prisma generate
```

### 3. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application defaults to the Vietnamese locale (`/vi`).

### 4. Building for Production
```bash
npm run build
npm start
```

## Project Structure
- `src/app/[locale]`: The Next.js App router with internationalization.
- `src/components/ui`: Reusable foundational UI components (Button, Card, Input, Modal).
- `messages/`: Localization dictionaries (`vi.json`, `en.json`).
- `prisma/`: Database schema definitions.

## Design Philosophy
The UI follows a calm, minimalist editorial interface inspired by Apple. It uses soft rounded corners, restrained motion, and a color palette featuring warm whites/soft zincs in Light Mode and charcoal/deep slates in Dark Mode.
