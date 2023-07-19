const express = require('express');
const path = require('path');
const db = require('../database/db');
const authentication = require('../middleware/auth')
const router= express.Router();
const deleteExpenseController = require('../controller/deleteExpenseController');


router.delete('/expense/delete-expense/:id',deleteExpenseController.deleteExpense);

module.exports=router;