const passportJWT = require("./passportConfig");

const authentication = {
  /**
   * this particular function authenticates the user 
   * if jwt token is present then it authorizes the user else it will return 401 error message
   * @param {Object} req 
   * @param {Object} res 
   * @param {Object} next 
   */
  authenticate: (req, res, next) => {
    passportJWT.authenticate(`jwt`, { session: false }, (err, user, info) => {
      if (err)
        return next(err);

      if (!user)
        return res.sendStatus(401);

      req.user = user;
      return next();
    })(req, res, next);
  },

  authenticateOptional: (req, res, next) => {
    passportJWT.authenticate(`jwt`, { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      // if (!user) {
      //     return res.sendStatus(401)
      // }

      req.user = user;
      return next();
    })(req, res, next);
  }
};
module.exports = authentication;
