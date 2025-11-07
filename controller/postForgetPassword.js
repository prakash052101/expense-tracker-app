require('dotenv').config();
const User = require('../models/user.model');
const nodemailer = require("nodemailer");
const uuid = require("uuid");
const ForgotPassword = require('../models/forgotpassword.model');

const postForgetPassword = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const forgetpasswordcreate = new ForgotPassword({ 
        _id: uuid.v4(), 
        active: true, 
        userId: user._id 
      });
      await forgetpasswordcreate.save();

      const transporter = nodemailer.createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        auth: {
          user: `${process.env.user}`,
          pass: `${process.env.pass}`,
        },
      });
      const msg = {
        from: "sender@example.com",
        to: email,
        subject: "Password Reset",
        text: "and easy to do anywhere, even with Node.js",
        html: `<a href="http://localhost:4000/resetpassword/${forgetpasswordcreate._id}">Click to Reset Password</a>`,
      };
      await transporter.sendMail(msg);
      res.status(201).json({ message: "Link to reset password sent to your mail" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to process password reset' });
  }
};

module.exports={postForgetPassword,}