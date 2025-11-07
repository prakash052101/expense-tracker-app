const path = require('path');

function getSignPage(req, res) {
  res.sendFile(path.join(__dirname, '../views/index.html'));
}

module.exports={
    getSignPage,
}