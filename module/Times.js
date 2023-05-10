const mongoose = require('mongoose');


const timeSchema = new mongoose.Schema({
  type: String,
  value: String,
  icon: String,
})

  module.exports = mongoose.model("Time", timeSchema)

