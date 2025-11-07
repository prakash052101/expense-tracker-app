const express = require('express');
const router = express.Router();

const postLoginController = require('../controller/postLoginController');



router.post('/login/success',postLoginController.loginUser);


module.exports=router;