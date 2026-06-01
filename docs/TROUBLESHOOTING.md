# Troubleshooting Guide

Common issues and solutions for Inkory.

## 🔴 Database Issues

### PostgreSQL Connection Failed

**Error:** `connect ECONNREFUSED 127.0.0.1:5432`

**Solutions:**

```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql@14

# Test connection
psql -U postgres -d inkory_db
```

### Database Already Exists

**Error:** `database "inkory_db" already exists`

**Solution:**

```bash
# Drop existing database
psql postgres
DROP DATABASE inkory_db;
CREATE DATABASE inkory_db;
\q
```

### Port Already in Use

**Error:** `listen EADDRINUSE :::5432`

**Solution:**

```bash
# Find process using port
lsof -i :5432

# Kill process
kill -9 <PID>
```

---

## 🔴 Backend Issues

### Backend Won't Start

**Error:** `Cannot find module '@nestjs/core'`

**Solution:**

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run start:dev
```

### Port 3001 Already in Use

**Error:** `listen EADDRINUSE :::3001`

**Solution:**

```bash
# Option 1: Find and kill process
lsof -i :3001
kill -9 <PID>

# Option 2: Change port in .env
PORT=3002
```

### Swagger UI Not Loading

**Error:** Swagger UI returns 404

**Solution:**

```bash
# Ensure backend is running
curl http://localhost:3001/api

# Check main.ts has Swagger setup
# Should see: SwaggerModule.setup('api', app, document);
```

### JWT Token Invalid

**Error:** `Unauthorized: Invalid token`

**Solution:**

```bash
# Check JWT_SECRET in .env
# Ensure token is sent in Authorization header
# Format: Authorization: Bearer <token>

# Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔴 Frontend Issues

### Frontend Won't Start

**Error:** `Cannot find module 'next'`

**Solution:**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### API Connection Failed

**Error:** `Failed to fetch from http://localhost:3001`

**Solutions:**

1. Check backend is running: `http://localhost:3001/api`
2. Check `.env.local` has correct URL:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
3. Clear browser cache and reload

### Port 3000 Already in Use

**Error:** `Error: listen EADDRINUSE :::3000`

**Solution:**

```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Blank Page / 404 Errors

**Solutions:**

1. Check browser console for errors
2. Verify API is responding: `curl http://localhost:3001/articles`
3. Clear `.next` cache: `rm -rf .next`
4. Restart dev server

---

## 🔴 Authentication Issues

### Cannot Login

**Error:** `Invalid credentials`

**Solutions:**

1. Verify user exists in database
2. Check password is correct
3. Ensure JWT_SECRET matches between .env files
4. Check token is stored in localStorage

### Session Expires Too Quickly

**Error:** `Token expired` after short time

**Solution:**

```bash
# Update JWT_EXPIRES_IN in backend/.env
JWT_EXPIRES_IN=7d  # Increase from default
```

---

## 🔴 File Upload Issues

### Image Upload Fails

**Error:** `Upload failed: 413 Payload Too Large`

**Solutions:**

1. Check file size (max 5MB recommended)
2. Verify Cloudinary credentials in .env
3. Check CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET

### Cloudinary Not Configured

**Error:** `Cloudinary is not initialized`

**Solution:**

```bash
# Ensure .env has Cloudinary config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Restart backend
npm run start:dev
```

---

## 🔴 Performance Issues

### Slow API Responses

**Solutions:**

1. Check database indexes
2. Monitor backend logs
3. Check network tab in DevTools
4. Verify database connection

### High Memory Usage

**Solutions:**

1. Check for memory leaks
2. Restart backend/frontend
3. Monitor with: `node --inspect`

---

## 🔴 Build Issues

### Build Fails

**Error:** `Build failed with exit code 1`

**Solutions:**

```bash
# Backend build
cd backend
npm run build

# Frontend build
cd frontend
npm run build

# Check for TypeScript errors
npm run type-check
```

---

## 📝 Debugging Tips

### Enable Debug Logging

**Backend:**

```bash
DEBUG=* npm run start:dev
```

**Frontend:**

```bash
npm run dev -- --debug
```

### Check Logs

**Backend logs:**

```bash
# In terminal where backend is running
# Look for error messages
```

**Browser console:**

- Press F12
- Check Console tab for errors
- Check Network tab for failed requests

### Database Inspection

```bash
# Connect to database
psql -U postgres -d inkory_db

# List tables
\dt

# Query data
SELECT * FROM users;
SELECT * FROM articles;
```

---

## 🆘 Still Having Issues?

1. Check [docs/](./docs/) for detailed guides
2. Review error messages carefully
3. Check GitHub issues
4. Create new issue with:
   - Error message
   - Steps to reproduce
   - Environment info (OS, Node version, etc.)

---

**Happy debugging! 🔧**
