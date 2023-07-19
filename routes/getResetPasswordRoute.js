const express =require ('express');
const path = require('path');
const router =express.Router();

const getResetPasswordController = require('../controller/getResetPasswordController');


router.get('/resetpassword/:id',getResetPasswordController.getResetPassword);
router.get('/password/updatepassword/:id',getResetPasswordController.getUpdatePassword)


module.exports=router;