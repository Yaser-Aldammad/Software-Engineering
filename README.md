# QuizApp

Software Engineering Assignment 2, Group C

## Installation

To install QuizApp, you can follow these steps:

- Clone or download the project code from the repository where it is hosted.
- Open your terminal or command prompt.
- Navigate to the directory where you have saved the project
- Type the following command to install the project dependencies:
  - npm install
- Once the dependencies are installed, you can start the Express application
  using the following command:
  - npm i nodemon
  - npm run watch or npm start
- Open browser, type URL: http://localhost:3000/
  - You get the message: {"Message":"Welcome to the Quiz App Restful
    API's","Version":"1.0.0"}

## Usage

- Creating RESTful APIs: Express is often used to create RESTful APIs that can
  be consumed by frontend applications or mobile apps. It provides features like
  routing, middleware, and error handling that make it easy to build and
  maintain APIs.
- In an MVC architecture with Express.js, the application can be structured as
  follows:

  - Model: This represents the data and business logic of the application. It
    includes data access, validation, and processing. You can use libraries like
    Mongoose or Sequelize to define and interact with the database.

  - View: This represents the user interface of the application. It includes the
    HTML, CSS, and JavaScript files that the user sees and interacts with. You
    can use templates like EJS, Pug, or Handlebars to render dynamic HTML.

  - Controller: This acts as an intermediary between the model and view. It
    receives user requests, processes them, and updates the model and view
    accordingly. You can define controller functions using Express.js routing
    and middleware functions.

## API Documentation

- Base URL: The base URL for all endpoints is: http://localhost:3000/v1
- Authentication: QuizApp uses JWT(JSON Web Tokens) and Passport to authenticate
  access to API endpoints in an Express.js application.
- Endpoints:
  - POST /example
  - Parameters:
    - first_name (required)
    - last_name (required)
    - email (required)
    - username (required)
    - password (required)
    - is_deleted (false default)
    - status (Active default)
    - roles (Student default)
    - phoneNo (not required)
    - countryCode (not required)
  - Response: 200 OK on success

```bash
{
    "success": true,
    "message": "User created successfully.",
    "data": {
        "user": {
            "first_name": "test2",
            "last_name": "test2",
            "email": "test44@test.com",
            "username": "test44",
            "password": "$2a$05$MbVyLnwQhvLf8y5fN",
            "is_deleted": false,
            "status": "Active",
            "roles": "Student",
            "_id": "6401e0f51008078fa39df1ed",
            "created": "2023-03-03T11:58:45.430Z",
            "updated": "2023-03-03T11:58:45.439Z",
            "__v": 0
        },
        "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDAxZTBmNTEwMDgwNzhmYTM5ZGYxZWQiLCJpYXQiOjE2Nzc4NDQ3MjV9.Er_zqTi2ur5Iqfs_BilqJwGoVGDRusMd2GyTeP45U45fsfsdfsdcasaeupwLVIGC_G9kxsURXQ"
    }
}
```

## Unit Testing

- Jest is setup to write test cases for QuizApp

## Contributing

- Software Engineering Group C
- To install the required packages:
  - npm install jest supertest
- Run the Jest test:
  - npm test
