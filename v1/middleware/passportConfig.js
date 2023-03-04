const config = require(`../../server-settings.json`)
const passport = require(`passport`)
const exampleModel = require(`../controllers/models/exampleModel`)
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt

const JWToptions = {
    secretOrKey: config.server.secret,
    algorithms: [`HS512`],
    passReqToCallback: true,
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
    ]),
}
passport.use(
    new JwtStrategy(JWToptions, async (req, jwtPayload, done) => {
        try {
            const user = await exampleModel.findOne({_id: jwtPayload.sub})

            if (user) {
                user.password = undefined
                done(null, user, {})
            } else {
                done(null, false, {})
            }
        } catch (error) {
            return done(error, false, {})
        }
    })
)

module.exports = passport
