const router = require(`express`).Router()
const users = require(`../controllers/Users`)
const quizController = require('../controllers/Quiz')
const quizHistoryController = require('../controllers/QuizHistory')
const quizItemsController = require('../controllers/QuizQuestions')
const feedbackController = require('../controllers/Feedback')

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
  /**
   * Route to get quizzes between start and end time
   */
  router.get('/quizzes/time', quizController.GetQuizesBtTime)

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
   * routes GET /getQuizItem/:id to get quiz item by Id
   */
  router.route('/getQuizItem/:id').get(quizItemsController.getQuizItem)
  /**
   * routes GET /getQuizItems fetch all quizes
   */
  router.route('/getQuizItems').get(quizItemsController.getQuizItems)
  /**
   * routes GET /getQuizItemsByQuizId/:id to qet quiz items by quizId
   */
  router
    .route('/getQuizItemsByQuizId/:id')
    .get(quizItemsController.getQuizItemsByQuizId)
  /**
   * routes GET /getQAQuizItems/ to get all quest-and-ans (Q/A) quiz items
   */
  router.route('/getQAQuizItems/').get(quizItemsController.getQAQuizItems)
  /**
   * routes GET /getMCQuizItems/ to get all multiple choice (M/C) quiz items
   */
  router.route('/getMCQuizItems/').get(quizItemsController.getMCQuizItems)
  /**
   * routes GET /getQAQuizItems/:type to get all quest-and-ans (Q/A) quiz items
   */
  router.route('/getQAQuizItems/:type').get(quizItemsController.getQAQuizItems)
  /**
   * routes GET /getMCQuizItems/:type to get all multiple choice (M/C) quiz items
   */
  router.route('/getMCQuizItems/:type').get(quizItemsController.getMCQuizItems)

  /**
   * routes GET /getSATAQuizItems/ to get all multiple choice (SATA) quiz items
   */
  router.route('/getSATAQuizItems/').get(quizItemsController.getSATAQuizItems)
  /**
   * routes DELETE /deleteQuizItem/:id to delete quizItem
   */
  router.route('/deleteQuizItem/:id').delete(quizItemsController.deleteQuizItem)
  //#end region

  //#region Quiz History

  /**
   * routes POST /quizhistory to add quiz history
   */
  router.route(`/quizhistory`).post(quizHistoryController.AddQuizHistory)
  /**
   * routes PATCH /quiz/:quizHistoryId to delete quiz history
   */
  router
    .route(`/quizhistory/:quizHistoryId`)
    .patch(quizHistoryController.UpdateQuizHistory)
  /**
   * routes DELETE /quiz/:quizHistoryId to delete quiz history permanently
   */
  router
    .route(`/quizhistory/parmanent/:quizHistoryId`)
    .delete(quizHistoryController.DeletePermanentlyByQuizHistoryId)
  /**
   * routes DELETE /quiz/:quizHistoryId to delete quiz history
   */
  router
    .route(`/quizhistory/:quizHistoryId`)
    .delete(quizHistoryController.DeleteByQuizHistoryId)
  /**
   * routes GET /quizhistory/:quizHistoryId to get quiz history by quizHistoryId
   */
  router
    .route(`/quizhistory/:quizHistoryId`)
    .get(quizHistoryController.GetQuizHistoryById)
  /**
   * routes GET /quizhistory to get all quiz histories
   */
  router.route(`/quizhistory`).get(quizHistoryController.GetAllQuizHistory)
  //#endregion

  //#region Feedback

  /**
   * routes POST /feedback to get add feedback
   */
  router.route(`/feedback`).post(feedbackController.AddUserFeedback)
  /**
   * routes PATCH /feedback/:id to update feedback
   */
  router.route(`/feedback/:id`).patch(feedbackController.UpdateUserFeedback)
  /**
   * routes DELETE /feedback/:id to delete feedback
   */
  router
    .route(`/feedback/:id`)
    .delete(feedbackController.DeleteUserFeedbackById)
  /**
   * routes DELETE /feedback/softdelete/:id to delete feedback
   */
  router
    .route(`/feedback/softdelete/:id`)
    .delete(feedbackController.SoftDeleteUserFeedbackById)

  /**
   * routes GET /feedback/:id to get feedback by id
   */
  router.route(`/feedback/:id`).get(feedbackController.GetUserFeedbackById)
  /**
   * routes GET /feedbacks to get all feedbacks
   */
  router.route(`/feedbacks`).get(feedbackController.GetAllUserFeedbacks)
  /**
   * routes GET /user/feedbacks to get feedbacks of current user
   */
  router
    .route(`/userId/feedback`)
    .get(feedbackController.GetUserFeedbacksByUserId)

  //#endregion

  /**
   * GET request handler for the admin dashboard route.
   * @async
   * @function
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @throws {Error} If there is an error checking if the user is an admin.
   * @returns {Promise<void>} Returns nothing.
   */
  router.route(`/admin/dashboard`).get(isAdmin, async (req, res) => {
    return res.send('welcome to admin dashboard')
  })

  /**
   * GET request handler for the teacher courses route.
   * @async
   * @function
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @throws {Error} If there is an error checking if the user is a teacher or an admin.
   * @returns {Promise<void>} Returns nothing.
   */
  router.route(`/teacher/courses`).get(isTeacher, isAdmin, async (req, res) => {
    return res.send('welcome to teacher dashboard')
  })

  /**
   * GET request handler for the student profile route.
   * @async
   * @function
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @throws {Error} If there is an error checking if the user is a student, teacher or an admin.
   * @returns {Promise<void>} Returns nothing.
   */
  router
    .route(`/student/profile`)
    .get(isStudent, isTeacher, isAdmin, async (req, res) => {
      return res.send('welcome to student profile')
    })

  return router
}
