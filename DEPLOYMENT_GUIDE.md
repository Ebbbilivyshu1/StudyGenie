# 🚀 Deployment Guide - AI Study Companion

## ✅ Groq API Key Information

### How Long Does It Last?
Your Groq API key: **`gsk_V0UPfM40...`**

- ✅ **Free Beta**: Currently Groq offers very generous free limits
- ✅ **Blazing Fast**: Much faster than most other providers
- ✅ **Llama 3 Powered**: Uses Meta's latest Llama 3/3.3 models

### When You Might Hit Limits:
- Groq has rate limits (RPM/TPM), but they are high enough for most demos
- Check https://console.groq.com/limitssettings/ for current status

---

## 🌐 Deploying as Live Website

### Option 1: Deploy to Vercel + Render (Recommended - FREE) ⚡

**Frontend (Vercel):**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy frontend
cd frontend
vercel
```

**Backend (Render.com):**
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub (push code first)
4. Or use Docker/Manual deployment
5. Set environment variables in Render dashboard:
   ```
   GROQ_API_KEY=YOUR_API_KEY
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<strong-secret-key>
   ```

---

### Option 2: Deploy to Netlify + Railway

**Frontend (Netlify):**
```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Deploy dist folder to Netlify
# Drag and drop the 'dist' folder at netlify.com
```

**Backend (Railway.app):**
1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Set environment variables
4. Deploy

---

### Option 3: Single Server Deployment (VPS)

**Requirements:**
- VPS (DigitalOcean, AWS, etc.)
- Domain name (optional)

**Steps:**
```bash
# 1. SSH into your server
ssh user@your-server

# 2. Install Node.js & MongoDB
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb

# 3. Clone/Upload your code
git clone <your-repo>
cd quiz generator

# 4. Install dependencies
cd backend && npm install
cd ../frontend && npm install && npm run build

# 5. Use PM2 to keep server running
npm install -g pm2
cd backend
pm2 start server.js --name "ai-study-backend"

# 6. Setup Nginx as reverse proxy
sudo apt install nginx
# Configure nginx to serve frontend and proxy backend
```

---

## 📦 Pre-Deployment Checklist

### 1. **Database: Switch to MongoDB Atlas** (Cloud)
```bash
# Current: mongodb://localhost:27017
# Change to: mongodb+srv://<username>:<password>@cluster.mongodb.net/

# Get free cluster at: https://www.mongodb.com/cloud/atlas
```

### 2. **Update Frontend API URL**
In `frontend/vite.config.js`:
```javascript
export default defineConfig({
  // ...
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://your-backend-url.com')
  }
})
```

Or in `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.com';
```

### 3. **Environment Variables**
Never commit `.env` to Git! Use platform-specific env vars:

**Vercel** (Frontend):
```
# Dashboard → Settings → Environment Variables
VITE_API_URL=https://your-backend.render.com
```

**Render/Railway** (Backend):
```
GEMINI_API_KEY=AIzaSyBz1HLgYprqo1TfRe3u6cImXA1zuQU1nHU
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super-secret-key-change-this
PORT=8080
```

### 4. **Security Updates**
- Change `JWT_SECRET` to a strong random string
- Use HTTPS (most platforms auto-provide)
- Enable CORS only for your frontend domain

---

## 🎯 Quick Deploy Steps (Beginner-Friendly)

### For Showcase/Portfolio:

**Easiest: Vercel (Frontend) + Render (Backend)**

1. **Prepare code:**
   ```bash
   # Add to .gitignore
   echo "node_modules" >> .gitignore
   echo ".env" >> .gitignore
   
   # Initialize git
   git init
   git add .
   git commit -m "Initial commit"
   
   # Push to GitHub
   gh repo create ai-study-companion --public
   git push origin main
   ```

2. **Deploy Frontend:**
   - Go to https://vercel.com
   - Import your GitHub repo
   - Select `frontend` folder
   - Add env var: `VITE_API_URL=<backend-url-from-step-3>`
   - Deploy!

3. **Deploy Backend:**
   - Go to https://render.com
   - "New Web Service"
   - Connect GitHub repo
   - Select `backend` folder
   - Add environment variables (Gemini key, MongoDB URI, JWT secret)
   - Deploy!

4. **Database:**
   - Go to https://cloud.mongodb.com
   - Create free cluster
   - Get connection string
   - Add to Render env vars

---

## 📊 Expected Performance

- **Free Tier**: 1,500 AI requests/day
- **Perfect for**: Portfolio, demos, small user base (10-50 users/day)
- **Need more?**: Upgrade Gemini to paid tier ($0.001-$0.004 per request)

---

## 🔗 Live Demo Example URLs

After deployment:
- Frontend: `https://ai-study-companion.vercel.app`
- Backend: `https://ai-study-backend.onrender.com`

Add these to your resume/portfolio!

---

##  Next Steps

1. ✅ Test locally first (you're here!)
2. 🌐 Get MongoDB Atlas account
3. 📤 Push code to GitHub
4. 🚀 Deploy to Vercel + Render
5. 🎉 Share your live link!

**Need help with deployment? Let me know which platform you prefer!**
