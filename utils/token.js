const jwt = require('jsonwebtoken');

function generateAccessToken(id, ispremiumuser) {
  const secretKey = 'yourkey'; // Should match the key in middleware/auth.js
  const token = jwt.sign({ userId: id, ispremiumuser: ispremiumuser }, secretKey);
  return token;
}
module.exports={generateAccessToken,}