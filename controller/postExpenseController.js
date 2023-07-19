const path = require('path');
const db = require('../database/db');
const expense = require('../models/expense');
const User = require('../models/user')

async function postExpense(req, res) {
  const { amount, etype, date } = req.body;
  const t = await db.transaction();
  try {
    
    const result = await expense.create(
      {
        amount: amount,
        etype:etype,
        date:date,
        userId: req.user.id,
      },
      { transaction: t }
      );
      const oldamount = req.user.totalamount;
      const newamount = Number(oldamount) + Number(amount);
      await User.update(
        { totalamount: newamount },
        { where: { id: req.user.id }, transaction: t }
    );
    await t.commit();

    res.status(201).json({ newexpense: result });
  } catch (error) {
    await t.rollback();
    console.log(error);
    
  }
}

module.exports = {
  postExpense,
};
