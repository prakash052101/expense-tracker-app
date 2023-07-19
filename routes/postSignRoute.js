const express =require ('express');
const path = require('path');
const db = require('../database/db');
const router =express.Router();

const postSignController = require('../controller/postSignController');

router.post('/signup',postSignController.createUser);

module.exports=router;