const router = require('express').Router();
const authentication = require("../middleware/validateJWT");
const quizItemsController = require('../controllers/quizItemsController');


module.exports = function RouterPrivate(database, settings) {
  //router.use(authentication.authenticate);

  router.route('/createQuizItem').post(quizItemsController.createQuizItem);
  router.route('/updateQuizItem/:id').patch(quizItemsController.updateQuizItem);
  router.route('/getQuizItem/:id').get(quizItemsController.getQuizItem);
  router.route('/getQuizItems').get(quizItemsController.getQuizItems);
  router.route('/getQuizItemsByQuizId/:id').get(quizItemsController.getQuizItemsByQuizId);
  router.route('/deleteQuizItem/:id').delete(quizItemsController.deleteQuizItem);

  return router;
};
