const express = require('express');
const router = express.Router();

const postForgetpasswordController = require('../controller/postForgetPassword');



router.post('/password/forgetpassword',postForgetpasswordController.postForgetPassword);


module.exports=router;