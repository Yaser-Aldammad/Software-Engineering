const settings = require(`../../server-settings`);
const quizItemsModel = require("./models/quizItemsModel");

const controller = {};

/**
 * @desc: validates that questions are not duplicated by checking against the provided question and its type
 *        NOTE: this is irrespective of whether or not the question is being created in a different quiz or not;
 *        duplicate questions (of same type) are simply not allowed
 * @param {*} question 
 * @param {*} type 
 * @returns true:  if question does not exist
 *          false: if question exists
 */
const validateQuestion = async function (question, type) {
  let result = false;
  const p = quizItemsModel.findOne({ question: question, type: type}).exec();
  await p.then(quizItem => {
    if (quizItem === null) {
      result = true;
    }
  });
  return result;
};

/**
 * @desc: creates a new QuizItem, after validating that it does not already exist
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
controller.createQuizItem = async function (req, res) {
    const quizItem = {
        type: req.body.type,
        question: req.body.question,
        answer: req.body.answer,
    };

    if ((await validateQuestion(user.username)) === false) {
        return res.status(400).json({ success: false, message: `That QuizItem already exists; you can either change the question or change the type!` });
    }

    const model = new quizItemsModel(user);
    const promise = model.save();
    promise
        .then(quizItem => {
            let resp = {
                success: true,
                message: "QuizItem created successfully.",
                data: { user: user, token: token }
            };
            res.json(resp);
        })
        .catch(ex => {
            console.log(ex);
    
            let resp = {
                success: false,
                message: "error"
            };
            res.status(400).json(resp);
        });

};

/**
 * @desc: creates a new QuizItem, after validating that it does not already exist
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
controller.updateQuizItem = async function (req, res) {
    const quizItem = {
        type: req.body.type,
        question: req.body.question,
        answer: req.body.answer,
    };

    if ((await validateQuestion(user.username)) === false) {
        return res.status(400).json({ success: false, message: `That QuizItem already exists; you can either change the question or change the type!` });
    }

    const model = new quizItemsModel(user);
    const promise = model.save();
    promise
        .then(quizItem => {
            let resp = {
                success: true,
                message: "QuizItem created successfully.",
                data: { user: user, token: token }
            };
            res.json(resp);
        })
        .catch(ex => {
            console.log(ex);
    
            let resp = {
                success: false,
                message: "error"
            };
            res.status(400).json(resp);
        });

};

module.exports = controller;
