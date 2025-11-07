const path = require('path');

function getForgetPasswordPage(req, res) {
  res.sendFile(path.join(__dirname, '../views/forgetpassword.html'));
}

module.exports={
    getForgetPasswordPage,
}