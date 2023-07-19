require('dotenv').config(); 
const path = require('path');
const db = require('../database/db');
const expense = require('../models/expense');
const User = require('../models/user')
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const uuid = require("uuid");
const ForgetPassword = require('../models/forgetpassword');

 const postForgetPassword = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      const forgetpasswordcreate = await ForgetPassword.create({ id: uuid.v4(), active: true, userId: user.id });
     
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
        html: `<a href="http://localhost:4000/resetpassword/${forgetpasswordcreate.id}">Click to Reset Password</a>`,
        
      };
      await transporter.sendMail(msg);
      res.status(201).json({ message: "Link to reset password sent to your mail" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports={postForgetPassword,}