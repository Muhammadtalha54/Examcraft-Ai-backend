# 📚 ExamCraft AI Backend - Complete Documentation

## 🎯 Project Overview

ExamCraft AI is a backend API service that helps educators and students generate exam questions from text content or PDF files. It uses AI to automatically create Multiple Choice Questions (MCQs), Short Answer Questions, and Long Answer Questions.

---

## 🛠️ Technologies Used

| Technology | Purpose | Description |
|------------|---------|-------------|
| **Node.js** | Runtime Environment | JavaScript runtime for building the backend server |
| **Express.js** | Web Framework | Fast and minimal web framework for handling HTTP requests |
| **MongoDB Atlas** | Database | Cloud-based NoSQL database for storing user data |
| **Mongoose** | ODM | Object Data Modeling library for MongoDB |
| **Nodemailer** | Email Service | Sends verification and password reset emails via Gmail SMTP |
| **Gemini AI API** | Content Generation | Google's AI model for generating exam questions |
| **Multer** | File Upload | Middleware for handling PDF file uploads |
| **pdf-parse** | PDF Processing | Extracts text content from PDF files |
| **bcryptjs** | Password Hashing | Securely hashes user passwords |
| **jsonwebtoken (JWT)** | Authentication | Creates secure tokens for user sessions |
| **dotenv** | Environment Variables | Manages sensitive configuration data |
| **CORS** | Cross-Origin Requests | Allows frontend apps to communicate with the API |

---

## 📁 Project Structure

```
Examcraft Ai Backend/
│
├── config/                      # Configuration files
│   ├── db.js                   # MongoDB connection setup
│   ├── env.js                  # Environment variables loader
│   └── models.js               # User database schema
│
├── controllers/                 # Request handlers (business logic)
│   ├── auth.controller.js      # Handles signup, login, password reset
│   ├── generate.controller.js  # Handles question generation
│   ├── info.controller.js      # Handles privacy/terms pages
│   ├── rate.controller.js      # Handles rating system
│   └── test.controller.js      # Handles test-related features
│
├── middleware/                  # Custom middleware functions
│   └── upload.middleware.js    # Multer configuration for PDF uploads
│
├── routes/                      # API route definitions
│   ├── auth.routes.js          # Authentication routes
│   ├── generate.routes.js      # Question generation routes
│   ├── info.routes.js          # Info pages routes
│   ├── rate.routes.js          # Rating routes
│   ├── test.routes.js          # Test routes
│   └── index.js                # Main router combining all routes
│
├── services/                    # Core business logic
│   ├── authService.js          # User authentication logic
│   ├── emailService.js         # Email sending logic
│   ├── geminiService.js        # AI question generation
│   ├── pdfService.js           # PDF text extraction
│   ├── infoService.js          # Info content management
│   └── ratingService.js        # Rating system logic
│
├── utils/                       # Helper functions
│   ├── responseFormatter.js    # Standardizes API responses
│   ├── tokenHandler.js         # JWT token creation/verification
│   └── validator.js            # Input validation (email, password)
│
├── .env                         # Environment variables (SECRET!)
├── .gitignore                  # Files to ignore in Git
├── package.json                # Project dependencies
├── server.js                   # Main server file (entry point)
└── README.md                   # Project readme
```

---

## 📄 File Descriptions

### **Configuration Files**

#### `config/db.js`
- Connects to MongoDB Atlas database
- Handles connection errors
- Logs connection status

#### `config/env.js`
- Loads environment variables from `.env` file
- Exports variables for use across the app

#### `config/models.js`
- Defines User schema (email, password, verification status)
- Creates MongoDB model for user data

---

### **Controllers** (Handle Requests)

#### `controllers/auth.controller.js`
- **signup**: Creates new user account, sends verification email
- **login**: Authenticates user, returns JWT token
- **verifyEmail**: Verifies user email with token
- **forgotPassword**: Sends password reset email
- **resetPassword**: Updates user password

#### `controllers/generate.controller.js`
- **generateMCQ**: Creates multiple choice questions
- **generateShortAnswer**: Creates short answer questions
- **generateLongAnswer**: Creates long answer questions
- Accepts both text content and PDF files

---

### **Services** (Core Logic)

#### `services/authService.js`
- Hashes passwords with bcrypt
- Creates and verifies JWT tokens
- Manages user registration and login

#### `services/emailService.js`
- Configures Nodemailer with Gmail
- Sends verification emails
- Sends password reset emails

#### `services/geminiService.js`
- Calls Google Gemini AI API
- Generates questions based on content
- Parses AI responses into JSON format

#### `services/pdfService.js`
- Extracts text from PDF files using pdf-parse
- Cleans extracted text (removes page numbers, extra spaces)
- Validates text length

---

### **Middleware**

#### `middleware/upload.middleware.js`
- Configures Multer for PDF uploads
- Stores files in memory (no disk writes)
- Limits file size to 10MB
- Only accepts PDF files

---

### **Utils** (Helper Functions)

#### `utils/responseFormatter.js`
- Creates consistent API responses
- Format: `{ success: true/false, message: "...", data: {...} }`

#### `utils/tokenHandler.js`
- Generates JWT tokens for authentication
- Generates email verification tokens
- Generates password reset tokens

#### `utils/validator.js`
- Validates email format
- Validates password strength (8+ chars, uppercase, lowercase, number)

---

## 🚀 How to Run This Project

### **Prerequisites**
- Node.js installed (v14 or higher)
- MongoDB Atlas account
- Gmail account with App Password enabled
- Gemini API key from Google AI Studio

