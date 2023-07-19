const express =require ('express');
const path = require('path');
const authentication = require('../middleware/auth')
const router =express.Router();

const leaderboardController = require('../controller/leaderboardController');

router.get('/leaderboard',authentication.authenticate,leaderboardController.getLeaderboard);

module.exports=router;