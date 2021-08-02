const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    title: {type: String, required: true},
    address: {type: String, required: true},
    day: {type: String, required: true},
    start: {type: String, required: true},
    end: {type: String, required: true},
    pay: {type: String, required: true},
    phone: {type: String, required: true},
    lat: {type: Number, required: true},
    lng: {type: Number, required: true},
});

module.exports = mongoose.model("location", locationSchema);