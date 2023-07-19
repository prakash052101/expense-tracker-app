const express =require ('express');
const path = require('path');
const router =express.Router();

const getLoginController = require('../controller/getLoginController');


router.get('/login',getLoginController.getLoginPage);


module.exports=router;