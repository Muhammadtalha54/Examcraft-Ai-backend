# 🚀 Render Optimization - Keep Your App Alive

## 🎯 Problem

Render's free tier puts your app to sleep after 15 minutes of inactivity. This causes:
- ❌ First request takes 30-60 seconds (cold start)
- ❌ Poor user experience
- ❌ Timeouts on mobile apps

## ✅ Solution: Keep-Alive Service

Use a free ping service to keep your app awake!

---

## 🔧 Option 1: UptimeRobot (Recommended)

### Step 1: Create Account
1. Go to [UptimeRobot.com](https://uptimerobot.com/)
2. Sign up for FREE account
3. Verify your email

### Step 2: Add Monitor
1. Click **"+ Add New Monitor"**
2. Configure:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: ExamCraft AI Backend
   - **URL**: `https://examcraft-ai-backend.onrender.com`
   - **Monitoring Interval**: 5 minutes (free tier)
3. Click **"Create Monitor"**

### Step 3: Done!
✅ Your app will be pinged every 5 minutes
✅ Stays awake 24/7
✅ Free forever

---

## 🔧 Option 2: Cron-Job.org

### Step 1: Create Account
1. Go to [Cron-Job.org](https://cron-job.org/)
2. Sign up for FREE account

### Step 2: Create Cron Job
1. Click **"Create cronjob"**
2. Configure:
   - **Title**: Keep ExamCraft Alive
   - **Address**: `https://examcraft-ai-backend.onrender.com`
   - **Schedule**: Every 10 minutes
3. Click **"Create cronjob"**

### Step 3: Done!
✅ Pings every 10 minutes
✅ Keeps app awake

---

## 🔧 Option 3: Custom Ping Script (Advanced)

If you have another server or computer running 24/7:

```javascript
// ping-server.js
const axios = require('axios');

const RENDER_URL = 'https://examcraft-ai-backend.onrender.com';
const INTERVAL = 10 * 60 * 1000; // 10 minutes

setInterval(async () => {
  try {
    const response = await axios.get(RENDER_URL);
    console.log(`✅ Ping successful at ${new Date().toISOString()}`);
  } catch (error) {
    console.error(`❌ Ping failed: ${error.message}`);
  }
}, INTERVAL);

console.log(`🔄 Pinging ${RENDER_URL} every 10 minutes...`);
```

Run with: `node ping-server.js`

---

## 📊 Monitoring Dashboard

### UptimeRobot Dashboard Shows:
- ✅ Uptime percentage
- ✅ Response time
- ✅ Downtime alerts
- ✅ Status history

### Benefits:
- 📧 Email alerts if server goes down
- 📊 Performance monitoring
- 📈 Uptime statistics

---

## ⚠️ Important Notes

### Free Tier Limits
- **Render Free**: 750 hours/month (enough for 24/7 with ping)
- **UptimeRobot Free**: 50 monitors, 5-minute intervals
- **Cron-Job.org Free**: Unlimited jobs, 1-minute minimum interval

### Best Practices
1. ✅ Use 5-10 minute intervals (not too frequent)
2. ✅ Ping the root endpoint `/` (fastest response)
3. ✅ Set up email alerts for downtime
4. ✅ Monitor response times

### Alternative: Upgrade to Paid
If you need guaranteed uptime:
- **Render Starter**: $7/month (no sleep, better performance)
- Worth it for production apps!

---

## 🎯 Recommended Setup

**For Development/Testing:**
- ✅ Use UptimeRobot (free)
- ✅ 5-minute ping interval
- ✅ Email alerts enabled

**For Production:**
- ✅ Upgrade to Render Starter ($7/month)
- ✅ No sleep, guaranteed uptime
- ✅ Better performance

---

## ✅ Quick Setup Checklist

- [ ] Choose ping service (UptimeRobot recommended)
- [ ] Create free account
- [ ] Add monitor with your Render URL
- [ ] Set interval to 5-10 minutes
- [ ] Enable email alerts
- [ ] Test by checking dashboard
- [ ] Verify app stays awake

---

## 🧪 Test It Works

1. Wait 20 minutes without accessing your app
2. Try to access: `https://examcraft-ai-backend.onrender.com`
3. Should respond **immediately** (not 30-60 seconds)
4. ✅ If fast = Keep-alive is working!

---

**Set up UptimeRobot now to keep your app always ready!** 🚀
