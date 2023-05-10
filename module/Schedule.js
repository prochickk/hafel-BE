const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
})


const scheduleSchema = new mongoose.Schema({
    tripType: String,
    tripTime: String,
    tripDay: String, 
    address: Number,
    addressRegion: String,
    group: String,
    useId: Number,
    idSchedule: Number,
    creationDate: {
        type: Date,
        default: () => Date.now(),
    },
})

module.exports = mongoose.model("Schedule", scheduleSchema);