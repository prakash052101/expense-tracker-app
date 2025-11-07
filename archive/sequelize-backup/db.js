const mysql2 =require('mysql2');
const Sequelize = require('sequelize');
const dotenv= require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER,process.env.DB_PASSWORD,{
    host:process.env.DB_HOST,
    dialect: 'mysql'
});

sequelize
.authenticate()
.then(()=>{
    console.log("connected to sql database");
})
.catch((err)=>{
    console.log('unable to connect',err);
})

module.exports=sequelize;