const mongoose = require('mongoose');

// Define the RcdSchema
const RCDSchema = new mongoose.Schema({
  thesisId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thesis', required: true },
  uploadDate: { type: Date, default: Date.now },
});

const RCDCollection = mongoose.model('RCD', RCDSchema);

module.exports = RCDCollection;