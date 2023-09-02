const mongoose = require('mongoose');


const sectionSchema = new mongoose.Schema({
  name: String,
  id: Number,

})

  module.exports = mongoose.model("Section", sectionSchema)

