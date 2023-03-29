const settings = require(`../../server-settings`)
const quizItemsModel = require('./models/QuizQuestionModel')

const controller = {}

/**
 * @desc: validates that questions are not duplicated by checking against the provided question and its type
 *        NOTE: this is irrespective of whether or not the question is being created in a different quiz or not;
 *        duplicate questions (of same type) are simply not allowed
 * @param {*} question
 * @param {*} type
 * @returns {Boolean} true:  if question does not exist
 *          false: if question exists
 */
const validateQuestion = async function (question, type) {
  let result = false
  const p = quizItemsModel.findOne({ question: question, type: type }).exec()
  await p.then((quizItem) => {
    if (quizItem === null) {
      result = true
    }
  })
  return result
}

/**
 * @desc: creates a new QuizItem, after validating that it (combination of question and type) does not already exist
 * @param {*} req
 * @param {*} res
 * @returns {Object}
 */
controller.createQuizItem = async function (req, res) {
  try {
    const quizItem = {
      quiz_id: req.body.quiz_id,
      type: req.body.type,
      question: req.body.question,
      answer: req.body.answer,
      createdBy: req.user._id,
    }

    if ((await validateQuestion(quizItem.question, quizItem.type)) === false) {
      return res.status(400).json({
        success: false,
        message: `That QuizItem already exists; you can either change the question or change the type!`,
      })
    }

    const model = new quizItemsModel(quizItem)
    await model.save()

    let question = await quizItemsModel
      .findById(model._id)
      .populate(['quiz_id', 'createdBy'])
      .exec()

    return res.status(200).json({ success: true, data: question })
  } catch (e) {
    return res.status(400).json({ success: false, error: e })
  }
}

/**
 * @desc: updates the properties of a quiz given the newly specified properties
 * @param {*} req
 * @param {*} res
 * @returns {Object}
 */
controller.updateQuizItem = async function (req, res) {
  try {
    const record = await quizItemsModel.findById(req.params.id)

    if (!record) {
      let resp = {
        success: false,
        message: 'QuizItem not found!',
      }
      return res.status(404).json(resp)
    }

    const quizItem = {
      quiz_id: req.body.quiz_id ?? record.quiz_id,
      type: req.body.type ?? record.type,
      question: req.body.question ?? record.question,
      answer: req.body.answer ?? record.answer,
      createdBy: req.user._id ?? record.createdBy,
    }

    let updatedQuizItem = await quizItemsModel
      .findByIdAndUpdate(req.params.id, quizItem, {
        new: true,
        useFindAndModify: false,
      })
      .populate(['quiz_id', 'createdBy'])
      .exec()

    let resp = {
      success: true,
      message: 'QuizItem updated successfully.',
      data: { quizItem: updatedQuizItem },
    }

    return res.status(200).json(resp)
  } catch (error) {
    let resp = {
      success: false,
      message: error,
    }
    return res.status(400).json(resp)
  }
}

/**
 * @description: finds and retrieves the corresponding QuizItem from its id, if it exists, and returns it to the user
 * @param {*} req
 * @param {*} res
 * @returns {Object}
 */
controller.getQuizItem = async function (req, res) {
  try {
    const quizItem = await quizItemsModel
      .findById(req.params.id)
      .populate(['quiz_id', 'createdBy'])
      .exec()

    if (!quizItem) {
      let resp = {
        success: false,
        message: 'QuizItem not found!',
      }
      return res.status(404).json(resp)
    }

    let resp = {
      success: true,
      message: 'QuizItem found!',
      data: { quizItem: quizItem },
    }
    return res.status(200).json(resp)
  } catch (error) {
    console.log(error)

    let resp = {
      success: false,
      message: 'error',
    }
    res.status(400).json(resp)
  }
}

/**
 * @description: finds and retrieves all existing QuizItems, if any
 * @param {*} req
 * @param {*} res
 * @returns {Object}
 */
controller.getQuizItems = async function (req, res) {
  try {
    const quizItems = await quizItemsModel
      .find()
      .populate(['quiz_id', 'createdBy'])
      .exec()

    if (!quizItems) {
      let resp = {
        success: false,
        message: 'QuizItems not found!',
      }
      return res.status(404).json(resp)
    }

    let resp = {
      success: true,
      message: 'QuizItems found!',
      data: { quizItems: quizItems },
    }
    return res.status(200).json(resp)
  } catch (error) {
    console.log(error)

    let resp = {
      success: false,
      message: 'error',
    }
    res.status(400).json(resp)
  }
}

/**
 * @description: finds and retrieves the QuizItems under a specific Quiz from its (Quiz') id, if they exist
 * @param {*} req
 * @param {*} res
 * @returns {Object}
 */
controller.getQuizItemsByQuizId = async function (req, res) {
  try {
    const quizItems = await quizItemsModel
      .find({ quiz_id: req.params.id })
      .populate(['quiz_id', 'createdBy'])
      .exec()

    if (!quizItems) {
      let resp = {
        success: false,
        message: 'QuizItems not found!',
      }
      return res.status(404).json(resp)
    }

    let resp = {
      success: true,
      message: 'QuizItems found!',
      data: { quizItems: quizItems },
    }
    return res.status(200).json(resp)
  } catch (error) {
    console.log(error)

    let resp = {
      success: false,
      message: 'Quiz does not exist!',
    }
    res.status(400).json(resp)
  }
}

/**
 * @description: finds and retrieves the corresponding QuizItem from its id, if it exists, then deletes it
 * @param {*} req
 * @param {*} res
 * @returns {Object}
 */
controller.deleteQuizItem = async function (req, res) {
  try {
    const quizItem = await quizItemsModel
      .findById(req.params.id)
      .populate(['quiz_id', 'createdBy'])
      .exec()

    if (!quizItem) {
      let resp = {
        success: false,
        message: 'QuizItem not found!',
      }
      return res.status(404).json(resp)
    }

    await quizItem.remove()

    let resp = {
      success: true,
      message: 'Successfully deleted!',
      data: { quizItems: quizItem },
    }
    return res.status(200).json(resp)
  } catch (error) {
    console.log(error)

    let resp = {
      success: false,
      message: 'error',
    }
    res.status(400).json(resp)
  }
}

module.exports = controller
