# Inkory - Deployment Guide

Guide to deploy Inkory to production.

## 🚀 Backend Deployment (NestJS)

### Option 1: Railway (Recommended)

#### 1. Prepare Repository

```bash
cd backend

# Ensure package.json has build script
# "build": "nest build"
# "start": "node dist/main"
```

#### 2. Create Railway Account

- Visit: https://railway.app
- Sign up with GitHub

#### 3. Deploy

- Click "New Project"
- Select "Deploy from GitHub"
- Choose your repository
- Railway auto-detects NestJS

#### 4. Set Environment Variables

In Railway dashboard, add:

```env
DATABASE_HOST=<railway-postgres-host>
DATABASE_PORT=5432
DATABASE_USER=<postgres-user>
DATABASE_PASSWORD=<postgres-password>
DATABASE_NAME=inkory_db

JWT_SECRET=<generate-strong-secret>
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

NODE_ENV=production
PORT=3000
```

#### 5. Add PostgreSQL

- In Railway: Add PostgreSQL plugin
- It will auto-populate DATABASE\_\* variables

#### 6. Deploy

- Railway auto-deploys on git push
- Check logs in dashboard

### Option 2: Render

#### 1. Create Render Account

- Visit: https://render.com
- Sign up

#### 2. Create Web Service

- New → Web Service
- Connect GitHub repository
- Select backend folder

#### 3. Configure

- Runtime: Node
- Build Command: `npm install && npm run build`
- Start Command: `node dist/main`

#### 4. Add PostgreSQL

- New → PostgreSQL
- Copy connection string to Web Service env

#### 5. Set Environment Variables

Same as Railway setup

### Option 3: AWS EC2

#### 1. Launch EC2 Instance

```bash
# Ubuntu 22.04 LTS
# t3.micro (free tier eligible)
```

#### 2. Install Dependencies

```bash
sudo apt update
sudo apt install nodejs npm postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
```

#### 3. Setup Database

```bash
sudo -u postgres psql

CREATE DATABASE inkory_db;
CREATE USER app_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE inkory_db TO app_user;
\q
```

#### 4. Deploy Application

```bash
# Clone repository
git clone <your-repo>
cd backend

# Install dependencies
npm install

# Build
npm run build

# Create .env file
nano .env

# Start with PM2 (process manager)
npm install -g pm2
pm2 start dist/main.js --name "inkory-backend"
pm2 startup
pm2 save
```

#### 5. Setup Nginx Reverse Proxy

```bash
sudo apt install nginx

# Create config
sudo nano /etc/nginx/sites-available/default

# Add:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🎨 Frontend Deployment (Vite)

### Option 1: Vercel

#### 1. Create Vercel Account

- Visit: https://vercel.com
- Sign up with GitHub

#### 2. Import Project

- Click "New Project"
- Select your GitHub repository
- Select frontend folder

#### 3. Configure

- Framework Preset: Vite
- Root Directory: frontend
- Build Command: `npm run build`
- Output Directory: `dist`

#### 4. Set Environment Variables

```env
VITE_API_URL=https://your-backend-domain.com
```

#### 5. Deploy

- Vercel auto-deploys on git push
- Get production URL

### Option 2: Netlify

#### 1. Create Netlify Account

- Visit: https://netlify.com
- Sign up with GitHub

#### 2. New Site from Git

- Connect GitHub
- Select repository
- Select frontend folder

#### 3. Configure

- Build Command: `npm run build`
- Publish Directory: `dist`

#### 4. Environment Variables

- Add `VITE_API_URL`

#### 5. Deploy

- Netlify auto-deploys

### Option 3: AWS S3 + CloudFront

#### 1. Build Vite App

```bash
npm run build
```

#### 2. Create S3 Bucket

```bash
aws s3 mb s3://inkory-frontend
```

#### 3. Upload Build

```bash
aws s3 sync dist/ s3://inkory-frontend/
```

#### 4. Setup CloudFront

- Create distribution
- Point to S3 bucket
- Add SSL certificate

---

## 🔗 Connect Frontend to Backend

After deploying backend, update frontend:

### 1. Get Backend URL

- Railway: `https://your-app.up.railway.app`
- Render: `https://your-app.onrender.com`
- AWS: `https://your-domain.com`

### 2. Update Environment Variable

```env
VITE_API_URL=https://your-backend-url.com
```

### 3. Redeploy Frontend

- Vercel: Auto-redeploys on git push
- Netlify: Auto-redeploys on git push

---

## 🔐 Production Checklist

### Backend

- [ ] JWT_SECRET is strong and unique
- [ ] Database credentials are secure
- [ ] Cloudinary credentials are set
- [ ] CORS is configured for frontend domain
- [ ] NODE_ENV=production
- [ ] Error logging is enabled
- [ ] Database backups are configured
- [ ] SSL certificate is valid

### Frontend

- [ ] API URL points to production backend
- [ ] Build is optimized
- [ ] Environment variables are set
- [ ] SSL certificate is valid
- [ ] Analytics/monitoring is enabled
- [ ] Error tracking is configured

### Database

- [ ] Backups are scheduled
- [ ] Monitoring is enabled
- [ ] Connection pooling is configured
- [ ] Indexes are created
- [ ] Regular maintenance is scheduled

---

## 📊 Monitoring & Maintenance

### Backend Monitoring

```bash
# Check logs
pm2 logs

# Monitor performance
pm2 monit

# Restart if needed
pm2 restart all
```

### Database Monitoring

```bash
# Check connections
SELECT count(*) FROM pg_stat_activity;

# Check disk usage
SELECT pg_size_pretty(pg_database_size('inkory_db'));
```

### Frontend Monitoring

- Vercel Analytics
- Netlify Analytics
- Google Analytics

---

## 🚨 Troubleshooting

### Backend won't start

```bash
# Check logs
pm2 logs

# Check port
lsof -i :3000

# Check environment variables
echo $DATABASE_HOST
```

### Database connection failed

```bash
# Test connection
psql -h $DATABASE_HOST -U $DATABASE_USER -d $DATABASE_NAME

# Check credentials in .env
```

### Frontend can't reach backend

```bash
# Check API URL
echo $VITE_API_URL

# Test API
curl https://your-backend-url.com/api
```

### SSL certificate issues

```bash
# Renew certificate
sudo certbot renew

# Check expiration
sudo certbot certificates
```

---

## 💰 Cost Estimation

### Railway

- Database: $7/month
- Backend: $5/month
- **Total**: ~$12/month

### Render

- Database: Free tier available
- Backend: $7/month
- **Total**: ~$7/month

### Vercel

- Frontend: Free tier available
- **Total**: Free or $20+/month

### AWS (EC2 + RDS)

- EC2: $10-20/month
- RDS: $15-30/month
- **Total**: $25-50/month

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Test
        run: npm test

      - name: Deploy
        run: npm run deploy
```

---

## 📈 Scaling Strategies

### Horizontal Scaling

- Multiple backend instances
- Load balancer (Nginx, HAProxy)
- Database read replicas

### Vertical Scaling

- Upgrade server resources
- Increase database memory
- Optimize queries

### Caching

- Redis for session storage
- CDN for static assets
- Database query caching

---

## 🎉 Deployment Complete!

Your Inkory platform is now live in production.

### Next Steps

1. Monitor application performance
2. Setup automated backups
3. Configure error tracking
4. Enable analytics
5. Plan scaling strategy

### Resources

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs

Happy deploying! 🚀
