# 🚀 Render Deployment - Quick Start

## ✅ Pre-Deployment Checklist

- [x] All APIs tested locally and working
- [x] MongoDB connected
- [x] Gemini API working
- [x] Email verification working
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Environment variables ready

---

## 📋 Step-by-Step Deployment

### **Step 1: Push to GitHub** (5 minutes)

#### A. Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - ExamCraft AI Backend"
```

#### B. Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Repository name: `examcraft-ai-backend`
3. Make it **Private** (to protect your code)
4. Click **"Create repository"**

#### C. Push Your Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/examcraft-ai-backend.git
git branch -M main
git push -u origin main
```

**⚠️ Important:** Make sure `.env` is in `.gitignore` (it already is!)

---

### **Step 2: Create Render Account** (2 minutes)

1. Go to [Render.com](https://render.com/)
2. Click **"Get Started"**
3. Sign up with GitHub (easiest option)
4. Authorize Render to access your repositories

---

### **Step 3: Create Web Service** (3 minutes)

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"**
3. Find and select `examcraft-ai-backend`
4. Click **"Connect"**

#### Configure Service:
- **Name**: `examcraft-ai-backend` (or your choice)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: (leave blank)
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: **Free** (for testing)

---

### **Step 4: Add Environment Variables** (5 minutes)

Click **"Advanced"** → **"Add Environment Variable"**

Add these **6 variables**:

| Key | Value | Where to Get |
|-----|-------|--------------|
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your-secret-key` | Any random string (keep it secret!) |
| `GEMINI_API_KEY` | `AIza...` | Your Gemini API key |
| `EMAIL_USER` | `your-email@gmail.com` | Your Gmail address |
| `EMAIL_PASS` | `your-app-password` | Gmail app password |
| `NODE_ENV` | `production` | Type exactly: production |

**📝 Copy from your `.env` file!**

---

### **Step 5: Deploy!** (5-10 minutes)

1. Click **"Create Web Service"**
2. Render will start building your app
3. Watch the logs - you'll see:
   ```
   Installing dependencies...
   Building...
   Starting server...
   MongoDB connected successfully
   Server running on port 10000
   ```
4. Wait for **"Your service is live"** message

---

### **Step 6: Get Your URL** (1 minute)

Your API will be live at:
```
https://examcraft-ai-backend.onrender.com
```

Or whatever name you chose!

---

## 🧪 Test Your Deployed API

### Test 1: Check if Server is Running

Open in browser:
```
https://your-app-name.onrender.com
```

Should see:
```json
{
  "success": true,
  "message": "ExamCraft AI Backend is running!"
}
```

### Test 2: Test Signup API

Use Postman or your HTML tester:

**POST** `https://your-app-name.onrender.com/api/auth/signup`

Body:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Test 3: Test MCQ Generation

**POST** `https://your-app-name.onrender.com/api/generate/mcq`

Body:
```json
{
  "content": "Photosynthesis is the process...",
  "count": 2,
  "difficulty": "easy"
}
```

---

## 🎯 Update Your Flutter App

In your Flutter app, change the base URL:

```dart
// Before (local)
const String baseUrl = 'http://localhost:3000';

// After (production)
const String baseUrl = 'https://your-app-name.onrender.com';
```

---

## ⚠️ Important Notes

### Free Tier Behavior
- ✅ Free forever
- ⚠️ Spins down after 15 minutes of inactivity
- ⏱️ First request after spin-down takes 30-60 seconds
- 💡 Perfect for development/testing

### MongoDB Atlas
Make sure Network Access allows:
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click "Confirm"

### Email Verification Links
Will automatically use your Render URL:
```
https://your-app-name.onrender.com/api/auth/verify-email?token=...
```

---

## 🚨 Troubleshooting

### Build Failed?
- Check Render logs for errors
- Make sure `package.json` has `"start": "node server.js"`
- Verify all dependencies are in `package.json`

### Server Crashes?
- Check environment variables are set correctly
- Look at Render logs for error messages
- Verify MongoDB connection string

### Can't Connect to Database?
- Check MongoDB Atlas Network Access (allow 0.0.0.0/0)
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas cluster is running

---

## 📊 Monitor Your App

### View Logs
1. Go to Render Dashboard
2. Click your service
3. Click **"Logs"** tab
4. See real-time logs

### Check Status
- **Live** = Working ✅
- **Building** = Deploying 🔄
- **Failed** = Error ❌

---

## 🎊 You're Done!

Your ExamCraft AI Backend is now:
- ✅ Deployed on Render
- ✅ Accessible from anywhere
- ✅ Ready for your Flutter app
- ✅ Production-ready!

**Next:** Update your Flutter app to use the new Render URL! 🚀

---

## 📞 Need Help?

- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Your detailed guide: `RENDER_DEPLOYMENT.md`
