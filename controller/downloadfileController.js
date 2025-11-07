require('dotenv').config();
const S3Services = require("../services/S3services");
const Expense = require("../models/expense.model");
const FilesDownload = require("../models/filesdownloaded.model");

async function download(req, res) {
  try {
    const expenses = await Expense.find({ userId: req.user._id });
    const strinfiyExpenses = JSON.stringify(expenses);
    const userId = req.user._id;
    const filename = `expenses${userId}/${new Date()}.txt`;
    const fileUrl = await S3Services.uploadToS3(strinfiyExpenses, filename);
    const newFile = new FilesDownload({
      filelink: fileUrl,
      userId,
    });
    await newFile.save();
    res.status(200).json({ fileUrl, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileUrl: "", error: 'Failed to download file' });
  }
}

async function downloadLinks(req, res) {
  try {
    const url = await FilesDownload.find({ userId: req.user._id });
    res.status(200).json({ success: 'true', url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: 'false', error: err });
  }
}

  module.exports={
    download,downloadLinks
  }