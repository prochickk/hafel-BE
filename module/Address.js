const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    location: Object,
    name: String,
    region: String,
    useId: Number,
    idAddress: Number,
    value: {
        type: Number,
        default: 2
    },
    icon: {
        type: String,
        default: "floor-lamp",
    }
})

module.exports = mongoose.model("Address", addressSchema)