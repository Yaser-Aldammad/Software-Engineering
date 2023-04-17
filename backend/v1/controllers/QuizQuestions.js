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
 * @desc: validates the options field of MC and SATA QuizItems; ensures that it is passed in, and that it meets a
 *        minimum size
 * @param {*} question
 * @param {*} type
 * @returns {Boolean} true:  if question does not exist
 *          false: if question exists
 */
const validateMCandSATA = async function (options) {
  if (typeof options === 'undefined') {           // options field must not pass in
    return '-1'
  } else if (options.length < 3) {                // options is of length 0-2 (not really multiple choice)
    return '-2'
  }
}

/**
 * @desc: validates the (exclusive) answers  field of SATA QuizItems; ensures that it is passed in, that it meets a
 *        certain size (0-size of available options), and most importantly that the provided answers are within the
 *        list of available options (works even if answers is an empty list; that is none of the options is correct
 *        or should be selected by the quiz-taker)
 * @param {*} question
 * @param {*} type
 * @returns {Boolean} true:  if question does not exist
 *          false: if question exists
 */
const validateSATA = async function(options, answers) {
  if (typeof answers === 'undefined') {           // answers field was not passed in
    return '-1'
  } else if (answers.length > options.length) {   // set of possible answers is more than available options
    return '-2'
  } 
  optsSet = new Set(options)
  if (answers.every(ans => optsSet.has(ans))) {   // there's an answer not in the list of available options
    return '-3'
  }

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
      options: req.body.options,
      createdBy: req.user._id,
    }

    // ensure that quizitem (of same question and same type) does not exist already
    if ((await validateQuestion(quizItem.question, quizItem.type)) === false) {
      return res.status(400).json({
        success: false,
        message: `That QuizItem already exists; you can either change the question or change the type!`
      })
    }

    // validate properties for MC and SATA quizitems
    if (quizItem.type === 'MC' || quizItem.type === 'SATA') {   
      valOpts = await validateMCandSATA(quizItem.options)
      if (valOpts === '-1') {                 // options field was not passed in
        return res.status(400).json({
          success: false,
          message: `You must provide options for multiple choice QuizItems!`
        })
      } else if (valOpts === '-2') {          // length of options is between 0-2
        return res.status(400).json({         
          success: false,
          message: `Length of options for multiple choice QuizItems must be greater than 2!`
        })
      }
    }
    
    // validate SATA QuizItem types
    if (quizItem.type === 'SATA') {
      valSATA = await validateSATA(quizItem.options, quizItem.answers)
      if (valSATA === '-1') {                 // answers field was not passed in
        return res.status(400).json({
          success: false,
          message: `You must provide a set of answers (0 - size of options) for select-all-that-apply QuizItems!`,
        })
      } else if (valSATA === '-2') {          // set of possible answers is more than available options
        return res.status(400).json({
          success: false,
          message: `Set of answers for select-all-that-apply QuizItems cannot be more than the available options!`
        })
      } else if (valSATA === '-3') {          // there's an answer not in the list of available options
        return res.status(400).json({
          success: false,
          message: `One of the provided answers is NOT in the list of available options!`
        })
      }
    }

    // create and save quizitem
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
      options: req.body.options ?? record.options,
      createdBy: req.user._id ?? record.createdBy,
    }

    // change in quizitem type; we know that if quizitem was originally (created) as type 
    // MC or SATA, the createQuizItem method will have validated its properties so we only 
    // bother checking (specifically) if the type of the quizitem is being changed to 'MC' or 'SATA'
    if (record.type !== 'MC' && (quizItem.type === 'MC' || quizItem.type === 'SATA')) {    
      valOpts = await validateMCandSATA(quizItem.options)
      if (valOpts === '-1') {                 // options field was not passed in
        return res.status(400).json({
          success: false,
          message: `You must provide options for multiple choice QuizItems!`
        })
      } else if (valOpts === '-2') {          // length of options is between 0-2
        return res.status(400).json({         
          success: false,
          message: `Length of options for multiple choice QuizItems must be greater than 2!`
        })
      }
    }

    // additional validation if updating QuizItem to SATA
    if (record.type !== 'MC' && quizItem.type === 'SATA') {    
      valSATA = await validateSATA(quizItem.options, quizItem.answers)
      if (valSATA === '-1') {                 // answers field was not passed in
        return res.status(400).json({
          success: false,
          message: `You must provide a set of answers (0 - size of options) for select-all-that-apply QuizItems!`,
        })
      } else if (valSATA === '-2') {          // set of possible answers is more than available options
        return res.status(400).json({
          success: false,
          message: `Set of answers for select-all-that-apply QuizItems cannot be more than the available options!`
        })
      } else if (valSATA === '-3') {          // there's an answer not in the list of available options
        return res.status(400).json({
          success: false,
          message: `One of the provided answers is NOT in the list of available options!`
        })
      }
    }

    // update and retrieve updated record
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
    // filter by id of request(er)
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
    // no 'hard' filter; retrieves all quizitems
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
    // filters by quiz id
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
 * @description: finds and retrieves the QuizItems of type question-and-answer (Q/A)
 * @param {*} req
 * @param {*} res
 * @returns {Object}
 */
