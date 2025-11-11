const jwt = require('jsonwebtoken');

// JWT Authentication middleware with enhanced security
const auth = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.', 
        data: null 
      });
    }

    // Check if token follows Bearer format
    const [scheme, token] = authHeader.split(' ');
    
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. Invalid token format.', 
        data: null 
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };
    
    next();
    
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. Token expired.', 
        data: null 
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. Invalid token.', 
        data: null 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. Token verification failed.', 
      data: null 
    });
  }
};

module.exports = auth;