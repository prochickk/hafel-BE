const mongoose = require('mongoose');
var moment = require('moment');  
const { string } = require('joi');

const addressSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
})


const listingHistorySchema = new mongoose.Schema({
    tripTypeL: String,
    tripTimeL: String,
    tripDayL: String, 
    tripDayEng: String, 
    descriptionL: String,
    groupL: String,
    idListing: Number,
    useId: Number,
    addressL: Object,
    addressRegionL: String,
    creationDate: {
        type: Date,
        default: () => Date.now(),
    },
})

module.exports = mongoose.model("ListingHistory", listingHistorySchema);