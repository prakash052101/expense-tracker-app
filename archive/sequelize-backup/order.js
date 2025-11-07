const  { DataTypes } = require('sequelize');
const sequelize = require('../database/db');



const Order = sequelize.define('order',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
   paymentid:DataTypes.STRING,
   orderid:DataTypes.STRING,
   status:DataTypes.STRING,
});

module.exports=Order;