const router = require('express').Router();
const authentication = require("../middleware/validateJWT");
const quizItemsController = require('../controllers/quizItemsController');


module.exports = function RouterPrivate(database, settings) {
  router.use(authentication.authenticate);

  router.route('/createQuizItem').post(quizItemsController.createQuizItem);
  router.route('/updateQuizItem').post(quizItemsController.updateQuizItem);
  router.route('/getQuizItem').post(quizItemsController.getQuizItem);
  router.route('/getQuizItems').post(quizItemsController.getQuizItems);
  router.route('/getQuizItemsByQuizId').post(quizItemsController.getQuizItemsByQuizId);
  router.route('/deleteQuizItem').post(quizItemsController.deleteQuizItem);

  return router;
};
