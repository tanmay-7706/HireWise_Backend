# Security Notice

## Environment Variables Setup

**IMPORTANT**: Never commit `.env` files to version control.

### Setup Instructions:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your actual values:
   - Replace `MONGO_URI` with your MongoDB Atlas connection string
   - Replace `JWT_SECRET` with a strong, unique secret
   - Update other variables as needed

3. The `.env` file is already in `.gitignore` and will not be committed.

### MongoDB Atlas Security:

If your MongoDB credentials were exposed:
1. **Immediately** rotate your database password in MongoDB Atlas
2. Update the connection string in your `.env` file
3. Consider restricting IP access in MongoDB Atlas Network Access settings

### Production Deployment:

- Use environment variables in your hosting platform
- Never use development credentials in production
- Enable MongoDB Atlas IP whitelisting
- Use strong, unique passwords and JWT secrets