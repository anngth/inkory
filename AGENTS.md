# For AI Agents

**Full Documentation:** [docs/index.md](docs/index.md)

## Project Overview

- **Type:** Full-stack blogging platform (Medium-like)
- **Backend:** NestJS 10 + TypeORM + PostgreSQL (Port 3000)
- **Frontend:** Vite + React 19 + React Router + TailwindCSS (Port 5173)

## Quick Links

- **Setup Guide** → [docs/setup.md](docs/setup.md)
- **Architecture** → [docs/architecture.md](docs/architecture.md)
- **Security** → [docs/security.md](docs/security.md)
- **API Reference** → [docs/api.md](docs/api.md)
- **Deployment** → [docs/deployment.md](docs/deployment.md)

## Important Notes

- All security vulnerabilities fixed (11 issues resolved)
- Always use explicit field selection for user relations (no password/email exposure)
- Pagination limited to max 50 items
- File uploads validated with magic bytes (5MB limit)
- Use atomic operations for counters
- Use SQL aggregations (SUM/COUNT) not JavaScript

**For detailed information, see [docs/index.md](docs/index.md)**
