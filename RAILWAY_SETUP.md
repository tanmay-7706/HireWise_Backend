# Railway Deployment Setup

## Environment Variables Required

Set these environment variables in Railway Dashboard:

### Required Variables:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_key_here
FRONTEND_URL=https://hirewisefrontend.vercel.app
PORT=5001
NODE_ENV=production
BCRYPT_ROUNDS=12
```

### Optional Variables:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Setup Steps:

1. Go to Railway Dashboard → Your Project → Variables
2. Add each environment variable listed above
3. Replace placeholder values with your actual credentials
4. Deploy the application

## Important Notes:

- **NEVER** commit `.env` files to the repository
- Use Railway's environment variables for production
- Ensure MongoDB Atlas allows Railway's IP addresses
- Use strong, unique passwords and secrets