const path = require('path');
const db = require('../database/db');

function getSignPage(req,res){
    res.sendFile(path.join(__dirname,'../views/index.html'))
}

module.exports={
    getSignPage,
}