# HireWise Backend

## Project Overview

HireWise is a modern Resume Screener application designed to streamline the hiring process. The backend provides secure authentication, user management, and API services for the resume screening platform.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Deployment**: Railway

## Features Implemented

### 🔐 Authentication System
- User registration with email validation
- Secure login with JWT token generation
- Password hashing using bcrypt (12 salt rounds)
- Protected routes with JWT middleware

### 👤 User Management
- User profile creation and retrieval
- Email uniqueness validation
- Secure password storage
- User data sanitization

### 🛡️ Security Features
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Error handling without data leaks
- Graceful server shutdown
- MongoDB injection prevention

### 🌐 API Endpoints

#### Authentication Routes (`/api/auth`)
- `POST /signup` - User registration
- `POST /login` - User authentication

#### User Routes (`/api/user`)
- `GET /me` - Get current user profile (protected)

## Project Structure

```
hirewise-backend/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   ├── auth.js            # JWT authentication
│   └── errorHandler.js    # Error handling
├── models/
│   └── User.js            # User schema
├── routes/
│   ├── auth.js            # Authentication routes
│   └── user.js            # User routes
├── .env                   # Environment variables
├── package.json           # Dependencies
└── server.js              # Main server file
```

## Environment Variables

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb_atlas_connection_string
JWT_SECRET=secure_jwt_secret
FRONTEND_URL=https://hirewisefrontend.vercel.app
BCRYPT_ROUNDS=12
```

## API Response Format

All API responses follow a consistent structure:

```json
{
  "success": boolean,
  "message": string,
  "data": object | null
}
```

## Installation & Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`
4. Start development server: `npm run dev`
5. Start production server: `npm start`

## Database Schema

### User Model
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, validated),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

The backend is deployed on Railway with automatic deployments from the main branch.

**Live Backend API**: https://hirewise.up.railway.app

**Frontend Application**: https://hirewisefrontend.vercel.app