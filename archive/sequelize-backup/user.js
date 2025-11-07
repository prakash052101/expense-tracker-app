const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const User = sequelize.define('user',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
  },
  ispremiumuser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  },
  totalamount: { 
  type:  DataTypes.INTEGER,
  defaultValue: false
  }
});

module.exports= User;