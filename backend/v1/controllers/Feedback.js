const mongoose = require(`mongoose`)
const FeedBackModel = require('./models/FeedbackModel')

/**
 * An object representing the controller.
 * @typedef {Object} Controller
 */
const controller = {}

/**
 * An async function that receives a request object and a response object.
 * The function adds the user feedback in the database.
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object containing feedback information.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.AddUserFeedback = async function (req, res) {
  try {
    let feedback = await new FeedBackModel({
      quizId: req.body.quizId,
      description: req.body.description,
      createdBy: req.user._id,
    }).save()

    feedback = await FeedBackModel.findById(feedback._id)
      .populate(['createdBy'])
      .exec()

    return res.status(200).json({
      success: true,
      message: 'User Feedback created successfully.',
      data: feedback,
    })
  } catch (ex) {
    return res.status(400).json({
      success: false,
      message: 'Unable to create the user feedback.',
      error: ex,
    })
  }
}

/**
 * An async function that receives a request object and a response object.
 * The function returns feedbacks
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.GetAllUserFeedbacks = async function (req, res) {
  try {
    const feedbacks = await FeedBackModel.find({ is_deleted: false })
      .populate(['createdBy'])
      .exec()
    return res.status(200).json({
      success: true,
      message: 'Successfully fetched all User Feedbacks.',
      data: feedbacks,
    })
  } catch (ex) {
    return res.status(400).json({
      success: false,
      message: 'Error while fetching User feedbacks.',
      error: ex,
    })
  }
}

/**
 * An async function that receives a request object and a response object.
 * The function returns a feedback
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object with feedback id as param.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.GetUserFeedbackById = async function (req, res) {
  try {
    const feedback = await FeedBackModel.findById(req.params.id)
      .populate(['createdBy'])
      .exec()

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `User feedback with not found in the system.`,
      })
    }
    return res.status(200).json({
      success: true,
      message: 'Successfully fetched the User Feedback.',
      data: feedback,
    })
  } catch (ex) {
    return res.status(400).json({
      success: false,
      message: ex,
    })
  }
}

/**
 * An async function that receives a request object and a response object.
 * The function updates the feedback in the database.
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object containing the feedback id as params, and feedback information.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.UpdateUserFeedback = async function (req, res) {
  try {
    const feedback = await FeedBackModel.findById(req.params.id)

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback not found in the system.`,
      })
    }
    const updatedFeedback = await FeedBackModel.findByIdAndUpdate(
      req.params.id,
      {
        quizId: req.body.quizId ?? feedback.quizId,
        description: req.body.description ?? feedback.description,
        is_deleted: req.body.is_deleted ?? feedback.is_deleted,
        createdBy: req.user._id ?? feedback.createdBy,
      },
      { new: true, useFindAndModify: false }
    )
      .populate(['createdBy'])
      .exec()

    return res.status(200).json({
      success: true,
      message: 'User Feedback updated successfully.',
      data: updatedFeedback,
    })
  } catch (ex) {
    return res.status(400).json({
      success: false,
      message: 'Error while updating the record.',
      error: ex,
    })
  }
}

/**
 * An async function that receives a request object and a response object.
 * The function deletes the feedback from the database.
 * The function returns a response with a success flag and a message.
 * @function
 * @async
 * @param {Object} req - Express request object containing the feedback id as param.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag and a message.
 */
controller.DeleteUserFeedbackById = async function (req, res) {
  try {
    const feedback = await FeedBackModel.findById(req.params.id)
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `Feedback not found in the system.`,
      })
    }
    await feedback.remove()
    return res.status(200).json({
      success: true,
      message: `feedback deleted successfully`,
    })
  } catch (ex) {
    return res.status(400).json({
      success: false,
      message: 'Error while deleting the User feedback.',
      error: ex,
    })
  }
}

/**
 * An async function that receives a request object and a response object.
 * The function soft deletes the feedback from the database.
 * The function returns a response with a success flag and a message.
 * @function
 * @async
 * @param {Object} req - Express request object containing the feedback id as param.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag and a message.
 */
controller.SoftDeleteUserFeedbackById = async function (req, res) {
  try {
    const feedback = await FeedBackModel.findById(req.params.id)
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: `feedback not found in the system.`,
      })
    }
    const updatedFeedback = await FeedBackModel.findByIdAndUpdate(
      req.params.id,
      { is_deleted: true },
      { new: true, useFindAndModify: false }
    )
      .populate(['createdBy'])
      .exec()
    return res.json({
      success: true,
      message: 'User feedback deleted successfully.',
      data: updatedFeedback,
    })
  } catch (ex) {
    res.status(400).json({
      success: false,
      message: 'Error while deleting the user feedback.',
      error: ex,
    })
  }
}

/**
 * An async function that receives a request object and a response object.
 * The function returns feedbacks
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.GetUserFeedbacksByUserId = async function (req, res) {
  try {
    const feedbacks = await FeedBackModel.find({
      is_deleted: false,
      createdBy: req.user._id,
    })
      .populate(['createdBy'])
      .exec()

    return res.status(200).json({
      success: true,
      message: 'Successfully fetched all User Feedbacks.',
      data: feedbacks,
    })
  } catch (ex) {
    return res.status(400).json({
      success: false,
      message: 'Error while fetching User feedbacks.',
      test: req.user,
      error: ex,
    })
  }
}

module.exports = controller