controller.getQAQuizItems = async function (req, res) {
  try {
    // filter by type 'Q/A'
    const quizItems = await quizItemsModel
      .find({ type: 'Q/A'})
      .populate(['quiz_id', 'createdBy'])
      .exec()

    if (!quizItems) {
      let resp = {
        success: false,
        message: 'Q/A QuizItems not found!',
      }
      return res.status(404).json(resp)
    }

    let resp = {
      success: true,
      message: 'Q/A QuizItems found and retrieved!',
      data: { quizitems: quizItems },
    }
    return res.status(200).json(resp)
  } catch (error) {
    console.log(error)

    let resp = {
      success: false,
      message: `QuizItems not found!`,
    }
    res.status(404).json(resp)
  }
}

/**
 * @description: finds and retrieves all QuizItems of type multiple choice (MC)
 * @param {*} req
 * @param {*} res
 * @returns {Object}
 */
controller.getMCQuizItems = async function (req, res) {
  try {
    // filter by type 'MC'
    const quizItems = await quizItemsModel
      .find({ type:  'MC'})
      .populate(['quiz_id', 'createdBy'])
      .exec()

    if (!quizItems) {
      let resp = {
        success: false,
        message: 'MC QuizItems not found!',
      }
      return res.status(404).json(resp)
    }

    let resp = {
      success: true,
      message: 'MC QuizItems found and retrieved!',
      data: { quizitems: quizItems },
    }
    return res.status(200).json(resp)
  } catch (error) {
    console.log(error)

    let resp = {
      success: false,
      message: `QuizItems not found!`,
    }
    res.status(404).json(resp)
  }
}

/**
 * @description: finds and retrieves all QuizItems of type select-all-that-apply (SATA)
 * @param {*} req
 * @param {*} res
 * @returns {Object}
 */
controller.getSATAQuizItems = async function (req, res) {
  try {
    // filter by type 'MC'
    const quizItems = await quizItemsModel
      .find({ type:  'SATA'})
      .populate(['quiz_id', 'createdBy'])
      .exec()

    if (!quizItems) {
      let resp = {
        success: false,
        message: 'SATA QuizItems not found!',
      }
      return res.status(404).json(resp)
    }

    let resp = {
      success: true,
      message: 'SATA QuizItems found and retrieved!',
      data: { quizitems: quizItems },
    }
    return res.status(200).json(resp)
  } catch (error) {
    console.log(error)

    let resp = {
      success: false,
      message: `QuizItems not found!`,
    }
    res.status(404).json(resp)
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
    // attempts to retrieve quizitem associated with request(er's) quizitem id
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
