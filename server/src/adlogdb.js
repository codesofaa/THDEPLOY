const connectDB = require("./mongodb");
const mongoose = require('mongoose');

const adlogSchema = new mongoose.Schema({
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('adLogs', adlogSchema);
