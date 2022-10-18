const mongoose = require('mongoose');


const regionSchema = new mongoose.Schema({
  id: Number,
  group: String,
  name: String,
  adminId: Number,
  adminNumber: Number,
})

  module.exports = mongoose.model("Region", regionSchema)

