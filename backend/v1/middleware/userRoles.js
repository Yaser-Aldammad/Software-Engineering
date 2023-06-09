const UserModel = require('../controllers/models/UsersModel')

/**
 * Checks if the user has admin access.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} If there is an error finding the user.
 * @returns {Promise<void>} Returns nothing.
 */
const isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ role: req.params.role }).exec()

    if (!user && req.user.role !== 'Admin') {
      res.status(404).send('not Admin')
    }
    next()
  } catch (error) {
    res.status(502).send('there is an error')
    throw new Error('Error finding user')
  }
}
/**
 * Checks if the user has teacher access.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} If there is an error finding the user.
 * @returns {Promise<void>} Returns nothing.
 */
const isTeacher = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ role: req.params.role }).exec()

    if (!user && req.user.role !== 'Teacher') {
      res.status(401).send('not Teacher')
    }
    next()
  } catch (error) {
    res.status(502).send('there is an error')
    throw new Error('Error finding user')
  }
}
/**
 * Checks if the user has student access.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} If there is an error finding the user.
 * @returns {Promise<void>} Returns nothing.
 */
const isStudent = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ role: req.params.role }).exec()

    if (!user && req.user.role !== 'Student') {
      res.status(401).send('not student')
    }
    next()
  } catch (error) {
    res.status(502).send('there is an error')
    throw new Error('Error finding user')
  }
}
module.exports = { isStudent, isTeacher, isAdmin }
