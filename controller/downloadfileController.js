const path = require("path");
const sequelize = require("../database/db");
const { json } = require("sequelize");
const AWS = require("aws-sdk");
require('dotenv').config();
const S3Services = require("../services/S3services");
const Expense = require("../models/expense");
const User = require("../models/user");
const FilesDownload = require("../models/filesdownloaded");


async function download(req, res){
    try {
      const expenses = await Expense.findAll({ where: { userId: req.user.id } });
      const strinfiyExpenses = JSON.stringify(expenses);
      const userId = req.user.id;
      const filename = `expenses${userId}/${new Date()}.txt`;
      const fileUrl = await S3Services.uploadToS3(strinfiyExpenses, filename);
      await FilesDownload.create({
        filelink: fileUrl,
        userId,
      });
      res.status(200).json({ fileUrl, success:true });
    } catch (err) {
      res.status(500).json({ fileUrl: "" });
    }
}

async function  downloadLinks (req,res){
    const t = await sequelize.transaction();
  try{
    const url=await FilesDownload.findAll({where:{userId:req.user.id}})
    res.status(200).json({success:'true',url})
  }
  catch(err){
    console.log(err);
    res.status(500).json({success:'false',error:err});
  }
  }

  module.exports={
    download,downloadLinks
  }