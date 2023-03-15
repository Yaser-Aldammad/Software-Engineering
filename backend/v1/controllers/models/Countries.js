const mongoose = require(`mongoose`);

mongoose.Promise = global.Promise;
const {Schema} = mongoose;

/**
 * a table for countries with
 * longitude, latitude, country, name, creation time and updation time as its elements 
 */
const Countries = Schema({
    country: {type: String, required: true},
    latitude: {type: String, required: false},
    longitude: {type: String, required: false},
    name: {type: String, required: true},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});


Countries.set("toJSON", {});
const model = mongoose.model(`Countries`, Countries);
module.exports = model;
