const express =require ('express');
const path = require('path');
const authentication = require('../middleware/auth')
const router =express.Router();

const premiumController = require('../controller/premiumController');


router.get('/buypremium',authentication.authenticate,premiumController.purchasePremium)
router.post('/updatetransaction',authentication.authenticate,premiumController.updateOrder);
router.post('/updatefailure',authentication.authenticate,premiumController.updateFailure)


module.exports=router;