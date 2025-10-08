const connectDB = require("./mongodb");
const mongoose = require('mongoose');

// Define the ThesisSchema
const ThesisSchema = new mongoose.Schema({
  titlename: String,
  category: String,
  program: String,
  overview: String,
  author: String,
  filename: String,
  fileBuffer: String,
  path: String,
  thesisdate: String,
  dateuploaded: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false 
  }
});


// Create the ThesisCollection model
const ThesisCollection = mongoose.model('ThesisCollection', ThesisSchema);

module.exports = ThesisCollection;
