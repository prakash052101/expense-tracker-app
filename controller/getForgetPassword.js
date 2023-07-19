const path = require('path');
const db = require('../database/db');

function getForgetPasswordPage(req,res){
    res.sendFile(path.join(__dirname,'../views/forgetpassword.html'))
}

module.exports={
    getForgetPasswordPage,
}