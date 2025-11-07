const express = require('express');
const authentication = require('../middleware/auth');
const router = express.Router();

const postExpenseController = require('../controller/postExpenseController');



router.post('/add-expense',authentication.authenticate,postExpenseController.postExpense);


module.exports=router;