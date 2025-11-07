require('dotenv').config();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const ForgotPassword = require('../models/forgotpassword.model');

const getResetPassword = async (req, res) => {
  try {
    const forgetPasswordId = req.params.id;
    console.log(forgetPasswordId);
    const forgetpassword = await ForgotPassword.findById(forgetPasswordId);
    if (forgetpassword && forgetpassword.active) {
      forgetpassword.active = false;
      await forgetpassword.save();
      res.status(200).send(`
        <html>
          <form action="/password/updatepassword/${forgetPasswordId}" method="get">
            <label for="newpassword">Enter New password</label>
            <input name="newpassword" type="password" required></input>
            <button>Reset Password</button>
          </form>
        </html>
      `);
    } else {
      res.status(404).send("Invalid or expired password reset request");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error processing password reset");
  }
};

const getUpdatePassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const newpassword = req.query.newpassword;
    const details = await ForgotPassword.findById(id);
    const user = await User.findById(details.userId);
    if (user) {
      const saltRounds = 10;
      bcrypt.hash(newpassword, saltRounds, async (err, hash) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error updating password" });
        }
        user.password = hash;
        await user.save();
        res.status(201).json({ message: "Password updated successfully" });
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating password" });
  }
};


  module.exports = {
    getResetPassword,getUpdatePassword
  }