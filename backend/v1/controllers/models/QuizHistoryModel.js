const mongoose = require(`mongoose`)

mongoose.Promise = global.Promise
const { Schema } = mongoose

/**
 * A schema for Quiz History with the following properties
 * quizId , score, feedback, isCompleted, createdBy, created, updated, and is_deleted (if a Quiz History is deleted)
 */
const QuizHistories = Schema({
  quizId: { type: mongoose.Types.ObjectId, ref: 'Quizzes', required: true },
  score: { type: Number, required: true },
  feedback: { type: String, required: false },
  isCompleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'Users', required: true },
  is_deleted: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
})

QuizHistories.pre(`save`, function (callback) {
  this.updated = new Date(Date.now())
  callback()
})

const QuizHistoryModel = mongoose.model(`QuizHistories`, QuizHistories)

module.exports = QuizHistoryModel
