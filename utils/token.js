
const path = require('path');
const db = require('../database/db');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

function generateAccessToken(id,ispremiumuser) {
  const secretKey = 'Na0OzMb1PyL2cQx3KdR4wJe5SvI6fTu7HgU8tGh9VsF@iWr!EjX#qDk$YpC&lZo9Bm8nA'; // Replace with your secret key
  const token = jwt.sign({ userId: id ,ispremiumuser:ispremiumuser}, secretKey);
  return token;
}
module.exports={generateAccessToken,}