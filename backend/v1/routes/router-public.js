const router = require(`express`).Router()
const { Router } = require('express')
const _auth = require(`../auth`)
const users = require(`../controllers/Users`)
/**
 * Public router
 * @param {*} database
 * @param {*} settings
 * @returns {Router}
 */
module.exports = function RouterPublic(database, settings) {
  const db = database
  const auth = _auth()

  // Auth
  /**
   * routes GET /login to route to the login pages
   */
  router.get(`/login`, auth.isUserAuthenticated, async (req, res) => {
    data = req.user
    data.user.password = undefined
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: data,
    })
  })
  /**
   * /signup this will route to the signup page
   */
  router.route(`/signup`).post(users.AddUser)
  //router.route(`/upload/:id`).post(upload.single("img"), users.uploadImage);
  router.route(`/forget-password`).post(users.ForgetPassword)
  router.route(`/forget-password-verify`).post(users.ForgetPasswordVerify)

  return router
}
