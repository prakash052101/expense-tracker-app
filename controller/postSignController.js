const bcrypt = require('bcrypt');
const User = require('../models/user.model');

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).send('Email ID already exists');
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }
      const newUser = new User({ name: name, email: email, password: hash, totalamount: 0 });
      const result = await newUser.save();
      res.status(201).json({ newSignUp: result });
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  createUser,
};