const path = require('path');
const Expense = require('../models/expense.model');

function getExpensePage(req, res) {
  res.sendFile(path.join(__dirname, '../views/expense.html'));
}

async function fetchExpense(req, res) {
  try {
    let page = +req.query.page || 1;
    const pageSize = +req.query.pagesize || 5;
    let totalexpense = await Expense.countDocuments({ userId: req.user._id });
    console.log(totalexpense);
    let expenses = await Expense.find({ userId: req.user._id })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    
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
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
}

module.exports = {
  getExpensePage,
  fetchExpense,
};
