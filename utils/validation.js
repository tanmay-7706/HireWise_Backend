// Input validation utilities

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate email format
const isValidEmail = (email) => {
  return emailRegex.test(email);
};

// Validate password strength
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Sanitize string input
const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

// Validate required fields
const validateRequired = (fields) => {
  const errors = [];
  
  for (const [key, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${key} is required`);
    }
  }
  
  return errors;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  sanitizeString,
  validateRequired
};