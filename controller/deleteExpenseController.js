const Expense = require('../models/expense.model');
const User = require('../models/user.model');

async function deleteExpense(req, res) {
  try {
    const expenseId = req.params.id;
    const expenseObj = await Expense.findById(expenseId);
    
    if (!expenseObj) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    const user = await User.findById(expenseObj.userId);
    user.totalamount = Number(user.totalamount) - Number(expenseObj.amount);
    await user.save();
    
    await Expense.findByIdAndDelete(expenseId);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
}

module.exports = {
  deleteExpense,
};


  

  