const mongoose = require(`mongoose`)

mongoose.Promise = global.Promise
const { Schema } = mongoose

/**
 * A schema for Quiz with the following properties
 * title, quizType, description, createdBy, created, updated, is_deleted (if a quiz is deleted), start_time (optional), end_time (optional)
 */
const Quizzes = Schema({
  title: { type: String, required: true },
  quizType: { type: String, required: true },
  description: { type: String, required: false },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'Users', required: true },
  is_deleted: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  start_time: { type: Date, default: null },
  end_time: { type: Date, default: null },
})

Quizzes.pre(`save`, function (callback) {
  this.updated = new Date(Date.now())
  callback()
})

const QuizModel = mongoose.model(`Quizzes`, Quizzes)

module.exports = QuizModel
