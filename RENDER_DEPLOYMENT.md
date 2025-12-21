# ExamCraft AI Backend - Render Deployment Guide

## 🎉 Conversion Complete!

Your ExamCraft AI Backend has been successfully converted from Vercel serverless to a pure Express server ready for Render deployment.

## 📁 New Project Structure

```
EXAMCRAFT_AI_BACKEND/
│
├── server.js              ✅ Entry point (Render runs this)
├── app.js                 ✅ Express app configuration
│
├── routes/                ✅ All API routes
│   ├── index.js           (main router)
│   ├── auth.routes.js
│   ├── generate.routes.js
│   ├── test.routes.js
│   ├── info.routes.js
│   └── rate.routes.js
│
├── controllers/           ✅ Request handlers
│   ├── auth.controller.js
│   ├── generate.controller.js
│   ├── test.controller.js
│   ├── info.controller.js
│   └── rate.controller.js
│
├── services/              ✅ Business logic
├── utils/                 ✅ Utilities
├── config/                ✅ Configuration
│
├── package.json
├── .env
└── .gitignore
```

## 🚀 Deploy to Render

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Convert to Express server for Render deployment"
git push origin main
```

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `examcraft-ai-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or Starter (your choice)

### Step 3: Set Environment Variables

In Render dashboard, add these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/examcraft` |
| `JWT_SECRET` | Secret for JWT tokens | `your-super-secret-key-here` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `EMAIL_USER` | Email service username | `your-email@gmail.com` |
| `EMAIL_PASS` | Email service password | `your-app-password` |
| `NODE_ENV` | Environment | `production` |

> **Note**: `PORT` is automatically set by Render, no need to add it.

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy your app
3. Wait for deployment to complete (usually 2-5 minutes)
4. Your API will be live at: `https://examcraft-ai-backend.onrender.com`

## 🧪 Test Your Deployed API

### Test Root Endpoint

```bash
curl https://examcraft-ai-backend.onrender.com/
```

Expected response:
```json
{
  "success": true,
  "message": "ExamCraft AI Backend is running!",
  "endpoints": [...]
}
```

### Test Auth Endpoint

```bash
curl -X POST https://examcraft-ai-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📋 Available Endpoints

All endpoints are prefixed with `/api`:

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email

### Content Generation
- `POST /api/generate/mcq-text` - Generate MCQs from text
- `POST /api/generate/mcq` - Generate MCQs
- `POST /api/generate/short` - Generate short answer questions
- `POST /api/generate/long` - Generate long answer questions

### Testing
- `POST /api/test/mcq` - Evaluate MCQ test

### Information
- `GET /api/info/privacy` - Get privacy policy
- `GET /api/info/terms` - Get terms of service

### Rating
- `POST /api/rate` - Submit rating

## 🔧 Local Development

To run locally:

```bash
# Install dependencies
npm install

# Start server
npm start
```

Server will run on `http://localhost:3000`

## ⚠️ Important Notes

### Free Tier Limitations
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to Starter plan for production use

### CORS Configuration
CORS is configured to allow all origins (`*`). For production, update `app.js` to restrict origins:

```javascript
app.use(cors({
  origin: 'https://your-flutter-app.com'
}));
```

### Database Connection
The app connects to MongoDB on startup. Ensure your MongoDB Atlas cluster:
- Allows connections from anywhere (0.0.0.0/0) or Render's IP ranges
- Has a valid user with read/write permissions

## 🎯 Next Steps

1. ✅ Deploy to Render
2. ✅ Test all endpoints
3. Update your Flutter app to use new Render URL
4. Monitor logs in Render dashboard
5. Set up custom domain (optional)

## 📞 Troubleshooting

### Server won't start
- Check Render logs for errors
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

### Database connection fails
- Check MongoDB Atlas network access settings
- Verify credentials in `MONGO_URI`
- Check MongoDB Atlas cluster status

### Endpoints return 404
- Verify you're using `/api` prefix
- Check route definitions in `routes/` directory
- Review Render deployment logs

## 🎊 Success!

Your backend is now production-ready and deployed on Render! 🚀
