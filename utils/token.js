const jwt = require('jsonwebtoken');

/**
 * Generate JWT access token with 24h expiry
 * @param {String} id - User ID
 * @param {Boolean} ispremiumuser - Premium user status
 * @param {Boolean} isAdmin - Admin status (optional)
 * @returns {String} JWT token
 */
function generateAccessToken(id, ispremiumuser, isAdmin = false) {
  const secretKey = process.env.JWT_SECRET || 'yourkey';
  const token = jwt.sign(
    { 
      userId: id, 
      ispremiumuser: ispremiumuser,
      isAdmin: isAdmin
    }, 
    secretKey,
    { expiresIn: '24h' }
  );
  return token;
}

module.exports = {
  generateAccessToken
};