const moment = require(`moment`);
const UsersModel = require(`./models/UsersModel`);
const settings = require(`../../server-settings.json`);
const jwt = require(`jsonwebtoken`);
const Usermodel = require('./models/UsersModel');


/**
 * An object representing the controller.
 * @typedef {Object} Controller
*/
/**
 * An asynchronous function that validates a username by checking if it exists in the database.
 * @async
 * @function validateUserName
 * @param {string} name - The username to validate.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the username is valid or not.
*/

const controller = {};
/**
 * An asynchronous function that validates a username by checking if it exists in the database.
 * @async
 * @function validateUserName
 * @param {string} name - The username to validate.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the username is valid or not.
*/
const validateUserName = async function (name) {
  let result = false;
  const p = ExampleModel.findOne({ username: name }).exec();
  await p.then(user => {
    if (user === null) {
      result = true;
    }
  });
  return result;
};



module.exports = controller;
