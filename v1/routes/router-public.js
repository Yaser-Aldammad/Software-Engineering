const router = require(`express`).Router();
const userController = require(`../controllers/Users`);

module.exports = function RouterPublic(database, settings) {
	const db = database;

	router.route(`/example`).post(userController.AddUser);

	return router;
};
