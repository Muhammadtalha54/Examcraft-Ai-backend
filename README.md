# ExamCraft AI - Backend

Complete serverless backend for ExamCraft AI built with Node.js, Express, MongoDB Atlas, and deployed on Vercel.

## Features

- **Authentication**: Signup, Login, Email Verification, Forgot Password
- **Content Generation**: MCQs, Short Questions, Long Questions using Gemini AI
- **File Processing**: PDF text extraction and Image OCR
- **Static Content**: Privacy Policy, Terms & Conditions
- **App Ratings**: User rating system
- **Security**: JWT tokens, password hashing, input validation

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env` file with:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/examcraft
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES=1d
EMAIL_USER=your-smtp-email@gmail.com
EMAIL_PASS=your-smtp-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
GEMINI_API_KEY=your-gemini-api-key-here
BASE_URL=https://your-vercel-domain.vercel.app
```

### 3. Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verifyEmail?token=<token>` - Verify email
- `POST /api/auth/forgotPassword` - Request password reset
- `POST /api/auth/resetPassword` - Reset password

### Content Generation
- `POST /api/generate/mcq` - Generate MCQs from file
- `POST /api/generate/short` - Generate short questions
- `POST /api/generate/long` - Generate long questions

### Static Content
- `GET /api/info/privacy` - Privacy policy
- `GET /api/info/terms` - Terms & conditions

### Ratings
- `POST /api/rate` - Submit app rating
- `GET /api/rate` - Get rating statistics

## File Upload Format

All generation endpoints accept:
- **PDF files** (max 10MB)
- **Image files** (JPG, PNG, JPEG - max 10MB)

Example request:
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('count', '5');
formData.append('difficulty', 'medium');

fetch('/api/generate/mcq', {
  method: 'POST',
  body: formData
});
```

## Response Format

All APIs return consistent JSON:
```json
{
  "success": true/false,
  "message": "Descriptive message",
  "data": {}
}
```

## Database Schema

### Users Collection
```javascript
{
  "_id": ObjectId,
  "email": "string",
  "password": "hashed string",
  "isVerified": "boolean",
  "createdAt": "date"
}
```

### Ratings Collection
```javascript
{
  "_id": ObjectId,
  "userId": "ObjectId or null",
  "rating": 1-5,
  "comment": "string",
  "createdAt": "date"
}
```

## Security Features

- **JWT Authentication** for protected routes
- **Password Hashing** with bcryptjs
- **Email Verification** required for login
- **Input Validation** on all endpoints
- **File Type Validation** for uploads
- **Rate Limiting** via Vercel

## Development

```bash
# Local development
npm run dev

# Build for production
npm run build

# Deploy to Vercel
npm run deploy
```

## Error Handling

The backend handles:
- Invalid file types/sizes
- Empty or unreadable PDFs/images
- Gemini API failures with retry logic
- MongoDB connection errors
- Authentication failures
- Input validation errors

## Folder Structure

```
/api
  /auth
    login.js
    signup.js
    verifyEmail.js
    forgotPassword.js
  /generate
    mcq.js
    short.js
    long.js
  /info
    privacy.js
    terms.js
  rate.js
/services
  authService.js
  pdfService.js
  imageService.js
  geminiService.js
  infoService.js
  ratingService.js
/utils
  validator.js
  responseFormatter.js
  tokenHandler.js
/config
  db.js
  env.js
  models.js
```

## Support

For issues or questions, please check the error messages returned by the API endpoints. All errors include descriptive messages to help with troubleshooting.