# 🚀 **FREE Deployment Guide for Doma Advisor**

## 🎯 **Recommended Stack: Vercel + Railway**

This guide will deploy your app **100% FREE** using:
- **Frontend**: Vercel (Next.js hosting)
- **Backend**: Railway (FastAPI hosting)
- **Database**: Railway PostgreSQL (included)

---

## 📋 **Prerequisites**

1. **GitHub Account** (free)
2. **Vercel Account** (free at [vercel.com](https://vercel.com))
3. **Railway Account** (free at [railway.app](https://railway.app))
4. **API Keys** for blockchain services

---

## 🚀 **Step 1: Deploy Backend to Railway**

### 1.1 Connect GitHub to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `Doma2` repository

### 1.2 Configure Backend Service
1. Railway will auto-detect it's a Python app
2. Set the **Root Directory** to `backend`
3. Railway will use the `railway.json` config automatically

### 1.3 Add Environment Variables
In Railway dashboard, add these environment variables:

```env
# Database (Railway will provide these)
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port

# App Configuration
SECRET_KEY=your-super-secret-key-here
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app

# Blockchain APIs
DOMA_RPC_URL=https://rpc.doma.io
OPENAI_API_KEY=your-openai-key
ETHERSCAN_API_KEY=your-etherscan-key
POLYGONSCAN_API_KEY=your-polygonscan-key
OPENSEA_API_KEY=your-opensea-key
UNSTOPPABLE_API_KEY=your-unstoppable-key

# Railway specific
PORT=8000
```

### 1.4 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Copy your **Railway URL** (e.g., `https://your-app.railway.app`)

---

## 🌐 **Step 2: Deploy Frontend to Vercel**

### 2.1 Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your `Doma2` repository

### 2.2 Configure Frontend
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `.next` (auto-detected)

### 2.3 Add Environment Variables
Add these in Vercel dashboard:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app

# App Configuration
NEXT_PUBLIC_APP_NAME=Doma Advisor
NEXT_PUBLIC_APP_VERSION=1.0.0

# Wallet Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# Blockchain Configuration
NEXT_PUBLIC_ALCHEMY_API_KEY=your-alchemy-api-key
NEXT_PUBLIC_ETHERSCAN_API_KEY=your-etherscan-api-key
NEXT_PUBLIC_POLYGONSCAN_API_KEY=your-polygonscan-api-key
```

### 2.4 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at `https://your-app.vercel.app`

---

## 🗄️ **Step 3: Setup Database (Railway)**

### 3.1 Add PostgreSQL Service
1. In Railway project, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will auto-generate connection details

### 3.2 Update Backend Environment
1. Copy the PostgreSQL connection string
2. Update `DATABASE_URL` in your backend environment variables

### 3.3 Add Redis (Optional)
1. Add "Redis" service if needed
2. Update `REDIS_URL` environment variable

---

## 🔧 **Step 4: Update CORS Settings**

### 4.1 Backend CORS Update
In your `main-simple.py`, ensure CORS allows your Vercel domain:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.vercel.app",  # Your Vercel domain
        "http://localhost:3000"         # Local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🚀 **Step 5: Test Deployment**

### 5.1 Test Backend
```bash
# Health check
curl https://your-backend.railway.app/health

# Test API endpoints
curl https://your-backend.railway.app/api/crypto-prices
```

### 5.2 Test Frontend
1. Visit your Vercel URL
2. Check browser console for errors
3. Test wallet connection
4. Test API calls

---

## 🔄 **Automatic Deployments**

### GitHub Integration
- **Vercel**: Auto-deploys on every push to main branch
- **Railway**: Auto-deploys on every push to main branch

### Manual Deployments
- **Vercel**: `vercel --prod`
- **Railway**: `railway up`

---

## 💰 **Cost Breakdown**

| Service | Cost | What's Included |
|---------|------|-----------------|
| **Vercel** | **FREE** | Unlimited deployments, custom domains |
| **Railway** | **$5 credit/month** | Backend hosting + PostgreSQL + Redis |
| **Total** | **~$5/month** | Full production app |

---

## 🎯 **Alternative Free Options**

### **Option A: Netlify + Render**
- **Netlify**: Free frontend hosting
- **Render**: Free backend hosting (with limitations)

### **Option B: GitHub Pages + Railway**
- **GitHub Pages**: Free static hosting
- **Railway**: Same backend setup

### **Option C: Vercel + Supabase**
- **Vercel**: Free frontend hosting
- **Supabase**: Free database + backend functions

---

## 🚨 **Troubleshooting**

### Common Issues

**Backend won't start:**
```bash
# Check Railway logs
railway logs

# Verify environment variables
railway variables
```

**Frontend build fails:**
```bash
# Check Vercel build logs
# Verify environment variables in Vercel dashboard
```

**CORS errors:**
- Ensure `ALLOWED_ORIGINS` includes your Vercel domain
- Check browser console for specific error messages

**Database connection:**
- Verify `DATABASE_URL` in Railway environment variables
- Check if PostgreSQL service is running

---

## 🎉 **You're Live!**

Your Doma Advisor app is now deployed for **FREE** with:
- ✅ Professional hosting
- ✅ Automatic deployments
- ✅ Custom domains (optional)
- ✅ SSL certificates
- ✅ Global CDN
- ✅ Database included

**Next steps:**
1. Set up custom domain (optional)
2. Configure monitoring
3. Set up error tracking
4. Add analytics

---

## 📞 **Need Help?**

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **GitHub Issues**: Create an issue in your repo

**Happy Deploying! 🚀**
