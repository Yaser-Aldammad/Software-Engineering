const mongoose = require(`mongoose`)
const QuizHistoryModel = require('./models/QuizHistoryModel')

/**
 * An object representing the controller.
 * @typedef {Object} Controller
 */
const controller = {}

/**
 * An async function that receives a request object and a response object.
 * The function returns scorers.
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.GetAllScorersByQuizIdInDescendingOrder = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.quizId)) {
      //if not present, return response with success flag False
      return res.status(404).json({
        success: false,
        message: `Quiz with Id ${req.params.quizId} not found in the system.`,
      })
    } else {
      let histories = await QuizHistoryModel.find({
        is_deleted: false,
        quizId: req.params.quizId,
        isCompleted: true,
      })
        .populate(['createdBy'])
        .sort({ score: 'desc' })
        .exec()
      return res.json({
        success: true,
        message: 'Successfully fetched all records.',
        data: {
          scorers: histories.map((x) => {
            return { score: x.score, feedback: x.feedback, user: x.createdBy }
          }),
        },
      })
    }
  } catch {
    return res.status(404).json({
      success: false,
      message: `Error while fetching the records.`,
    })
  }
}

/**
 * An async function that receives a request object and a response object.
 * The function returns top 10 scorers.
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.GetTop10ScorersByQuizIdInDescendingOrder = async function (
  req,
  res
) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.quizId)) {
      //if not present, return response with success flag False
      return res.status(404).json({
        success: false,
        message: `Quiz with Id ${req.params.quizId} not found in the system.`,
      })
    } else {
      let histories = await QuizHistoryModel.find({
        is_deleted: false,
        quizId: req.params.quizId,
        isCompleted: true,
      })
        .populate(['createdBy'])
        .sort({ score: 'desc' })
        .exec()
      return res.json({
        success: true,
        message: 'Successfully fetched all records.',
        data: {
          scorers: histories.slice(0, 10).map((x) => {
            return { score: x.score, feedback: x.feedback, user: x.createdBy }
          }),
        },
      })
    }
  } catch {
    return res.status(404).json({
      success: false,
      message: `Error while fetching the records.`,
    })
  }
}

/**
 * An async function that receives a request object and a response object.
 * The function returns rank of the user in the particular user.
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.GetUserRankByUserIdAndQuizId = async function (req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.quizId)) {
      //if not present, return response with success flag False
      return res.status(404).json({
        success: false,
        message: `Quiz with Id ${req.params.quizId} not found in the system.`,
      })
    } else if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      //if not present, return response with success flag False
      return res.status(404).json({
        success: false,
        message: `User with Id ${req.params.userId} not found in the system.`,
      })
    } else {
      let histories = await QuizHistoryModel.find({
        is_deleted: false,
        quizId: req.params.quizId,
        isCompleted: true,
      })
        .populate(['createdBy'])
        .sort({ score: 'desc' })
        .exec()
      rank = histories.slice(0, histories.findIndex((x) => x.createdBy._id == req.params.userId)+1).length;
      return res.json({
        success: true,
        message: 'Successfully fetched rank.',
        data: rank,
      })
    }
  } catch {
    return res.status(404).json({
      success: false,
      message: `Error while fetching the records.`,
    })
  }
}

module.exports = controller
