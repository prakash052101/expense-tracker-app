const express =require ('express');
const path = require('path');
const db = require('../database/db');
const router =express.Router();

const postForgetpasswordController = require('../controller/postForgetPassword');



router.post('/password/forgetpassword',postForgetpasswordController.postForgetPassword);


module.exports=router;