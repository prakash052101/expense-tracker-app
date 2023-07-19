const express =require ('express');
const path = require('path');
const router =express.Router();

const getForgetPasswordController = require('../controller/getForgetPassword');


router.get('/forget-password',getForgetPasswordController.getForgetPasswordPage);


module.exports=router;