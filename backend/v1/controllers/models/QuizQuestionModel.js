const mongoose = require('mongoose')

mongoose.Promise = global.Promise
const { Schema } = mongoose

const QuizItems = Schema({
  id: { type: String, generated: true },
  quiz_id: { type: mongoose.Types.ObjectId, ref: 'Quizzes', required: true },
  type: { type: String, required: true, default: 'q&a' },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'Users', required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
})

const quizItemsModel = mongoose.model('QuizQuestions', QuizItems)
module.exports = quizItemsModel
