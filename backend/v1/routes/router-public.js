const router = require(`express`).Router();
const exampleController = require(`../controllers/exampleController`);

module.exports = function RouterPublic(database, settings) {
    const db = database;
      
    router.route(`/example`).post(exampleController.ExampleAddUser)


    return router;
};
