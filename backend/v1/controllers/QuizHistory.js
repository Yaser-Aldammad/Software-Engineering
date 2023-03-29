const mongoose = require(`mongoose`)
const QuizHistoryModel = require('./models/QuizHistoryModel')

/**
 * An object representing the controller.
 * @typedef {Object} Controller
 */
const controller = {}

/**
 * An async function that receives a request object and a response object.
 * The function returns quiz Histories
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.GetAllQuizHistory = async function (req, res) {
  try {
    const quizHistories = await QuizHistoryModel.find({ is_deleted: false }) //Get all undeleted quizHistories from database
      .populate(['createdBy'])
      .exec()
    return res.json({
      success: true,
      message: 'Successfully fetched all records.',
      data: { quizHistories: quizHistories },
    })
  } catch {
    return res.status(400).json({
      success: false,
      message: 'Error while fetching records.',
    })
  }
}

/**
 * An async function that receives a request object and a response object.
 * The function returns a quiz History
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object with quizHistoryId params.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.GetQuizHistoryById = async function (req, res) {
  try {
    const quizHistory = await QuizHistoryModel.findById(
      req.params.quizHistoryId
    )
      .populate(['createdBy'])
      .exec()

    if (quizHistory === null || quizHistory.is_deleted) {
      throw Error()
    } else {
      return res.json({
        success: true,
        message: 'Successfully fetched the record.',
        data: { quizHistory: quizHistory },
      })
    }
  } catch (ex) {
    return res.status(404).json({
      success: false,
      message: `Quiz History with Id ${req.params.quizHistoryId} not found in the system.`,
    })
  }
}

/**
 * An async function that receives a request object and a response object.
 * The function adds the quiz history in the database.
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object containing quiz history information.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.AddQuizHistory = async function (req, res) {
  try {
    // adding quiz history into database
    let quizHistory = await new QuizHistoryModel({
      quizId: req.body.quizId,
      score: req.body.score,
      feedback: req.body.feedback,
      isCompleted: req.body.isCompleted,
      createdBy: req.user._id,
    }).save()

    quizHistory = await QuizHistoryModel.findById(quizHistory._id)
      .populate(['createdBy'])
      .exec()

    return res.json({
      success: true,
      message: 'Quiz history created successfully.',
      data: { quizHistory: quizHistory },
    })
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: 'Unable to create the quiz history.',
    })
  }
}

/**
 * An async function that receives a request object and a response object.
 * The function updates the quiz history in the database.
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object containing the quizHistoryId params, and quiz history information.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.UpdateQuizHistory = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.quizHistoryId)) {
      //if not present, return response with success flag False
      return res.status(404).json({
        success: false,
        message: `Quiz history with Id ${req.params.quizHistoryId} not found in the system.`,
      })
    } else {
      // Updating Quiz History in Database
      const quizHistory = await QuizHistoryModel.findOne({
        _id: req.params.quizHistoryId,
      })
      const updatedQuizHistory = await QuizHistoryModel.findByIdAndUpdate(
        req.params.quizHistoryId,
        {
          quizId: req.body.quizId ?? quizHistory.quizId,
          score: req.body.score ?? quizHistory.score,
          feedback: req.body.feedback ?? quizHistory.feedback,
          isCompleted: req.body.isCompleted ?? quizHistory.isCompleted,
          createdBy: req.user.id ?? quizHistory.createdBy,
        },
        { new: true, useFindAndModify: false }
      )
        .populate(['createdBy'])
        .exec()

      return res.json({
        success: true,
        message: 'Quiz history updated successfully.',
        data: { quizHistory: updatedQuizHistory },
      })
    }
  } catch (ex) {
    return res.status(400).json({
      success: false,
      message: 'Error while updating the record.',
    })
  }
}

/**
 * An async function that receives a request object and a response object.
 * The function deletes the quiz history from the database.
 * The function returns a response with a success flag and a message.
 * @function
 * @async
 * @param {Object} req - Express request object containing the quizHistoryId params.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag and a message.
 */
controller.DeleteByQuizHistoryId = async function (req, res) {
  try {
    const quiz = await QuizHistoryModel.findById(
      req.params.quizHistoryId
    ).exec() //Get quiz history by id from the database
    if (!quiz) {
      //if not present, return response with success flag False
      res.status(404).json({
        success: false,
        message: `Quiz history with Id ${req.params.quizId} not found in the system.`,
      })
    } else {
      const updatedQuizHistory = await QuizHistoryModel.findByIdAndUpdate(
        req.params.quizHistoryId,
        { is_deleted: true },
        { new: true, useFindAndModify: false }
      )
        .populate(['createdBy'])
        .exec()
      return res.json({
        success: true,
        message: 'Quiz history deleted successfully',
      })
    }
  } catch (ex) {
    res.status(400).json({
      success: false,
      message: 'Error while deleting the record.',
    })
  }
}

module.exports = controller
