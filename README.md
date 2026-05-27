# Ordee

Restaurant management application for tracking orders, menu items, tables, and payments.

## Tech Stack

- **Frontend:** React 19, Vite, TanStack Start, TanStack Router
- **UI:** Shadcn UI, Tailwind CSS v4, Lucide Icons
- **Backend:** Neon (PostgreSQL), Drizzle ORM
- **Auth:** Neon Auth (Better Auth)
- **State:** Zustand, TanStack Query
- **Hosting:** Netlify

## Getting Started

### Prerequisites

- Bun v1.3+
- Node.js 20+
- Neon database

### Installation

```bash
bun install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://...
VITE_NEON_AUTH_URL=https://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Database

Push schema to database:

```bash
bun run db:push
```

Generate migrations:

```bash
bun run db:generate
bun run db:migrate
```

### Development

```bash
bun run dev
```

### Build

```bash
bun run build
```

## Project Structure

```
app/
  routes/           # TanStack Router routes
  auth.ts           # Auth client
features/
  accounts/         # User management
  categories/       # Menu categories
  meals/            # Menu items
  tables/           # Table management
  orders/           # Order management
  payments/         # Payment history
  daily-report/     # Daily statistics
  membership/       # Plan management
  guest-orders/     # Guest ordering
components/
  ui/               # Shadcn UI components
server/
  db/               # Drizzle schema & connection
  functions/        # Server functions
hooks/
  use-auth.ts       # Auth hook
```

## Features

- **Orders** — Create, update, track orders with cart system
- **Menu** — Manage meals with images, categories, stock tracking
- **Tables** — Table management with status tracking
- **Payments** — View paid orders and receipts
- **Daily Reports** — Revenue and order statistics
- **Membership** — Plan management with usage tracking
- **Guest Orders** — Self-service ordering for guests
- **User Management** — Admin, user, and guest roles

## Deployment

Deploy to Netlify:

1. Connect repository
2. Set environment variables
3. Deploy

Build command: `bun run build`
Publish directory: `.output/public`
