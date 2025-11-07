const Expense = require('../models/expense.model');
const User = require('../models/user.model');

async function postExpense(req, res) {
  const { amount, etype, date } = req.body;
  try {
    const newExpense = new Expense({
      amount: amount,
      etype: etype,
      date: date,
      userId: req.user._id,
    });
    const result = await newExpense.save();
    
    const oldamount = req.user.totalamount;
    const newamount = Number(oldamount) + Number(amount);
    await User.findByIdAndUpdate(req.user._id, { totalamount: newamount });

    res.status(201).json({ newexpense: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
}

module.exports = {
  postExpense,
};
