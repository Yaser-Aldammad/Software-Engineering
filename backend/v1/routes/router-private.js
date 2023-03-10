const router = require('express').Router();
const users = require(`../controllers/Users`);
const { Router } = require("express");
const authentication = require("../middleware/validateJWT");
const quizItemsController = require('../controllers/quizItemsController');


// const CollectionMulerSettings = upload.fields([
//   { name: `thumbnail_image`, maxCount: 1 },
//   { name: `timeline_image`, maxCount: 1 },
// ]);
/**
 * private router used for user authentication
 * @param {*} database 
 * @param {*} settings 
 * @returns {Router}
 */
module.exports = function RouterPrivate(database, settings) {
  //router.use(authentication.authenticate);

  router.route('/createQuizItem').post(quizItemsController.createQuizItem);
  router.route('/updateQuizItem/:id').patch(quizItemsController.updateQuizItem);
  router.route('/getQuizItem/:id').get(quizItemsController.getQuizItem);
  router.route('/getQuizItems').get(quizItemsController.getQuizItems);
  router.route('/getQuizItemsByQuizId/:id').get(quizItemsController.getQuizItemsByQuizId);
  router.route('/deleteQuizItem/:id').delete(quizItemsController.deleteQuizItem);

  router.use(authentication.authenticate);

    /**
     * routes GET /logout and clear the session cookie
     */
  router.get(`/logout`, (req, res) => {
    req.logout()
    res.clearCookie(`${settings.server.name} Cookie`)
    res.status(200).json({
      success: true,
    })
  })
  return router;
};
