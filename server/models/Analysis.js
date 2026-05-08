const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  input: String,
  result: String,
  severity: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Analysis", analysisSchema);