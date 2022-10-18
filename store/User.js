const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  group: String,
  groupEng: String,

  id: Number,
  email: {
    type: String,
    require: true, 
    lowercase: true,
},
  mobileNumber: {
    type: Number,
    minLength: 10,
    maxLength: 10,
},
  createdAt: {
    type: Date,
    default: () => Date.now(),
},
  groupConfirmation: {
    type: Boolean,
    default: false,
},
  })

  module.exports = mongoose.model("User", userSchema)