### **Step 1: Install Dependencies**
```bash
npm install
```

### **Step 2: Configure Environment Variables**
Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
JWT_EXPIRES=1d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
GEMINI_API_KEY=your_gemini_api_key
BASE_URL=http://localhost:3000
```

### **Step 3: Start the Server**
```bash
node server.js
```

Server will run on: `http://localhost:3000`

---

## 🔄 API Flow & Endpoints

### **Authentication Flow**

#### 1️⃣ **User Signup**
```
POST /api/auth/signup
Body: { "email": "user@example.com", "password": "Password123" }
```
**Flow:**
1. User sends email and password
2. System validates input
3. Password is hashed
4. User saved to database (unverified)
5. Verification email sent
6. User clicks email link to verify

---

#### 2️⃣ **Email Verification**
```
GET /api/auth/verify-email?token=xyz123
```
**Flow:**
1. User clicks link in email
2. System verifies token
3. User account marked as verified
4. User can now login

---

#### 3️⃣ **User Login**
```
POST /api/auth/login
Body: { "email": "user@example.com", "password": "Password123" }
```
**Flow:**
1. User sends credentials
2. System checks if email exists
3. Password compared with hashed version
4. JWT token generated and returned
5. User can access protected routes

---

#### 4️⃣ **Forgot Password**
```
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }
```
**Flow:**
1. User requests password reset
2. System checks if email exists
3. Reset token generated
4. Email sent with reset link
5. Link expires in 1 hour

---

#### 5️⃣ **Reset Password**
```
GET /api/auth/reset-password?token=xyz123
(Shows HTML form)

POST /api/auth/reset-password
Body: { "token": "xyz123", "newPassword": "NewPassword123" }
```
**Flow:**
1. User clicks reset link in email
2. Web form displayed
3. User enters new password
4. Password validated and hashed
5. Database updated
6. User can login with new password

---

### **Question Generation Flow**

#### 6️⃣ **Generate MCQs**
```
POST /api/generate/mcq
Body (Text): { "content": "Your text here", "count": 5, "difficulty": "medium" }
OR
Body (PDF): FormData with file field
```
**Flow:**
1. User uploads PDF or sends text
2. If PDF: Text extracted using pdf-parse
3. Text sent to Gemini AI
4. AI generates MCQs in JSON format
5. Questions returned to user

---

#### 7️⃣ **Generate Short Answer Questions**
```
POST /api/generate/short
Body: { "content": "Your text here", "count": 5, "difficulty": "medium" }
```
**Flow:**
1. Same as MCQ but generates short answer questions
2. Each question has a brief answer

---

#### 8️⃣ **Generate Long Answer Questions**
```
POST /api/generate/long
Body: { "content": "Your text here", "count": 3, "difficulty": "hard" }
```
**Flow:**
1. Same as MCQ but generates detailed questions
2. Each question has a comprehensive answer

---

## 📋 Complete API List

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create new account | No |
| POST | `/api/auth/login` | Login to account | No |
| GET | `/api/auth/verify-email` | Verify email address | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| GET | `/api/auth/reset-password` | Show reset form | No |
| POST | `/api/auth/reset-password` | Update password | No |
| POST | `/api/generate/mcq` | Generate MCQs | Yes |
| POST | `/api/generate/short` | Generate short questions | Yes |
| POST | `/api/generate/long` | Generate long questions | Yes |
| GET | `/api/info/privacy` | Get privacy policy | No |
| GET | `/api/info/terms` | Get terms of service | No |
| POST | `/api/rate` | Submit rating | Yes |

---

## 🔐 Security Features

1. **Password Hashing**: Passwords stored with bcrypt (12 rounds)
2. **JWT Tokens**: Secure authentication tokens
3. **Email Verification**: Users must verify email before login
4. **Token Expiry**: Verification tokens expire after 24 hours, reset tokens after 1 hour
5. **Input Validation**: Email and password format validation
6. **CORS Protection**: Controlled cross-origin access
7. **File Upload Limits**: Max 10MB PDF files only

---

## 🧪 Testing the API

### Using Postman:

1. **Signup**
   - Method: POST
   - URL: `http://localhost:3000/api/auth/signup`
   - Body (JSON): `{ "email": "test@example.com", "password": "Test1234" }`

2. **Generate MCQs**
   - Method: POST
   - URL: `http://localhost:3000/api/generate/mcq`
   - Body (JSON): `{ "content": "Your study material here", "count": 5 }`

3. **Upload PDF**
   - Method: POST
   - URL: `http://localhost:3000/api/generate/mcq`
   - Body (form-data): 
     - Key: `file`, Type: File, Value: [Select PDF]
     - Key: `count`, Type: Text, Value: `5`

---

## 🐛 Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution**: Check your `MONGO_URI` in `.env` file

### Issue: "Email not sending"
**Solution**: 
1. Enable 2FA on Gmail
2. Generate App Password
3. Use App Password in `.env` (remove spaces)

### Issue: "Gemini API error"
**Solution**: Verify your `GEMINI_API_KEY` is correct

### Issue: "PDF text extraction failed"
**Solution**: Ensure PDF is text-based (not scanned images)

---

## 📞 Support

For issues or questions, check the logs in your terminal. The server logs all requests with detailed information including:
- Request method and URL
- Request headers
- Request body
- MongoDB connection status
- API call results

---

## 📝 Notes

- Always keep your `.env` file secret
- Never commit `.env` to Git
- Use strong JWT secrets in production
- Consider rate limiting for production use
- Monitor Gemini API usage for costs

---

**Made with ❤️ for ExamCraft AI**
