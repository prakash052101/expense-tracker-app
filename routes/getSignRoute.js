const express =require ('express');
const path = require('path');
const router =express.Router();

const getSignController = require('../controller/getSignController');


router.get('/',getSignController.getSignPage);


module.exports=router;