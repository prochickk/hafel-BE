const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: String,
  id: Number,
})

  module.exports = mongoose.model("University", universitySchema)

