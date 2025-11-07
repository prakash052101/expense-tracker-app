const mongoose = require('mongoose');

const filesDownloadedSchema = new mongoose.Schema({
  filelink: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('FilesDownloaded', filesDownloadedSchema);
