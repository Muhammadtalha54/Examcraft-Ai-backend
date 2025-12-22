# ExamCraft AI Backend - API Documentation

## 📡 Base URL

### Local Development
```
http://localhost:3000
```

### Production (Render)
```
https://your-app-name.onrender.com
```

---

## 🔐 Authentication APIs

### 1. User Signup

**Endpoint:** `POST /api/auth/signup`

**Description:** Register a new user account. A verification email will be sent.

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully. Please check your email for verification.",
  "data": {
    "_id": "user_id_here",
    "name": "John Doe",
    "email": "user@example.com",
    "isVerified": false
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already registered",
  "data": null
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token.

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

### 3. Verify Email

**Endpoint:** `POST /api/auth/verify-email`

**Description:** Verify user email with token received via email.

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "token": "verification_token_from_email"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": null
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid or expired verification token",
  "data": null
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token":"your_verification_token"}'
```

---

## ✨ Content Generation APIs

### 4. Generate MCQs

**Endpoint:** `POST /api/generate/mcq`

**Description:** Generate multiple choice questions from provided content.

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "content": "Photosynthesis is the process by which plants convert light energy into chemical energy...",
  "count": 5,
  "difficulty": "medium"
}
```

**Parameters:**
- `content` (string, required): The study material to generate questions from
- `count` (integer, optional): Number of questions (default: 5)
- `difficulty` (string, optional): "easy", "medium", or "hard" (default: "medium")

**Success Response (200):**
```json
{
  "success": true,
  "message": "MCQs generated successfully",
  "data": {
    "mcqs": [
      {
        "question": "What is photosynthesis?",
        "options": [
          "Process of converting light to chemical energy",
          "Process of plant respiration",
          "Process of water absorption",
          "Process of nutrient transport"
        ],
        "correctAnswer": "Process of converting light to chemical energy"
      }
    ]
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Content is required",
  "data": null
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/generate/mcq \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Photosynthesis is the process by which plants convert light energy into chemical energy.",
    "count": 3,
    "difficulty": "medium"
  }'
```

---

### 5. Generate MCQs (Text Version)

**Endpoint:** `POST /api/generate/mcq-text`

**Description:** Same as `/api/generate/mcq` - alternative endpoint.

**Headers, Request, Response:** Same as Generate MCQs above.

---

### 6. Generate Short Answer Questions

**Endpoint:** `POST /api/generate/short`

**Description:** Generate short answer questions from provided content.

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "content": "The water cycle describes how water evaporates from the surface...",
  "count": 5,
  "difficulty": "medium"
}
```

**Parameters:**
- `content` (string, required): The study material
- `count` (integer, optional): Number of questions (default: 5)
- `difficulty` (string, optional): "easy", "medium", or "hard" (default: "medium")

**Success Response (200):**
```json
{
  "success": true,
  "message": "Short answer questions generated successfully",
  "data": {
    "questions": [
      {
        "question": "What is the water cycle?",
        "answer": "The continuous movement of water on, above, and below the surface of the Earth."
      }
    ]
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/generate/short \
  -H "Content-Type: application/json" \
  -d '{
    "content": "The water cycle describes how water evaporates...",
    "count": 3,
    "difficulty": "easy"
  }'
```

---

### 7. Generate Long Answer Questions

**Endpoint:** `POST /api/generate/long`

**Description:** Generate detailed long answer questions from provided content.

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "content": "World War II was a global conflict that lasted from 1939 to 1945...",
  "count": 3,
  "difficulty": "hard"
}
```

**Parameters:**
- `content` (string, required): The study material
- `count` (integer, optional): Number of questions (default: 3)
- `difficulty` (string, optional): "easy", "medium", or "hard" (default: "medium")

**Success Response (200):**
```json
{
  "success": true,
  "message": "Long answer questions generated successfully",
  "data": {
    "questions": [
      {
        "question": "Discuss the major causes and consequences of World War II.",
        "answer": "World War II was caused by multiple factors including the Treaty of Versailles, economic depression, and rise of totalitarian regimes..."
      }
    ]
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/generate/long \
  -H "Content-Type: application/json" \
  -d '{
    "content": "World War II was a global conflict...",
    "count": 2,
    "difficulty": "hard"
  }'
```

---

## 📝 Test Evaluation API

### 8. Evaluate MCQ Test

**Endpoint:** `POST /api/test/mcq`

**Description:** Evaluate user's MCQ test answers and return score.

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "questions": [
    {
      "question": "What is 2+2?",
      "correctAnswer": "4"
    },
    {
      "question": "What is the capital of France?",
      "correctAnswer": "Paris"
    }
  ],
  "answers": ["4", "Paris"]
}
```

**Parameters:**
- `questions` (array, required): Array of question objects with `question` and `correctAnswer`
- `answers` (array, required): Array of user's answers in same order as questions

**Success Response (200):**
```json
{
  "success": true,
  "message": "Test evaluated successfully",
  "data": {
    "score": 2,
    "total": 2,
    "percentage": 100,
    "results": [
      {
        "question": "What is 2+2?",
        "userAnswer": "4",
        "correctAnswer": "4",
        "isCorrect": true
      },
      {
        "question": "What is the capital of France?",
        "userAnswer": "Paris",
        "correctAnswer": "Paris",
        "isCorrect": true
      }
    ]
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/test/mcq \
  -H "Content-Type: application/json" \
  -d '{
    "questions": [
      {"question": "What is 2+2?", "correctAnswer": "4"}
    ],
    "answers": ["4"]
  }'
```

---

## ℹ️ Information APIs

### 9. Get Privacy Policy

**Endpoint:** `GET /api/info/privacy`

**Description:** Retrieve the privacy policy content.

**Headers:** None required

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Privacy policy retrieved",
  "data": {
    "title": "Privacy Policy",
    "content": "<h2>Privacy Policy for ExamCraft AI</h2>..."
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/info/privacy
```

---

### 10. Get Terms of Service

**Endpoint:** `GET /api/info/terms`

**Description:** Retrieve the terms and conditions content.

**Headers:** None required

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Terms of service retrieved",
  "data": {
    "title": "Terms and Conditions",
    "content": "<h2>Terms and Conditions for ExamCraft AI</h2>..."
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/info/terms
```

---

## ⭐ Rating API

### 11. Submit Rating

**Endpoint:** `POST /api/rate`

**Description:** Submit user rating and feedback for the app.

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "rating": 5,
  "feedback": "Great app! Very helpful for studying."
}
```

**Parameters:**
- `rating` (integer, required): Rating from 1 to 5
- `feedback` (string, optional): User feedback/comment

**Success Response (200):**
```json
{
  "success": true,
  "message": "Rating submitted successfully",
  "data": null
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Rating is required",
  "data": null
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/rate \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "feedback": "Excellent app!"
  }'
```

---

## 🔄 Response Format

All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "message": "Descriptive success message",
  "data": { /* Response data object */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Descriptive error message",
  "data": null
}
```

---

## 🚨 Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created (signup) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (login failed) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🧪 Testing with Postman

### Import Collection

1. Open Postman
2. Click "Import"
3. Create new collection "ExamCraft AI"
4. Add requests for each endpoint above
5. Set base URL variable: `{{baseUrl}}` = `http://localhost:3000`

### Environment Variables

Create environment with:
- `baseUrl`: `http://localhost:3000` (local) or `https://your-app.onrender.com` (production)
- `authToken`: Save token from login response for authenticated requests (if needed in future)

---

## 📱 Flutter/Dart Integration Example

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ExamCraftAPI {
  static const String baseUrl = 'http://localhost:3000/api';
  
  // Signup
  static Future<Map<String, dynamic>> signup(String name, String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/signup'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'name': name, 'email': email, 'password': password}),
    );
    return jsonDecode(response.body);
  }
  
  // Login
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    return jsonDecode(response.body);
  }
  
  // Generate MCQs
  static Future<Map<String, dynamic>> generateMCQ(
    String content, 
    int count, 
    String difficulty
  ) async {
    final response = await http.post(
      Uri.parse('$baseUrl/generate/mcq'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'content': content,
        'count': count,
        'difficulty': difficulty,
      }),
    );
    return jsonDecode(response.body);
  }
}
```

---

## 🔧 Environment Variables

Required environment variables for the backend:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/examcraft` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-here` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `EMAIL_USER` | Email service username | `your-email@gmail.com` |
| `EMAIL_PASS` | Email service app password | `your-app-password` |
| `NODE_ENV` | Environment | `development` or `production` |
| `PORT` | Server port (auto-set by Render) | `3000` |

---

## ✅ API Status Check

**Endpoint:** `GET /`

**Description:** Check if server is running.

**Response:**
```json
{
  "success": true,
  "message": "ExamCraft AI Backend is running!",
  "endpoints": [
    "POST /api/auth/signup",
    "POST /api/auth/login",
    ...
  ]
}
```

---

## 📚 Notes

1. **Email Verification**: After signup, users must verify their email before they can login.
2. **Content Generation**: Requires valid `GEMINI_API_KEY` to work.
3. **CORS**: Currently allows all origins (`*`). Update for production.
4. **Rate Limiting**: Not implemented. Consider adding for production.
5. **Authentication**: JWT tokens are returned on login. Store securely in your Flutter app.

---

## 🎯 Quick Test Checklist

- [ ] Test signup with new email
- [ ] Test login with created account
- [ ] Test MCQ generation
- [ ] Test short answer generation
- [ ] Test long answer generation
- [ ] Test MCQ evaluation
- [ ] Test privacy policy retrieval
- [ ] Test terms retrieval
- [ ] Test rating submission

---

**Happy Testing! 🚀**
