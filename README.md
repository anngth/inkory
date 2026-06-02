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

## Code Formatting

This project uses [Prettier](https://prettier.io/) for consistent code formatting.

```bash
# Format backend code
cd backend && npm run format

# Format frontend code
cd frontend && npm run format
```

See [docs/prettier.md](docs/prettier.md) for detailed configuration and editor setup.

## Documentation

See [docs/index.md](docs/index.md)

## Tech Stack

- Frontend: Vite + React 19 + React Router + TailwindCSS
- Backend: NestJS 10 + TypeORM + PostgreSQL
- Auth: JWT + Passport

## License

MIT
