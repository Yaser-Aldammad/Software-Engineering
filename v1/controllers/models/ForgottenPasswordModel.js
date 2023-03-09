/**
 * The Mongoose module for working with MongoDB.
 * @const {object} mongoose
*/
const mongoose = require(`mongoose`);

/**
 * Sets the global Promise library for Mongoose to use.
 * @type {PromiseConstructor}
 * @global
*/
mongoose.Promise = global.Promise;

/**
 * A schema for the "Forget Passwords" collection in the MongoDB database.
 * @typedef {Object} ForgetPasswordSchema
 * @property {mongoose.Types.ObjectId} user - The user's ID associated with the forget password request.
 * @property {string} code - The reset code for the user's forget password request.
*/

/**
 * A Mongoose schema object for the "Forget Passwords" collection in the MongoDB database.
 * @type {mongoose.Schema}
*/
const { Schema } = mongoose;

const ForgetPasswordSch = Schema({
  user: { type: mongoose.Types.ObjectId, required: true, unique: true, ref: "Users" },
  code: { type: String, required: true }
});

/**
 * Removes the "__v" field from the serialized JSON representation of a "Forget Passwords" document.
*/

ForgetPasswordSch.set("toJSON", {});

/**

A Mongoose model object for the "Forget Passwords" collection in the MongoDB database.
@typedef {mongoose.Model<ForgetPasswordSchema>} ForgetPasswordModel
*/
/**
 * The Mongoose model for the "Forget Passwords" collection in the MongoDB database.
 * @type {ForgetPasswordModel}
*/
const model = mongoose.model(`ForgetPasswords`, ForgetPasswordSch);
module.exports = model;
