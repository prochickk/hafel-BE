const mongoose = require('mongoose');
var moment = require('moment');  
const { string } = require('joi');

const addressSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
})


const listingSchema = new mongoose.Schema({
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
        
        // default: moment().format('dddd'),
        // default: moment().format('l'), // 9/26/2022
        // default: moment().format('l'), // 9/26/2022
        //default: moment().format('LT'),   // 12:03 PM
        // default: new Date().toISOString().replace('T', ' ').slice(0, 19),
    },
})

module.exports = mongoose.model("Listing", listingSchema);