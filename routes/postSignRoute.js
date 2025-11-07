const express = require('express');
const router = express.Router();

const postSignController = require('../controller/postSignController');

router.post('/signup',postSignController.createUser);

module.exports=router;