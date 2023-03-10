const mongoose = require(`mongoose`);

mongoose.Promise = global.Promise;
const { Schema } = mongoose;

/**
 * A schema for Quiz with the following properties
 * title , quizType, description, createdBy, created, updated, and is_deleted (if a quiz is deleted)
 */
const Quizzes = Schema({
  title: { type: String, required: true },
  quizType: { type: String, required: true },
  description: { type: String, required: false },
  createdBy: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

Quizzes.pre(`save`, function (callback) {
  this.updated = new Date(Date.now());
  callback();
});

const QuizModel = mongoose.model(`Quizzes`, Quizzes);

module.exports = QuizModel;
