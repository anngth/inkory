# Inkory

Full-stack blogging platform - NestJS + Vite + React + PostgreSQL

## Quick Start

```bash
# Backend (Port 3000)
cd backend && npm install
cp .env.example .env
# Edit .env: Set JWT_SECRET and DATABASE_URL
npm run start:dev

# Frontend (Port 5173)
cd frontend && npm install
cp .env.local.example .env.local
npm run dev
```

## Documentation

See [docs/index.md](docs/index.md)

## Tech Stack

- Frontend: Vite + React 19 + React Router + TailwindCSS
- Backend: NestJS 10 + TypeORM + PostgreSQL
- Auth: JWT + Passport

## License

MIT
