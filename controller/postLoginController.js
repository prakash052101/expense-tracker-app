const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { generateAccessToken } = require('../utils/token');

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (user) {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (err) {
          return res.status(400).json({ message: "Something is wrong" });
        }

        if (result === true) {
          res.status(200).json({ 
            message: "successfully login", 
            token: generateAccessToken(user._id, user.ispremiumuser) 
          });
        } else {
          return res.status(400).json({ message: "password is wrong" });
        }
      });
    } else {
      return res.status(400).json({ message: "user does not exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Login failed' });
  }
}

    

module.exports = {
  loginUser,
};
