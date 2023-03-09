const router = require(`express`).Router();
const authentication = require("../middleware/validateJWT");


module.exports = function RouterPrivate(database, settings) {
  router.use(authentication.authenticate);
  return router;
};
