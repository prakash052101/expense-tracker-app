const express =require ('express');
const path = require('path');
const authentication = require('../middleware/auth')
const router =express.Router();


const getExpenseController = require('../controller/getExpenseController');



router.get('/expense',getExpenseController.getExpensePage);
router.get('/fetch-expense',authentication.authenticate,  getExpenseController.fetchExpense);


module.exports=router;