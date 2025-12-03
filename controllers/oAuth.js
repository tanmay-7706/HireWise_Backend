const axios = require('axios');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Handle Google Login/Signup
 * Accepts an access token from the frontend, fetches user info from Google,
 * finds or creates the user, and returns a JWT.
 */
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Google token is required'
            });
        }

        console.log('🔐 Received Google token, fetching user info...');

        // 1. Use the access token to get user info from Google
        const googleResponse = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
        );

        const { email, name, picture, sub: googleId } = googleResponse.data;

        if (!email) {
            console.error('❌ Email not found in Google response');
            return res.status(400).json({
                success: false,
                message: 'Email not found in Google account'
            });
        }

        console.log(`🔐 Google Auth processing for: ${email}`);

        // 2. Check if user exists in our database
        let user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            console.log('✅ User found in DB. Logging in...');
        } else {
            console.log('🆕 User not found. Creating new account...');

            // 3. Create new user if not exists
            // Generate a random secure password since they use Google Auth
            const randomPassword = Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8) +
                "A1!";

            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = await User.create({
                name: name || 'Google User',
                email: email.toLowerCase(),
                password: hashedPassword,
            });

            console.log('✅ New user created:', user.email);
        }

        // 4. Generate JWT Token (Same logic as standard login)
        const jwtToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 5. Return success response
        return res.status(200).json({
            success: true,
            message: 'Google login successful',
            data: {
                token: jwtToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    picture: picture // Return google picture if you want to use it in frontend
                }
            }
        });

    } catch (error) {
        console.error('❌ Google Auth Error:', error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: 'Google authentication failed',
            error: error.response?.data?.error_description || error.message
        });
    }
};

module.exports = { googleLogin };
