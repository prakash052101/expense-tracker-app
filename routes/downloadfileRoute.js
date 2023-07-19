const express = require('express');
const path = require('path');
const authentication = require('../middleware/auth')
const router= express.Router();
const downloadfileController = require('../controller/downloadfileController');


router.get('/expense/download',authentication.authenticate,downloadfileController.download);
router.get('/expense/show-downloadLink',authentication.authenticate,downloadfileController.downloadLinks);

module.exports=router;