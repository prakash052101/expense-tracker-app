
const path = require('path');
const db = require('../database/db');
const Expense = require('../models/expense');
const User= require('../models/user');
const {json}= require('sequelize');

async function deleteExpense(req, res) {
  const t = await db.transaction();
  try {
    const expenseId = req.params.id;
    const expenseObj = await Expense.findByPk(expenseId); 
    const user = await User.findByPk(expenseObj.userId);
    user.totalamount = Number(user.totalamount) - Number(expenseObj.amount);
    await user.save({ transaction: t });
    
    await Expense.destroy({ where: { id: expenseId }, transaction: t }); // Delete the expense from the database
    await t.commit();
    res.sendStatus(201);
    
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
}

module.exports = {
  deleteExpense,
};


  

  