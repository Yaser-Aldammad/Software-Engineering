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
const {
  GetUsersList,
  UpdateUser,
  DeleteUser,
} = require('../v1/controllers/Users')
const usermodel = require(`../v1/controllers/models/UsersModel`)

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
app.use('/v1', privateRouter('', settings))

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
let createdQuiz

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

  it('logout user test with Auth token', async () => {
    const response = await request(app)
      .get(`/v1/logout`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
  })

  it('logout user test without Auth Token', async () => {
    const response = await request(app).get(`/v1/logout`)
    expect(response.statusCode).toBe(401)
    expect(response.error.text).toBe('Unauthorized')
  })
})

/*
A test block containing tests for Quiz API
* Tests for Create, Update, Get all, Get by id, and Delete by id endpoints
*/
describe('Quiz API Tests', () => {
  // #region Tests for Create APIs

  // Test invalid authentication for quiz create api
  it('quiz create: invalid authentication token', async () => {
    const response = await request(app)
      .post(`/v1/quiz`)
      .set({ Authorization: `Bearer ${authToken}test` })
      .send({
        title: '',
        description: 'Testing Quiz Data Add - Description',
        quizType: 'Quiz type test',
      })
    expect(response.statusCode).toBe(401)
  })

  // Test quiz create api using invalid data
  it('quiz create: invalid data', async () => {
    const response = await request(app)
      .post(`/v1/quiz`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        title: '',
        description: 'Testing Quiz Data Add - Description',
        quizType: 'Quiz type test',
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Unable to create the quiz.')
  })

  // Test correct working of quiz create api
  it('quiz create: valid data', async () => {
    let title = 'Testing Quiz Data Add - Title'
    let description = 'Testing Quiz Data Add - Description'
    let quizType = 'Quiz type test'
    const response = await request(app)
      .post(`/v1/quiz`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        title: title,
        description: description,
        quizType: quizType,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('Quiz created successfully.')
    expect(response.body.data.quiz.title).toBe(title)
    expect(response.body.data.quiz.description).toBe(description)
    expect(response.body.data.quiz.quizType).toBe(quizType)
    expect(response.body.data.quiz.createdBy.username).toBe(
      userCredentials.username
    )
    expect(response.body.data.quiz.is_deleted).toBe(false)
    createdQuiz = response.body.data.quiz
    quiz = response.body.data.quiz
  })

  //#endregion

  // #region Tests for Update APIs

  // Test invalid authentication for quiz update api
  it('quiz update: invalid authentication token', async () => {
    const response = await request(app)
      .patch(`/v1/quiz/${createdQuiz._id}`)
      .set({ Authorization: `Bearer ${authToken}test` })
      .send({
        title: '',
        description: 'Testing Quiz Data - Description',
        quizType: 'Quiz type test',
      })
    expect(response.statusCode).toBe(401)
  })

  // Test quiz update api with invalid id
  it('quiz update: invalid id', async () => {
    const response = await request(app)
      .patch(`/v1/quiz/randomid`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        title: ' -EDITED Version',
        description: 'Testing Quiz Data Add - Description -EDITED Version',
        quizType: 'Quiz type test -EDITED Version',
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe(
      `Quiz with Id randomid not found in the system.`
    )
  })

  // Test quiz update api with valid id and data
  it('quiz update: valid id and data', async () => {
    let title = 'Testing Quiz Data Add - Title - EDITED_VERSION'
    let description = 'Testing Quiz Data Add - Description - EDITED_VERSION'
    let quizType = 'Quiz type test - EDITED_VERSION'
    const response = await request(app)
      .patch(`/v1/quiz/${createdQuiz._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        title: title,
        description: description,
        quizType: quizType,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('Quiz updated successfully.')
    expect(response.body.data.quiz.title).toBe(title)
    expect(response.body.data.quiz.description).toBe(description)
    expect(response.body.data.quiz.quizType).toBe(quizType)
    expect(response.body.data.quiz.createdBy.username).toBe(
      userCredentials.username
    )
    expect(response.body.data.quiz.is_deleted).toBe(false)
    createdQuiz = response.body.data.quiz
  })

  //#endregion

  //#region Tests for Get APIs

  // Test invalid authentication for get all quiz api
  it('get all quizzes: invalid authentication token', async () => {
    const response = await request(app)
      .get(`/v1//quiz`)
      .set({ Authorization: `Bearer ${authToken}test` })
    expect(response.statusCode).toBe(401)
  })

  // Test correct working of get all quiz api
  it('get all quizzes: valid', async () => {
    const response = await request(app)
      .get(`/v1//quiz`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('Successfully fetched all records.')
    expect(Array.isArray(response.body.data.quizzes)).toBe(true)
  })

  // Test invalid authentication for get by id quiz api
  it('get quiz by id: invalid authentication token', async () => {
    const response = await request(app)
      .get(`/v1//quiz/random_id`)
      .set({ Authorization: `Bearer ${authToken}test` })
    expect(response.statusCode).toBe(401)
  })

  // Test invalid id for get by id quiz api
  it('get quiz by id: invalid id', async () => {
    const response = await request(app)
      .get(`/v1//quiz/random_id`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe(
      `Quiz with Id random_id not found in the system.`
    )
  })

  // Test correct working of get by id quiz api
  it('get quiz by id: valid id', async () => {
    const response = await request(app)
      .get(`/v1//quiz/${createdQuiz._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.data.quiz.title).toBe(createdQuiz.title)
    expect(response.body.data.quiz.description).toBe(createdQuiz.description)
    expect(response.body.data.quiz.quizType).toBe(createdQuiz.quizType)
    expect(response.body.data.quiz.createdBy.username).toBe(
      createdQuiz.createdBy.username
    )
    expect(response.body.data.quiz.is_deleted).toBe(false)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('Successfully fetched the record.')
  })

  //#endregion

  // #region Tests for Delete APIs

  // Test invalid authentication in delete quiz api
  it('delete quiz by id: invalid authentication token', async () => {
    const response = await request(app)
      .delete(`/v1//quiz/${createdQuiz._id}`)
      .set({ Authorization: `Bearer ${authToken}test` })
    expect(response.statusCode).toBe(401)
  })

  // Test invalid id in delete quiz api
  it('delete quiz by id: invalid id', async () => {
    const response = await request(app)
      .delete(`/v1//quiz/random_id`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Error while deleting the record.')
  })

  // Test correct working of delete quiz api
  it('delete quiz by id: valid id', async () => {
    const response = await request(app)
      .delete(`/v1//quiz/${createdQuiz._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('Quiz deleted successfully')
  })

  // Test to confirm deletion
  it('delete quiz by id: confirming the quiz is deleted', async () => {
    const response = await request(app)
      .get(`/v1//quiz/${createdQuiz._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe(
      `Quiz with Id ${createdQuiz._id} not found in the system.`
    )
  })

  //#endregion
})

/*
A test block containing tests for QuizItems API
* Tests for Create, Update, Get, Get all, Get by id, and Delete by id endpoints
*/
describe('QuizItems API Tests', () => {
  // Variable to store the created quiz which will be used for get, update and delete
  let createdQuizItem

  // #region Tests for Create APIs
  // Test invalid authentication for Create QuizItem API
  it('QuizItem create: invalid authentication token', async () => {
    const response = await request(app)
      .post(`/v1/createQuizItem`)
      .set({ Authorization: `Bearer ${authToken}test` })
      .send({
        quiz_id: '',
        type: 'Q/A',
        question: 'test question',
        answer: 'test',
      })
    expect(response.statusCode).toBe(401)
  })

  // Test QuizItem create api using invalid data
  it('QuizItem create: invalid data', async () => {
    const response = await request(app)
      .post(`/v1/createQuizItem`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        quiz_id: '',
        type: 'Q/A',
        answer: 'test anwser',
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
  })

  // Test correct working of createQuizItem for Q/A
  it('QuizItem create: valid data', async () => {
    const response = await request(app)
      .post(`/v1/createQuizItem`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        quiz_id: quiz._id,
        type: 'Q/A',
        question: 'some question',
        answer: '42',
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    createdQuizItem = response.body.data
  })

  // Test incorrect working of createQuizItem for MC/SATA (missing options field)
  it('QuizItem create: valid data', async () => {
    const response = await request(app)
      .post(`/v1/createQuizItem`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        quiz_id: quiz._id,
        type: 'MC',
        question: 'some question',
        answer: '42',
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe(
      'You must provide options for MC/SATA QuizItems!'
    )
    createdQuizItem = response.body.data
  })

  // Test correct working of createQuizItem for MC/SATA (options field passed in with request)
  it('QuizItem create: valid data', async () => {
    const response = await request(app)
      .post(`/v1/createQuizItem`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        quiz_id: quiz._id,
        type: 'MC',
        question: 'some question',
        answer: '42',
        options: ['40', '41', '42', '43'],
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    createdQuizItem = response.body.data
  })

  // Test incorrect working of createQuizItem for SATA (missing answers field)
  it('QuizItem create: valid data', async () => {
    const response = await request(app)
      .post(`/v1/createQuizItem`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        quiz_id: quiz._id,
        type: 'SATA',
        question: 'some question',
        options: ['40', '41', '42', '43'],
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe(
      'You must provide a set of answers (0 - size of options) for select-all-that-apply QuizItems!'
    )
  })

  // Test correct working of createQuizItem for SATA (answers field passed in with request)
  it('QuizItem create: valid data', async () => {
    const response = await request(app)
      .post(`/v1/createQuizItem`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        quiz_id: quiz._id,
        type: 'SATA',
        question: 'some question',
        answers: ['2', '4'],
        options: ['1', '2', '3', '4'],
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    createdQuizItem = response.body.data
  })

  // Test correct working of duplicate QuizItem error
  it('QuizItem create: Duplicate', async () => {
    const response = await request(app)
      .post(`/v1/createQuizItem`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        quiz_id: quiz._id,
        type: 'Q/A',
        question: user.username,
        answer: '42',
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe(
      'That QuizItem already exists; you can either change the question or change the type!'
    )
  })
  // #endregion

  // #region Tests for Update QuizItems API
  // Test invalid authentication for quiz update api
  it('QuizItem update: invalid authentication token', async () => {
    const response = await request(app)
      .patch(`/v1/updateQuizItem/${createdQuizItem._id}`)
      .set({ Authorization: `Bearer ${authToken}test` })
      .send({
        quiz_id: new_quiz_id,
        type: mc_qi_type,
        answer: new_qi_answer,
      })
    expect(response.statusCode).toBe(401)
  })

  // Test updateQuizItem with invalid id
  let fake_id = '62a35e4f39d32119b8432caa'
  it('QuizItem update: invalid QuizItem id', async () => {
    const response = await request(app)
      .patch(`/v1/updateQuizItem/${fake_id}`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        type: 'MC',
        answer: '43',
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe(`QuizItem not found!`)
  })

  // Test incorrect working of updateQuizItem to MC/SATA (missing options data)
  it('QuizItem update: valid id and missing options data', async () => {
    const response = await request(app)
      .patch(`/v1/updateQuizItem/${createdQuizItem._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        type: 'MC',
        answer: '43',
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe(
      'You must provide options for MC/SATA QuizItems!'
    )
  })

  // Test correct working of updateQuizItem to MC/SATA (includes options data)
  it('QuizItem update: valid id and data', async () => {
    const response = await request(app)
      .patch(`/v1/updateQuizItem/${createdQuizItem._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        quiz_id: 'q5',
        type: 'MC',
        answer: '43',
        options: ['40', '41', '42', '43'],
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('QuizItem updated successfully.')
    createdQuizItem = response.body.data
  })

  // Test incorrect working of updateQuizItem to SATA (missing answers data)
  it('QuizItem update: valid id and missing answers data', async () => {
    const response = await request(app)
      .patch(`/v1/updateQuizItem/${createdQuizItem._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        type: 'SATA',
        question: 'some question',
        options: ['1', '2', '3', '4'],
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe(
      'You must provide a set of answers (0 - size of options) for select-all-that-apply QuizItems!'
    )
  })

  // Test correct working of updateQuizItem for SATA (answers field passed in with request)
  it('QuizItem create: valid id and data', async () => {
    const response = await request(app)
      .patch(`/v1/updateQuizItem/${createdQuizItem._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        type: 'SATA',
        question: 'some question',
        answers: ['2', '4'],
        options: ['1', '2', '3', '4'],
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('QuizItem updated successfully.')
    createdQuizItem = response.body.data
  })
  // #endregion

  // #region Tests for Get APIs
  // Test invalid authentication for getQuizItem by QuizItem ID
  it('Get QuizItem by QuizItem ID: invalid authentication token', async () => {
    const response = await request(app)
      .get(`/v1/getQuizItem/${createdQuizItem._id}`)
      .set({ Authorization: `Bearer ${authToken}test` })
    expect(response.statusCode).toBe(401)
  })

  // Test invalid QuizItem ID for getQuizItem by QuizItem ID
  it('Get QuizItem by QuizItem ID: invalid QuizItem ID', async () => {
    const response = await request(app)
      .get(`/v1/getQuizItem/${fake_id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe(`QuizItem not found!`)
  })

  // Test correctness of getQuizItem by QuizItem ID
  it('Get QuizItem by QuizItem ID: valid QuizItem ID', async () => {
    const response = await request(app)
      .get(`/v1/getQuizItem/${createdQuizItem._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe(`QuizItem found!`)
  })

  // Test correctness of getQuizItems
  it('Get all QuizItems', async () => {
    const response = await request(app)
      .get(`/v1/getQuizItems`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('QuizItems found!')
    expect(Array.isArray(response.body.data.quizItems)).toBe(true)
  })

  // Test correctness of getQAQuizItems
  it('Get Q/A QuizItems', async () => {
    const response = await request(app)
      .get(`/v1/getQAQuizItems`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('QA QuizItems found and retrieved!')
    expect(Array.isArray(response.body.data.quizItems)).toBe(true)
  })

  // Test correctness of getMCQuizItems
  it('Get MC QuizItems', async () => {
    const response = await request(app)
      .get(`/v1/getMCQuizItems`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('MC QuizItems found and retrieved!')
    expect(Array.isArray(response.body.data.quizItems)).toBe(true)
  })

  // Test correctness of getSATAQuizItems
  it('Get SATA QuizItems', async () => {
    const response = await request(app)
      .get(`/v1/getSATAQuizItems`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('SATA QuizItems found and retrieved!')
    expect(Array.isArray(response.body.data.quizItems)).toBe(true)
  })

  //Test invalid Quiz ID for getQuizItemsByQuizId
  it('Get all QuizItems under a Quiz: invalid Quiz ID', async () => {
    const response = await request(app)
      .get(`/v1/getQuizItemsByQuizId/${fake_id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    console.log(response.body)
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.quizItems).toHaveLength(0)
  })

  // Test correctness of getQuizItemsByQuizId
  it('Get all QuizItems under a Quiz: valid Quiz ID', async () => {
    const response = await request(app)
      .get(`/v1/getQuizItemsByQuizId/${quiz._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('QuizItems found!')
    expect(Array.isArray(response.body.data.quizItems)).toBe(true)
  })
  //#endregion

  // #region Tests for Delete APIs
  // Test invalid authentication in delete quiz api
  it('Delete QuizItem by id: invalid authentication token', async () => {
    const response = await request(app)
      .delete(`/v1/deleteQuizItem/${createdQuizItem._id}`)
      .set({ Authorization: `Bearer ${authToken}test` })
    expect(response.statusCode).toBe(401)
  })

  // Test invalid id of QuizItem delete api
  it('Delete QuizItem by ID: invalid ID', async () => {
    const response = await request(app)
      .delete(`/v1/deleteQuizItem/${fake_id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe(`QuizItem not found!`)
  })

  // Test correct working of QuizItem delete api
  it('Delete QuizItem by ID: valid id', async () => {
    const response = await request(app)
      .delete(`/v1/deleteQuizItem/${createdQuizItem._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe(`Successfully deleted!`)
  })

  // Test to confirm deletion of QuizItem
  it('Delete QuizItem by ID: confirming the QuizItem is deleted', async () => {
    const response = await request(app)
      .get(`/v1/deleteQuizItem/${createdQuizItem._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(404)
  })
  //#endregion
})

// #region Tests for feedback APIs
describe('feedback tests', () => {
  let feedback
  it('create feedback success', async () => {
    const response = await request(app)
      .post(`/v1/feedback`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        description: 'test description',
        quizId: createdQuiz._id,
      })
    feedback = response.body.data
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
  })

  it('create feedback invalid data', async () => {
    const response = await request(app)
      .post(`/v1/feedback`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        quizId: createdQuiz._id,
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
  })

  it('create feedback invalid Auth token', async () => {
    const response = await request(app)
      .post(`/v1/feedback`)
      .set({ Authorization: `Bearer ${authToken}test` })
      .send({
        description: 'test description',
        quizId: createdQuiz._id,
      })
    expect(response.statusCode).toBe(401)
  })

  it('get feedback by id success', async () => {
    const response = await request(app)
      .get(`/v1/feedback/${feedback._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
  })

  it('get feedback by invalid id', async () => {
    const response = await request(app)
      .get(`/v1/feedback/jhbchasj`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
  })

  it('get feedback by id not found', async () => {
    const response = await request(app)
      .get(`/v1/feedback/6424089651495dd0071d1e1a`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
  })

  it('get feedback by id with invalid Auth token', async () => {
    const response = await request(app)
      .get(`/v1/feedback/6424089651495dd0071d1e1a`)
      .set({ Authorization: `Bearer ${authToken}test` })
    expect(response.statusCode).toBe(401)
  })

  it('get all feedback', async () => {
    const response = await request(app)
      .get(`/v1/feedbacks`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
  })

  it('get all feedback invalid auth token', async () => {
    const response = await request(app)
      .get(`/v1/feedbacks`)
      .set({ Authorization: `Bearer ${authToken}test` })
    expect(response.statusCode).toBe(401)
  })

  it('soft delete feedback by id success', async () => {
    const response = await request(app)
      .delete(`/v1/feedback/softdelete/${feedback._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
  })

  it('soft delete feedback by id invalid Id', async () => {
    const response = await request(app)
      .delete(`/v1/feedback/softdelete/hsddjhabs`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
  })

  it('soft delete feedback by id not found', async () => {
    const response = await request(app)
      .delete(`/v1/feedback/softdelete/6424089651495dd0071d1e1a`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
  })

  it('soft delete feedback by id invalid auth token', async () => {
    const response = await request(app)
      .delete(`/v1/feedback/softdelete/${feedback._id}`)
      .set({ Authorization: `Bearer ${authToken}test` })
    expect(response.statusCode).toBe(401)
  })

  it('update feedback by id success', async () => {
    const response = await request(app)
      .patch(`/v1/feedback/${feedback._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        is_deleted: false,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
  })

  it('update feedback by id invalid Id', async () => {
    const response = await request(app)
      .patch(`/v1/feedback/sdasd`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        is_deleted: false,
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
  })

  it('update feedback by id not found', async () => {
    const response = await request(app)
      .patch(`/v1/feedback/6424089651495dd0071d1e1a`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        is_deleted: false,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
  })

  it('update feedback by id invalid token', async () => {
    const response = await request(app)
      .patch(`/v1/feedback/${feedback._id}`)
      .set({ Authorization: `Bearer ${authToken}test` })
      .send({
        is_deleted: false,
      })
    expect(response.statusCode).toBe(401)
  })

  it('parmanent delete feedback by id success', async () => {
    const response = await request(app)
      .delete(`/v1/feedback/${feedback._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
  })

  it('parmanent delete feedback by invalid id', async () => {
    const response = await request(app)
      .delete(`/v1/feedback/hbhbjnn`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
  })

  it('parmanent delete feedback by id not found', async () => {
    const response = await request(app)
      .delete(`/v1/feedback/6424089651495dd0071d1e1a`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
  })

  it('parmanent delete feedback by id invalid auth token', async () => {
    const response = await request(app)
      .delete(`/v1/feedback/${feedback._id}`)
      .set({ Authorization: `Bearer ${authToken}test` })
    expect(response.statusCode).toBe(401)
  })

  it('get feedbacks by userId success', async () => {
    const response = await request(app)
      .get(`/v1/userId/feedback`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
  })

  it('get feedbacks by userId invalid auth tokens', async () => {
    const response = await request(app)
      .get(`/v1/userId/feedback`)
      .set({ Authorization: `Bearer ${authToken}test` })
    expect(response.statusCode).toBe(401)
  })
})
//#endregion

/*
A test block containing tests for Quiz History API
* Tests for Create, Update, Get all, Get by id, and Delete by id endpoints
*/
describe('Quiz History API Tests', () => {
  // Variable to store the created quiz which will be used for creating quiz history
  let createdQuiz
  // Variable to store the created quiz history which will be used for get and delete
  let createdQuizHistory

  // Creating Quiz for data to test Quiz History

  // Test correct working of quiz create api
  it('quiz history: creating quiz for quiz history testing', async () => {
    let title = 'Testing Quiz Data Add - Title'
    let description = 'Testing Quiz Data Add - Description'
    let quizType = 'Quiz type test'
    const response = await request(app)
      .post(`/v1/quiz`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        title: title,
        description: description,
        quizType: quizType,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('Quiz created successfully.')
    expect(response.body.data.quiz.title).toBe(title)
    expect(response.body.data.quiz.description).toBe(description)
    expect(response.body.data.quiz.quizType).toBe(quizType)
    expect(response.body.data.quiz.createdBy.username).toBe(
      userCredentials.username
    )
    expect(response.body.data.quiz.is_deleted).toBe(false)
    createdQuiz = response.body.data.quiz
  })

  //#endregion

  // #region Tests for Create APIs

  // Test invalid authentication for quiz history create api
  it('quiz history create: invalid authentication token', async () => {
    const response = await request(app)
      .post(`/v1/quizhistory`)
      .set({ Authorization: `Bearer ${authToken}test` })
      .send({
        quizId: 1,
      })
    expect(response.statusCode).toBe(401)
  })

  // Test quiz history create api using invalid data
  it('quiz history create: invalid data', async () => {
    const response = await request(app)
      .post(`/v1/quizhistory`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        quizId: null,
        score: 5,
        feedback: 'Feed back',
        isCompleted: true,
      })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Unable to create the quiz history.')
  })

  // Test correct working of quiz history create api
  it('quiz history create: valid data', async () => {
    let score = 5
    let feedback = 'Feedback Testing for QUIZ HISTORY'
    let isCompleted = true
    const response = await request(app)
      .post(`/v1/quizhistory`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        quizId: createdQuiz._id,
        score: score,
        feedback: feedback,
        isCompleted: isCompleted,
      })
    expect(response.body.message).toBe('Quiz history created successfully.')
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.quizHistory.quizId).toBe(createdQuiz._id)
    expect(response.body.data.quizHistory.score).toBe(score)
    expect(response.body.data.quizHistory.feedback).toBe(feedback)
    expect(response.body.data.quizHistory.isCompleted).toBe(isCompleted)
    expect(response.body.data.quizHistory.createdBy.username).toBe(
      userCredentials.username
    )
    expect(response.body.data.quizHistory.is_deleted).toBe(false)
    createdQuizHistory = response.body.data.quizHistory
  })

  //#endregion

  // #region Tests for Update APIs

  // Test invalid authentication for quiz history update api
  it('quiz history update: invalid authentication token', async () => {
    const response = await request(app)
      .patch(`/v1/quizhistory/${createdQuiz._id}`)
      .set({ Authorization: `Bearer ${authToken}test` })
      .send({
        score: '',
      })
    expect(response.statusCode).toBe(401)
  })

  // Test quiz history update api with invalid id
  it('quiz history update: invalid id', async () => {
    const response = await request(app)
      .patch(`/v1/quizhistory/randomid`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        quizId: createdQuiz._id,
        score: 1,
        feedback: 'feedback',
        isCompleted: true,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe(
      `Quiz history with Id randomid not found in the system.`
    )
  })

  // Test quiz history update api with valid id and data
  it('quiz history update: valid id and data', async () => {
    let score = 6
    let feedback = 'Feedback Testing for QUIZ HISTORY - EDITED VERSION'
    let isCompleted = false
    const response = await request(app)
      .patch(`/v1/quizhistory/${createdQuizHistory._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        quizId: createdQuiz._id,
        score: score,
        feedback: feedback,
        isCompleted: isCompleted,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('Quiz history updated successfully.')
    expect(response.body.data.quizHistory.quizId).toBe(createdQuiz._id)
    expect(response.body.data.quizHistory.score).toBe(score)
    expect(response.body.data.quizHistory.feedback).toBe(feedback)
    expect(response.body.data.quizHistory.isCompleted).toBe(isCompleted)
    expect(response.body.data.quizHistory.createdBy.username).toBe(
      userCredentials.username
    )
    expect(response.body.data.quizHistory.is_deleted).toBe(false)
    createdQuizHistory = response.body.data.quizHistory
  })

  //#endregion

  //#region Tests for Get APIs

  // Test invalid authentication for get all quiz history api
  it('get all quiz histories: invalid authentication token', async () => {
    const response = await request(app)
      .get(`/v1//quizhistory`)
      .set({ Authorization: `Bearer ${authToken}test` })
    expect(response.statusCode).toBe(401)
  })

  // Test correct working of get all quiz history api
  it('get all quiz histories: valid', async () => {
    const response = await request(app)
      .get(`/v1//quizhistory`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('Successfully fetched all records.')
    expect(Array.isArray(response.body.data.quizHistories)).toBe(true)
  })

  // Test invalid authentication for get by id quiz history api
  it('get quiz history by id: invalid authentication token', async () => {
    const response = await request(app)
      .get(`/v1//quizhistory/random_id`)
      .set({ Authorization: `Bearer ${authToken}test` })
    expect(response.statusCode).toBe(401)
  })

  // Test invalid id for get by id quiz history api
  it('get quiz history by id: invalid id', async () => {
    const response = await request(app)
      .get(`/v1//quizhistory/random_id`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe(
      `Quiz History with Id random_id not found in the system.`
    )
  })

  // Test correct working of get by id quiz history api
  it('get quiz history by id: valid id', async () => {
    const response = await request(app)
      .get(`/v1//quizhistory/${createdQuizHistory._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.data.quizHistory._id).toBe(createdQuizHistory._id)
    expect(response.body.data.quizHistory.quizId).toBe(
      createdQuizHistory.quizId
    )
    expect(response.body.data.quizHistory.score).toBe(createdQuizHistory.score)
    expect(response.body.data.quizHistory.isCompleted).toBe(
      createdQuizHistory.isCompleted
    )
    expect(response.body.data.quizHistory.feedback).toBe(
      createdQuizHistory.feedback
    )
    expect(response.body.data.quizHistory.createdBy.username).toBe(
      userCredentials.username
    )
    expect(response.body.data.quizHistory.is_deleted).toBe(false)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('Successfully fetched the record.')
  })

  //#endregion

  // #region Tests for Delete APIs

  // Test invalid authentication in delete quiz history api
  it('delete quiz history by id: invalid authentication token', async () => {
    const response = await request(app)
      .delete(`/v1//quizhistory/${createdQuizHistory._id}`)
      .set({ Authorization: `Bearer ${authToken}test` })
    expect(response.statusCode).toBe(401)
  })

  // Test invalid id in delete quiz history api
  it('delete quiz history by id: invalid id', async () => {
    const response = await request(app)
      .delete(`/v1//quizhistory/random_id`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(400)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Error while deleting the record.')
  })

  // Test correct working of delete quiz history api
  it('delete quiz history by id: valid id', async () => {
    const response = await request(app)
      .delete(`/v1//quizhistory/${createdQuizHistory._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('Quiz history deleted successfully')
  })

  // Test to confirm deletion
  it('delete quiz history by id: confirming the quiz history is deleted', async () => {
    const response = await request(app)
      .get(`/v1//quizhistory/${createdQuizHistory._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
    expect(response.statusCode).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe(
      `Quiz History with Id ${createdQuizHistory._id} not found in the system.`
    )
  })

  //#endregion
})

// Test cases for user APIs
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

  it(`update user by providing valid Id`, async () => {
    const response = await request(app)
      .patch(`/v1/user/${user._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        first_name: UpdateUser.first_name,
        last_name: UpdateUser.last_name,
        username: UpdateUser.username,
        password: UpdateUser.password,
        email: UpdateUser.email,
        picture: UpdateUser.picture,
        phoneNo: UpdateUser.phoneNo,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('Success')
  })

  it('invalid user Id', async () => {
    const response = await request(app).patch(
      `/v1/user/64196a36c51eb8d605d1a7411`
    )
    expect(response.statusCode).toBe(401)
  })

  it(`update user by providing unique username and email`, async () => {
    const response = await request(app)
      .patch(`/v1/user/${user._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        username: userCredentials.username,
        email: userCredentials.email,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.username).toBe(UpdateUser.username)
    expect(response.body.email).toBe(UpdateUser.email)
    expect(response.body.message).toBe('Success')
  })

  it('update user with duplicate username', async () => {
    const response = await request(app)
      .patch(`/v1/user/${user.username}`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        first_name: UpdateUser.username,
        username: UpdateUser.username + '123',
        password: UpdateUser.password,
      })
    expect(response.statusCode).toBe(500)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('error')
  })

  it('delete user by valid id', async () => {
    const response = await request(app)
      .delete(`/v1/user/${user._id}`)
      .set({ Authorization: `Bearer ${authToken}` })
      .send({
        first_name: userCredentials.first_name,
        last_name: userCredentials.last_name,
        username: userCredentials.username,
        password: userCredentials.password,
        email: userCredentials.email,
        picture: userCredentials.picture,
        phoneNo: userCredentials.phoneNo,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.success).toBe(true)
  })

  it('delete user by invalid id', async () => {
    const response = await request(app).delete(
      `/v1/user/64196a36c51eb8d605d1a7411`
    )
    expect(response.statusCode).toBe(401)
  })
})

//#endregion

//#region test for userRole
// isAdmin user role
describe(`isAdmin middleware`, () => {
  let adminUser
  let nonAdminUser
  adminUser = Usermodel.findOne({ role: `Admin` })
  nonAdminUser = Usermodel.findOne({ role: { $ne: 'Admin' } })

  it('Deny access for non-users', async () => {
    const response = await request(app)
      .get(`/admin/dashboard`)
      .set(`Accept`, `application/json`)
      .set({ Authorization: `Bearer ${nonAdminUser.authToken}` })

    expect(response.statusCode).toBe(404)
  })
  it('Deny access for non-admin user', async () => {
    const response = await request(app)
      .get(`/admin/dashboard`)
      .set(`Accept`, `application/json`)
      .set({ Authorization: `Bearer ${adminUser.authToken}` })

    expect(response.statusCode).toBe(404)
  })
})
