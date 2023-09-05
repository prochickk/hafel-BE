const mongoose = require('mongoose');


const regionSchema = new mongoose.Schema({
  id: Number,
  group: String,
  groupList: String,
  monthlyPrice: Number,
  semesterlyPrice: Number,
  dailyPrice: Number,
  name: String,
  adminId: Number,
  adminNumber: Number,
  section: String,
  university: String,
  features: [String], 
  image: Buffer,
  logoImage: Buffer,

})

  module.exports = mongoose.model("Region", regionSchema)

