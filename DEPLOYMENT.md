# DevConnect Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying the DevConnect MERN application to various platforms.

## 📋 Pre-Deployment Checklist

### ✅ Environment Variables Setup

**Backend Environment Variables (Required):**
```
PORT=5000
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend Environment Variables (Required):**
```
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=DevConnect
VITE_APP_VERSION=1.0.0
```

## 🔧 Backend Deployment

### Option 1: Railway (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Railway will auto-deploy from your main branch

### Option 2: Heroku
1. Install Heroku CLI
2. Create new app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set MONGO_URI=your_uri`
4. Deploy: `git push heroku main`

### Option 3: Render
1. Connect GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables in dashboard

## 🎨 Frontend Deployment

### Option 1: Netlify (Recommended)
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables in Netlify dashboard

### Option 2: Vercel
1. Connect GitHub repository
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

## 🔐 Security Considerations

1. **Never commit .env files** - They're already in .gitignore
2. **Use strong JWT secrets** - Generate random 64+ character strings
3. **Set NODE_ENV=production** for backend
4. **Enable CORS properly** - Set FRONTEND_URL in backend
5. **Use HTTPS** in production

## 🗄️ Database Setup

1. **MongoDB Atlas** (Recommended):
   - Create cluster at mongodb.com
   - Whitelist deployment platform IPs
   - Use connection string in MONGO_URI

## 📝 Environment Variables Reference

Copy the `.env.example` files and fill in your values:
- Backend: `backend/.env.example` → `backend/.env`
- Frontend: `frontend/.env.example` → `frontend/.env.local`

## 🚨 Important Notes

- The `.env` files are excluded from Git for security
- Set environment variables directly in your deployment platform
- Test your deployment with the provided environment variable templates
- Make sure MongoDB allows connections from your deployment platform
