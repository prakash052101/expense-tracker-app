const path = require('path');
const db = require('../database/db');

function getLoginPage(req,res){
    res.sendFile(path.join(__dirname,'../views/login.html'))
}

module.exports={
    getLoginPage,
}