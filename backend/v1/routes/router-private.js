const router = require(`express`).Router()
const users = require(`../controllers/Users`)
const quizController = require('../controllers/Quiz')
const quizItemsController = require('../controllers/QuizItems')
const { Router } = require('express')
const authentication = require('../middleware/validateJWT')

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
  router.use(authentication.authenticate)

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

  //#region Quiz

  /**
   * routes POST /quiz to get add quiz
   */
  router.route(`/quiz`).post(quizController.AddQuiz)
  /**
   * routes PATCH /quiz/:quizId to update quiz
   */
  router.route(`/quiz/:quizId`).patch(quizController.UpdateQuiz)
  /**
   * routes DELETE /quiz/:quizId to delete quiz
   */
  router.route(`/quiz/:quizId`).delete(quizController.DeleteByQuizId)
  /**
   * routes DELETE /quiz/:quizId to delete quiz
   */
  router
    .route(`/quiz/softdelete/:quizId`)
    .delete(quizController.SoftDeleteByQuizId)
  /**
   * routes DELETE /quiz/parmanent/:quizId to delete quiz
   */
  router.route(`/quiz/parmanent/:quizId`).delete(quizController.DeleteByQuizId)
  /**
   * routes GET /quiz/:quizId to get quiz by quizId
   */
  router.route(`/quiz/:quizId`).get(quizController.GetQuizById)
  /**
   * routes GET /quiz to get all quizzes
   */
  router.route(`/quiz`).get(quizController.GetAllQuizes)
  /**
   * routes GET /quiz/:id to get quiz with questions by quizId
   */
  router
    .route(`/quizWithQuestions/:id`)
    .get(quizController.GetQuizWithQuestionById)

  //#endregion

  //#region User

  /**
   * routes DELETE /user/:id to delete user
   */
  router.route(`/user/:id`).delete(users.DeleteUser)
  /**
   * routes GET /users to get all users
   */
  router.route(`/users`).get(users.GetUsersList)
  /**
   * routes PATCH /users to get update user
   */
  router.route(`/user/:id`).patch(users.UpdateUser)
  /**
   * routes GET /user/:id to get user by id
   */
  router.route(`/user/:id`).get(users.GetUserById)

  //#end region

  //#region QuizItems
  /**
   * routes POST /createQuizItem to add quiz question
   */
  router.route('/createQuizItem').post(quizItemsController.createQuizItem)
  /**
   * routes PATCH /updateQuizItem/:id to update  quizItems
   */
  router.route('/updateQuizItem/:id').patch(quizItemsController.updateQuizItem)
  /**
   * routes GET /getQuizItem/:id to get quiz item by QuizItem ID
   */
  router.route('/getQuizItem/:id').get(quizItemsController.getQuizItem)
  /**
   * routes GET /getQuizItems fetch all quiz items
   */
  router.route('/getQuizItems').get(quizItemsController.getQuizItems)
  /**
   * routes GET /getQuizItemsByQuizId/:id to qet quiz items by Quiz ID
   */
  router
  .route('/getQuizItemsByQuizId/:id')
  .get(quizItemsController.getQuizItemByQuizId)
  /**
   * routes GET /getQAQuizItems/:type to get all quest-and-ans quiz items
   */
  router
    .route('/getQAQuizItems/:type')
    .get(quizItemsController.getQAQuizItems)
  /**
   * routes GET /getMCQuizItems/:type to get all multiple choice quiz items
   */
  router
    .route('/getMCQuizItems/:type')
    .get(quizItemsController.getMCQuizItems)
  /**
   * routes DELETE /deleteQuizItem/:id to delete quizItem
   */
  router.route('/deleteQuizItem/:id').delete(quizItemsController.deleteQuizItem)
  //#end region

  return router
}
