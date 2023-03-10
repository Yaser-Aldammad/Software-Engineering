const mongoose = require(`mongoose`);

/**
 * Set global promise for Mongoose
 * @type {Promise}
*/
mongoose.Promise = global.Promise;

/**
 * Schema for Countries collection
 * @type {object}
*/
const {Schema} = mongoose;

/**
 * Defines the Countries schema
 * @type {object}
 * @property {string} country - The name of the country, required
 * @property {string} latitude - The latitude of the country, optional
 * @property {string} longitude - The longitude of the country, optional
 * @property {string} name - The name of the country, required
 * @property {Date} created - The creation date of the document, default: current date
 * @property {Date} updated - The last update date of the document, default: current date
*/
const Countries = Schema({
    country: {type: String, required: true},
    latitude: {type: String, required: false},
    longitude: {type: String, required: false},
    name: {type: String, required: true},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});

/**
 * Set the toJSON option to return plain objects instead of Mongoose documents
 * @type {object}
*/
Countries.set("toJSON", {});

/**
 * The Mongoose model for the Countries collection
 * @type {object}
*/
const model = mongoose.model(`Countries`, Countries);

/**
 * Export the CountriesModel
 * @type {object}
*/
module.exports = model;
