const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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
    unique: true
},
  mobileNumber: {
    type: Number,
    minLength: 10,
    maxLength: 10,
    unique: true
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

  userSchema.methods.generateAuthToken = function() { 
    const token = jwt.sign({ 
      _id: this._id,
      name: 'req.body.name',
      useId: 123,
      region: 'req.body.nearLocCateLabel',
      location: {
        longitude: 49.58798440173268,
        latitude: 25.330102514529933
      }
    },
    'jwtPrivateKey');

    return token;
  }

  module.exports = mongoose.model("User", userSchema)

