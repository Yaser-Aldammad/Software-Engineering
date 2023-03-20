const QuizModel = require("./models/QuizModel");

/**
 * An object representing the controller.
 * @typedef {Object} Controller
 */
const controller = {};

/**
 * An async function that receives a request object and a response object.
 * The function returns quizzes
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.GetAllQuizes = async function (req, res) {
  try {
    const quizzes = await QuizModel.find({ is_deleted: false }); //Get all undeleted quizzes from database
    res.json({
      success: true,
      message: "Successfully fetched all records.",
      data: { quizzes: quizzes },
    });
  } catch {
    res.status(400).json({
      success: false,
      message: "Error while fetching records.",
    });
  }
};

/**
 * An async function that receives a request object and a response object.
 * The function returns a quiz
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object with quizId params.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.GetQuizById = async function (req, res) {
  try {
    const quiz = await QuizModel.findById(req.params.quizId).exec();
    if (quiz === null) {
      res.status(404).json({
        success: false,
        message: `Quiz with Id ${req.params.quizId} not found in the system.`,
      });
    } else {
      res.json({
        success: true,
        message: "Successfully fetched the record.",
        data: { quiz: quiz },
      });
    }
  } catch (ex) {
    res.status(400).json({
      success: false,
      message: "Error while fetching the record.",
    });
  }
};

/**
 * An async function that receives a request object and a response object.
 * The function adds the quiz in the database.
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object containing quiz information.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.AddQuiz = async function (req, res) {
  try {
    // adding quiz into database
    const quiz = await new QuizModel({
      title: req.body.title,
      quizType: req.body.quizType,
      description: req.body.description,
      createdBy: req.body.createdBy,
    }).save();
    res.json({
      success: true,
      message: "Quiz created successfully.",
      data: { quiz: quiz },
    });
  } catch (ex) {
    res.status(400).json({
      success: false,
      message: "Error while adding the record.",
    });
  }
};

/**
 * An async function that receives a request object and a response object.
 * The function updates the quiz in the database.
 * The function returns a response with a success flag, a message, and a data (for successfull response).
 * @function
 * @async
 * @param {Object} req - Express request object containing the quizId params, and quiz information.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag, a message, and data.
 */
controller.UpdateQuiz = async function (req, res) {
  try {
    const quiz = await QuizModel.findById(req.params.quizId).exec(); //Get quiz by id from the database
    if (!quiz) {
      //if not present, return response with success flag False
      res.status(404).json({
        success: false,
        message: `Quiz with Id ${req.params.quizId} not found in the system.`,
      });
    } else {
      // Updating Quiz in Database
      const updatedQuiz = await QuizModel.findByIdAndUpdate(
        req.params.quizId,
        {
          title: req.body.title ?? quiz.title,
          quizType: req.body.quizType ?? quiz.quizType,
          description: req.body.description ?? quiz.description,
        },
        { new: true, useFindAndModify: false }
      );
      res.json({
        success: true,
        message: "Quiz updated successfully.",
        data: { quiz: updatedQuiz },
      });
    }
  } catch (ex) {
    res.status(400).json({
      success: false,
      message: "Error while updating the record.",
    });
  }
};

/**
 * An async function that receives a request object and a response object.
 * The function deletes the quiz from the database.
 * The function returns a response with a success flag and a message.
 * @function
 * @async
 * @param {Object} req - Express request object containing the quizId params.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag and a message.
 */
controller.DeleteByQuizId = async function (req, res) {
  try {
    await QuizModel.deleteOne({ _id: req.params.quizId }); //deleting by id from database
    res.json({
      success: true,
      message: `Quiz deleted successfully`,
    });
  } catch (ex) {
    res.status(400).json({
      success: false,
      message: "Error while deleting the record.",
    });
  }
};

/**
 * An async function that receives a request object and a response object.
 * The function soft deletes the quiz from the database.
 * The function returns a response with a success flag and a message.
 * @function
 * @async
 * @param {Object} req - Express request object containing the quizId params.
 * @param {Object} res - Express response object containing the response to send back to the client.
 * @returns {Object} Returns a JSON object containing a success flag and a message.
 */
controller.SoftDeleteByQuizId = async function (req, res) {
  try {
    const quiz = await QuizModel.findById(req.params.quizId).exec(); //Get quiz by id from the database
    if (!quiz) {
      //if not present, return response with success flag False
      res.status(404).json({
        success: false,
        message: `Quiz with Id ${req.params.quizId} not found in the system.`,
      });
    } else {
      quiz.is_deleted = true;
      const updatedQuiz = await QuizModel.findByIdAndUpdate(
        req.params.quizId,
        quiz,
        { new: true, useFindAndModify: false }
      );
      res.json({
        success: true,
        message: "Quiz deleted successfully.",
      });
    }
  } catch (ex) {
    res.status(400).json({
      success: false,
      message: "Error while deleting the record.",
    });
  }
};

module.exports = controller;
