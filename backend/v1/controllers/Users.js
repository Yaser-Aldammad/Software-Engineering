const moment = require(`moment`);
const UsersModel = require(`./models/UsersModel`);
const ForgetPasswordModel = require('./models/ForgottenPasswordModel');
const settings = require(`../../server-settings`);
const mailer = require('../helpers/mailer');
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
	const p = UsersModel.findOne({ username: name }).exec();
	await p.then((user) => {
		if (user === null) {
			result = true;
		}
	});
	return result;
};

/**
 * AddUser is an async function that receives a request object and a response object.
 * The function creates a new user based on the data in the request object, and then saves the user to the database.
 * If the user's username already exists, the function returns an error response with a message indicating that the username already exists.
 * If the user's email already exists, the function returns an error response with a message indicating that the email already exists.
 * If there are no errors, the function returns a success response with the newly created user object and a JSON web token.
 * @function
 * @async
 * @param {Object} req - Express request object containing the user's information.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and user data with a JSON web token on successful registration.
 */
controller.AddUser = async function (req, res) {
	// Get user information from the request body and create a user object
	const user = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		countryCode: req.body.countryCode,
		phoneNo: req.body.phoneNo,
	};

	// If the username is defined, truncate it to 60 characters
	if (typeof user.username !== `undefined`) {
		user.username = user.username.slice(0, 60);
	}

	// Check if the username already exists, return error if it does
	if ((await validateUserName(user.username)) === false) {
		return res
			.status(400)
			.json({ success: false, message: `That username already exists` });
	}

	// Check if the email already exists, return error if it does
	const email_exist = await Usermodel.findOne({ email: user.email });

	if (email_exist) {
		return res
			.status(400)
			.json({ success: false, message: `That email already exists` });
	}

	// Create a new user and save it to the database
	const model = new UsersModel(user);
	const promise = model.save();

	// Create a JSON web token using the user's ID and the server's secret key
	const token = jwt.sign({ sub: model._id }, settings.server.secret, {
		algorithm: 'HS512',
	});

	// Return a success response with the newly created user object and JSON web token
	promise
		.then((user) => {
			let resp = {
				success: true,
				message: 'User created successfully.',
				data: { user: user, token: token },
			};
			res.json(resp);
		})
		.catch((ex) => {
			console.log(ex);
			// Return an error response if there was an error saving the user
			let resp = {
				success: false,
				message: 'error',
			};
			res.status(400).json(resp);
		});
};

controller.GetUsersList = function (req, res) {
	UsersModel.find({}, (err, users) => {
		if (err) {
			res.status(400).json({
				success: false,
				message: `Something went wrong. Please try again later`,
			});
		} else {
			res.json({
				success: true,
				message: `users listed successfully`,
				data: users,
			});
		}
	});
};

controller.GetUserProfile = function (req, res) {
	const query = UsersModel.findById(req.params.id);
	const promise = query.exec();
	promise
		.then((user) => {
			res.status(200).json({ success: true, message: `Success`, data: user });
		})
		.catch((ex) => {
			res.status(400).json({ success: false, message: `error` });
		});
};

controller.UpdateUser = async function (req, res) {
	UsersModel.findById(req.params.id)
		.then(async (user) => {
			if (user === null) {
				throw `User not found with that ID`;
			}
			user.first_name = req.body.first_name || user.first_name;
			user.last_name = req.body.last_name || user.last_name;
			user.username = req.body.username || user.username;
			user.password = req.body.password || user.password;
			user.email = req.body.email || user.email;
			user.picture = req.body.picture || user.picture;
			user.phoneNo = req.body.phoneNo || user.phoneNo;
			user.picture = req.body.picture || user.picture;

			return await user.save();
		})
		.then((user) => {
			res
				.status(200)
				.json({ success: true, message: `Successfuly updated`, data: user });
		})
		.catch((ex) => {
			res.status(500).json({ success: false, message: `error` });
		});
};

controller.DeleteUser = function (req, res) {
	const query = UsersModel.findById(req.params.id).exec();
	let name;

	query
		.then((user) => {
			if (user !== null) {
				name = user.username;
				return user.deleteOne();
			}
			throw `User not found with that ID`;
		})
		.then(() => {
			res.status(200).json({ success: true, message: `User ${name} removed` });
		})
		.catch((ex) => {
			res.status(500).json({ success: false, message: 'error' });
		});
};
module.exports = controller;
