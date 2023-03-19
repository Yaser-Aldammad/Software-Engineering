const express = require(`express`)
const mongoose = require('mongoose')
const cors = require(`cors`)
const privateRouter = require('../v1/routes/router-private')
const publicRouter = require('../v1/routes/router-public')
const settings = require('../server-settings.json')
const request = require('supertest')
const passport = require(`passport`)
const createHttpError = require('http-errors')
const session = require(`express-session`)
const MongoStore = require('connect-mongo')

const testPort = process.env.testPort || settings.server.testPort || 8080

const connectString = settings.database.testDBconnectionString

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(
  session({
    store: MongoStore.create({ mongoUrl: connectString }),
    name: `${settings.server.name} Cookie`,
    secret: `${settings.server.name} SessionSecret`,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: settings.server.sessionDurationSeconds * 1000,
    },
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/v1', publicRouter())
app.use('/v1', privateRouter())

app.use(() => {
  throw createHttpError(404, 'Route not found')
})
beforeAll(() => {
  app.listen(testPort, () => {})
  mongoose
    .connect(connectString)
    .then(() => {})
    .catch(() => {
      throw createHttpError(501, 'Unable to connect database')
    })
})
beforeEach(function () {
  jest.setTimeout(10000)
})

// let userCredentials = {}
// let authToken
// let user


jest.setTimeout(100000)

it('example test case', async () => {})

