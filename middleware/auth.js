const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authenticate = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    const userObj = jwt.verify(token, "yourkey");
    const user = await User.findById(userObj.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = {
  authenticate,
};
