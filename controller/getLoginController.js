const path = require('path');

function getLoginPage(req, res) {
  res.sendFile(path.join(__dirname, '../views/login.html'));
}

module.exports={
    getLoginPage,
}