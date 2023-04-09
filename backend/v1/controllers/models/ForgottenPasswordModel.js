const mongoose = require(`mongoose`)

mongoose.Promise = global.Promise
const { Schema } = mongoose

/**
 * a password schema for authentication
 * this schems is used when a user forgets password
 * it has user and a code
 */
const ForgetPasswordSch = Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'Users',
  },
  code: { type: String, required: true },
})

ForgetPasswordSch.set('toJSON', {})
const model = mongoose.model(`ForgetPasswords`, ForgetPasswordSch)
module.exports = model
