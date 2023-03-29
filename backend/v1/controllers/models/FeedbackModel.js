const mongoose = require(`mongoose`)

mongoose.Promise = global.Promise
const { Schema } = mongoose

/**
 * A schema for User Feedbacks with the following properties
 * quizId, description, createdBy, created, updated, and is_deleted (if a quiz is deleted)
 */
const Feedback = Schema({
  quizId: { type: mongoose.Types.ObjectId, ref: 'Quizzes', required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'Users', required: true },
  is_deleted: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
})

Feedback.pre(`save`, function (callback) {
  this.updated = new Date(Date.now())
  callback()
})

const FeedbackModel = mongoose.model(`Feedback`, Feedback)

module.exports = FeedbackModel
