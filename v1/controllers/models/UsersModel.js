const mongoose = require(`mongoose`);
/**
 * Set Mongoose's Promise library to use the global Promise library.
 */

mongoose.Promise = global.Promise;
/**
 *  ___________________________
|                           |
|        Users schema       |
|___________________________|
|                           |
|  first_name: String       |
|  last_name: String        |
|  email: String (unique)   |
|  username: String (unique)|
|  password: String         |
|  is_deleted: Boolean      |
|  status: String           |
|  roles: String            |
|  phoneNo: String          |
|  countryCode: String      |
|  created: Date            |
|  updated: Date            |
|___________________________|

 * User schema definition.
 * @typedef {Object} UserSchema
 * @property {string} first_name - The user's first name.
 * @property {string} last_name - The user's last name.
 * @property {string} email - The user's email address.
 * @property {string} username - The user's unique username.
 * @property {string} password - The user's password.
 * @property {boolean} is_deleted - Indicates whether the user is deleted or not.
 * @property {string} status - The user's status (e.g. "Active", "Inactive", etc.).
 * @property {string} roles - The user's role (e.g. "Student", "Teacher", etc.).
 * @property {string} phoneNo - The user's phone number.
 * @property {string} countryCode - The user's country code.
 * @property {Date} created - The date the user was created.
 * @property {Date} updated - The date the user was last updated.
 */

const { Schema } = mongoose;
/**
 * Define the Users schema.
 * @type {import('mongoose').Schema<UserSchema>}
 *
 */

const Users = Schema({
  first_name: { type: String, required: false },
  last_name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  is_deleted: { type: Boolean, default: false },
  status: { type: String, default: `Active` },
  roles: { type: String, default: "Student" },
  phoneNo: { type: String, required: false },
  countryCode: { type: String, required: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

/**
 * bcrypt library for password hashing.
 * @const bcrypt
 */
const bcrypt = require(`bcrypt-nodejs`);
/**
 * Function to hash the password before saving the user data.
 * @function
 * @name preSave
 * @memberof Users
 * @param {function} callback - A callback function to be executed after hashing the password.
 * @returns {undefined}
 */
Users.pre(`save`, function (callback) {
  const user = this;
  user.updated = new Date(Date.now());
  if (!user.isModified(`password`)) return callback();
  bcrypt.genSalt(5, (err, salt) => {
    if (err) return callback(err);
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

/**
 * Middleware function to encrypt user password before updating it in database.
 * @function
 * @name Users.pre
 * @param {string} findOneAndUpdate - Mongoose method to find and update user data in database.
 * @param {function} callback - Callback function to be executed after encryption is complete or if an error occurs.
 * @returns {void}
 */
Users.pre(`findOneAndUpdate`, function (callback) {
  if (this._update.password) {
    bcrypt.genSalt(5, (err, salt) => {
      if (err) return callback(err);
      bcrypt.hash(this._update.password, salt, null, (err, hash) => {
        if (err) return callback(err);
        this._update.password = hash;
        callback();
      });
    });
  }
});

const Usermodel = mongoose.model(`Users`, Users);
module.exports = Usermodel;