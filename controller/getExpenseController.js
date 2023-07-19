// 
const path = require('path');
const db = require('../database/db');
const expense = require('../models/expense');
const jwt = require('jsonwebtoken');

function getExpensePage(req, res) {
  res.sendFile(path.join(__dirname, '../views/expense.html'));
}

// async function fetchExpense(req, res) {
//   try {
    
    
//     const expenses = await expense.findAll({ where: { userId: req.user.id } });
//   res.json(expenses);
//   } catch (error) {
//     console.error('Error retrieving expenses:', error);
//     res.status(500).send('Internal server error');
//   }
// }

async function fetchExpense(req, res) {
  try {
    let page = +req.query.page || 1;
    const pageSize = +req.query.pagesize || 5;
    let totalexpense = await expense.count();
    console.log(totalexpense);
    let expenses = await expense.findAll({
      where: { userId: req.user.id },
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });
    res.status(201).json({
      expenses: expenses,
      currentPage: page,
      hasNextPage: page * pageSize < totalexpense,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalexpense / pageSize),
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getExpensePage,
  fetchExpense,
};
