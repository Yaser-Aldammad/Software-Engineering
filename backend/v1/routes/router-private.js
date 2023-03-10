const router = require(`express`).Router();
const users = require(`../controllers/Users`);
const { Router } = require("express");
const authentication = require("../middleware/validateJWT");
const quizController = require(`../controllers/QuizController`);


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
  router.use(authentication.authenticate);


    //#region Quiz
  
    /**
     * routes POST /quiz to get add quiz
     */
    router.route(`/quiz`).post(quizController.AddQuiz);
    /**
     * routes PATCH /quiz/:quizId to update quiz
     */
    router.route(`/quiz/:quizId`).patch(quizController.UpdateQuiz);
    /**
     * routes DELETE /quiz/:quizId to delete quiz
     */
    router.route(`/quiz/:quizId`).delete(quizController.DeleteByQuizId);
    /**
     * routes GET /quiz/:quizId to get quiz by quizId
     */
    router.route(`/quiz/:quizId`).get(quizController.GetQuizById);
    /**
     * routes GET /quiz to get all quizzes
     */
    router.route(`/quiz`).get(quizController.GetAllQuizes);
  
    //#endregion

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
