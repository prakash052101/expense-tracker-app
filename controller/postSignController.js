const bcrypt = require('bcrypt');
const path = require('path');
const db = require('../database/db');
const User = require('../models/user');

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ where: { email: email } });
    if (userExists) {
      return res.status(400).send('Email ID already exists');
    }
    const saltRounds=10;
    bcrypt.hash(password,saltRounds,async(err,hash)=>{
    const result = await User.create({name:name,email:email,password:hash,totalamount:0});
    res.status(201).json({newSignUp:result});
        })
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  createUser,
};