const  { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const expense = sequelize.define('expense',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    amount:{
        type: DataTypes.INTEGER,
        allowNull: false,
        },
    etype:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    date:{
      type: DataTypes.DATE,
      allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports= expense;