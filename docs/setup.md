# Setup Guide

Get Inkory running locally in 5 minutes.

## Prerequisites

```bash
node --version  # 20+
psql --version  # 14+
npm --version   # 10+
```

## Quick Setup

### 1. Database

```bash
createdb inkory_db
```

### 2. Backend (Port 3000)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
# Required
JWT_SECRET=$(openssl rand -base64 32)  # Generate strong secret
DATABASE_URL=postgresql://user:pass@localhost:5432/inkory_db

# Optional (defaults shown)
PORT=3000
NODE_ENV=development
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
ENABLE_SWAGGER=true

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start backend:

```bash
npm run start:dev  # http://localhost:3000
```

### 3. Frontend (Port 5173)

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

Start frontend:

```bash
npm run dev  # http://localhost:5173
```

## Verify Setup

### Backend Health Check

```bash
curl http://localhost:3000/articles
# Expected: {"data":[],"meta":{...}}
```

### Swagger Docs

Open http://localhost:3000/api (dev only)

### Frontend

Open http://localhost:5173

## Development Workflow

### Backend Commands

```bash
npm run start:dev      # Watch mode
npm run build          # Production build
npm run start:prod     # Production mode
npm test               # Unit tests
npm run test:e2e       # E2E tests
npm run test:cov       # Coverage
```

### Frontend Commands

```bash
npm run dev            # Development
npm run build          # Production build
npm run start          # Production mode
npm run lint           # Lint check
```

### Database Commands

```bash
# Migrations (auto-run on start)
npm run migration:generate -- -n MigrationName
npm run migration:run
npm run migration:revert

# Seed data
npm run seed
```

## Project Structure

```text
inkory/
├── backend/              # NestJS API (Port 3000)
│   ├── src/
│   │   ├── main.ts      # Entry point
│   │   ├── entities/    # TypeORM models
│   │   ├── articles/    # Articles module
│   │   ├── auth/        # JWT auth
│   │   ├── users/       # Users module
│   │   ├── comments/    # Comments module
│   │   ├── claps/       # Claps module
│   │   ├── bookmarks/   # Bookmarks module
│   │   ├── follows/     # Follows module
│   │   ├── tags/        # Tags module
│   │   ├── upload/      # File upload
│   │   └── common/      # Shared DTOs
│   └── .env             # Config
│
├── frontend/            # Vite App (Port 5173)
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── lib/        # API client
│   │   ├── store/      # Zustand stores
│   │   └── types/      # TypeScript types
│   └── .env.local      # Config
│
└── docs/               # Documentation
```

## Environment Variables

### Backend Required

- `JWT_SECRET` - Min 32 chars (fails fast if missing)
- `DATABASE_URL` - PostgreSQL connection string

### Backend Optional

- `PORT` - Default: 3000
- `NODE_ENV` - Default: development
- `JWT_EXPIRES_IN` - Default: 7d
- `FRONTEND_URL` - Default: http://localhost:5173
- `ENABLE_SWAGGER` - Default: true (auto-disabled in production)

### Frontend Required

- `VITE_API_URL` - Backend URL (default: http://localhost:3000)

## Common Issues

### Port Already in Use

```bash
# Check what's using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
psql -d inkory_db -c "SELECT 1"

# Check DATABASE_URL in .env
grep DATABASE_URL backend/.env
```

### JWT_SECRET Missing

```bash
# Generate and add to .env
echo "JWT_SECRET=$(openssl rand -base64 32)" >> backend/.env
```

### CORS Errors

```bash
# Check FRONTEND_URL in backend/.env
# Should match frontend URL
grep FRONTEND_URL backend/.env
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Next Steps

1. **Understand architecture** → [architecture.md](architecture.md)
2. **Review security** → [security.md](security.md)
3. **Check API endpoints** → [architecture.md#api-endpoints](architecture.md#api-endpoints)
4. **See features** → [features.md](features.md)

## Testing

### Run Security Tests

```bash
./test-security-fixes.sh
```

### Manual API Tests

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","username":"testuser"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
# Returns: {"access_token":"..."}

# List articles
curl http://localhost:3000/articles
```

## Production Setup

See [deployment.md](deployment.md) for production deployment guide.

## Support

- **Setup issues:** Check [troubleshooting.md](troubleshooting.md)
- **Architecture questions:** See [architecture.md](architecture.md)
- **Security questions:** See [security.md](security.md)
