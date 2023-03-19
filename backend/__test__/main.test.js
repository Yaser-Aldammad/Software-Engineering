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
const { GetUsersList } = require('../v1/controllers/Users')

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

let userCredentials = {}
let authToken
let user

jest.setTimeout(100000)

describe('Authentication Tests', () => {
  it('user signup with unique email and username', async () => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ' '
    const charactersLength = characters.length
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    var chars = 'abcdefghijklmnopqrstuvwxyz1234567890'
    var string = ''
    for (var ii = 0; ii < 15; ii++) {
      string += chars[Math.floor(Math.random() * chars.length)]
    }
    let email = string + '@gmail.com'
    userCredentials.username = result
    userCredentials.password = result
    userCredentials.email = email

    const response = await request(app).post(`/v1/signup`).send({
      first_name: userCredentials.username,
      last_name: 'test',
      email: userCredentials.email,
      username: userCredentials.username,
      password: userCredentials.password,
    })
    authToken = response.body.data.token
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('User created successfully.')
    expect(response.body.data.user.first_name).toBe(userCredentials.username)
    expect(response.body.data.user.last_name).toBe('test')
    expect(response.body.data.user.email).toBe(userCredentials.email)
  })
  it('user signup with duplicate email', async () => {
    const response = await request(app)
      .post(`/v1/signup`)
      .send({
        first_name: userCredentials.username,
        last_name: 'test',
        email: userCredentials.email,
        username: userCredentials.username + '123',
        password: userCredentials.password,
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('That email already exists')
  })

  it('user signup with duplicate username', async () => {
    const response = await request(app).post(`/v1/signup`).send({
      first_name: userCredentials.username,
      last_name: 'test',
      email: userCredentials.email,
      username: userCredentials.username,
      password: userCredentials.password,
    })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('That username already exists')
  })

  it('login valid user test', async () => {
    const response = await request(app).get(`/v1/login`).send({
      username: userCredentials.username,
      password: userCredentials.password,
    })
    authToken = response.body.data.token
    user = response.body.data.user
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('Login successful')
    expect(response.body.data.user.first_name).toBe(userCredentials.username)
    expect(response.body.data.user.last_name).toBe('test')
    expect(response.body.data.user.email).toBe(userCredentials.email)
  })

  it('login invalid user test', async () => {
    const response = await request(app).get(`/v1/login`).send({
      username: 'invalidUser',
      password: 'invalidUser',
    })
    expect(response.error.status).toBe(500)
  })
})

/**
 * Test to get all users
 * @function getAllUsersTest
 * @async
 * @param {Object} app - Express app object
 * @param {string} authToken - JWT authorization token
 * @returns {Promise<void>} - A Promise that resolves when the test finishes
 * @throws {Error} - Throws an error if the test fails
 */
describe('users test', () => {
  it('get all user test, status code 200 and data type of array', async () => {
    const response = await request(app)
      .get(`/v1/users/`)
      .set({ Authorization: `Bearer ${authToken}` })

    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.GetUsersList).toBe(userCredentials.GetUsersList)
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(response.body.message).toBe(`users listed successfully`)
  })

  it('get all users unsuccessful', async () => {
    const response = await request(app).get('/v1/users/')

    expect(response.statusCode).toBe(401)
  })

  it('get user by Id test', async () => {
    const response = await request(app)
      .get(`/v1/user/${user._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        username: userCredentials.username,
        password: userCredentials.password,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.data.first_name).toBe(userCredentials.username)
    expect(response.body.data.last_name).toBe('test')
    expect(response.body.data.email).toBe(userCredentials.email)
  })

  it('invalid user Id', async () => {
    const response = await request(app).get(
      `/v1/user/64196a36c51eb8d605d1a7411`
    )

    expect(response.statusCode).toBe(401)
  })
})
