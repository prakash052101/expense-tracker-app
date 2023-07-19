const express =require ('express');
const path = require('path');
const db = require('../database/db');
const router =express.Router();

const postLoginController = require('../controller/postLoginController');



router.post('/login/success',postLoginController.loginUser);


module.exports=router;