const mongoose = require('mongoose');


const idSerialSchema = new mongoose.Schema({
  idUser: Number,
  idDriver: Number,
  idSchedule: Number,
  idListing: Number,
  idAddress: Number,
})

  module.exports = mongoose.model("IdSerial", idSerialSchema)

