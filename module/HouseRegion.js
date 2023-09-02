const { number } = require('joi');
const mongoose = require('mongoose');


const houseRegionSchema = new mongoose.Schema({
  name: String,
  id: Number,
})

  module.exports = mongoose.model("HouseRegion", houseRegionSchema)

