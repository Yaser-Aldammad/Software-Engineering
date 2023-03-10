# Term Project COMP 6905 Winter 2023

## Team description

> ### **Frontend**
> **Team Lead:** Pranav Arora [@pranavarora1895](https://github.com/pranavarora1895)
> 
> **Team Member:** Balsher Singh [@balshersingh10](https://github.com/balshersingh10)
>
> ### **Backend**
> **Team Lead:** Shaher Muhammad [@Muhammad-Shaheryar](https://github.com/Muhammad-Shaheryar)
> 
> **Team Member:** Prabin Shrestha [@prabinKshrestha](https://github.com/prabinKshrestha)
>
> **Team Member:** Yaser Aldammad  [@Yaser-Aldammad ](https://github.com/@Yaser-Aldammad)
>
> **Team Member:** Oluwafunmiwo Judah Sholola [@JCK07115](https://github.com/@JCK07115)

> ### **Individual Code Tasks**
> The frontend team worked on the following features and their relevant code tasks. This will be helpful while evaluating the individual code tasks.
>
> **Pranav Arora (202286040)**
>
> _feature:_ [f-student-page](https://github.com/MUN-COMP6905/project-cteam/tree/f-student-page)
>
> _code_tasks:_ [index.js](https://github.com/MUN-COMP6905/project-cteam/blob/u-app-ui/frontend/index.js), [index.html](https://github.com/MUN-COMP6905/project-cteam/blob/f-student-page/frontend/views/index.html)
>
> **Balsher Singh (202285114)**
>
> _feature:_ [f-student-profile](https://github.com/MUN-COMP6905/project-cteam/tree/f-student-profile)
>
> _code_tasks:_ [login.html](https://github.com/MUN-COMP6905/project-cteam/blob/u-app-ui/frontend/views/login.html), [signup.html](https://github.com/MUN-COMP6905/project-cteam/blob/u-app-ui/frontend/views/signup.html)



## Project Description
> ### Frontend
>
> The frontend part of the project renders the webpages on the client. It will be connected with the backend to perform the CRUD operations(Create, Read, Update, Delete) using various REST APIs (GET, POST, PUT, DELETE) respectively, and store them into the MongoDB Database.
>
> _All the frontend files are in the folder [frontend/](https://github.com/MUN-COMP6905/project-cteam/tree/u-app-ui/frontend)_
>
> #### Frontend Code Run Instructions
> To run frontend code, kindly follow the given instructions:
>
> - Clone this repository
>
> ```git
> git clone https://github.com/MUN-COMP6905/project-cteam
> cd .\project-cteam\
> ```
>
> - Install the dependencies from `package.json`
>
> ```cmd
> npm install
> ```
>
> - To start the server, run:
>
> ```cmd
> npm run frontend
> ```
>
> or
> 
> ```cmd
> nodemon frontend/index.js
> ```
>
> The app will listen to http://localhost:8080

## Repository Structure
> ### Frontend
> ```bash 
> |--master
>    |--u-app-ui (@pranavarora1895 user story)
>       |--f-student-page
>       |--f-student-profile
>    |--u-admin-ui (@balshersingh10 user story)
>       |--f-db-bridge
>       |--f-admin-access
> ```

## Attributions
<!-- Each line/entry of your attributions section should consist of three parts: (1) the source (such as web page URL, individual name, or bibliographic reference), (2) the nature of the contribution to your submission, and (3) any additional information (such as how the collaboration worked, or whether your collaborator is a classmate or student) -->
 
> ### Frontend
> 1. BootStrap
>   - Source - https://getbootstrap.com/
>   - CSS Framework that increases the productivity of frontend development
>   - It helped us in generating the starter templates for the webpages on which we developed our HTML template code.
>
> 2. ExpressJS
>   - Source - https://expressjs.com/
>   - JavaScript framework that is used for frontend development
>   - Initiated the server and created the routes to different pages
>
> 3. Figma
>   - Source - https://www.figma.com/
>   - Webpage design tool
>   - It helped us to create better designs for the frontend webpages
>
> 4. JSDOCs
>   - Source - https://jsdoc.app/
>   - JS documentation tool
>   - It helped us to document frontend APIs and HTML components
> 
> 5. Pexels
>   - Source - https://www.pexels.com/
>   - Copyright free image library
>   - Downloaded copyright free images and used them to our webpages.
>
> ### Backend
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
*  Base URL: The base URL for all endpoints is: http://localhost:3000/v1
*  Authentication: QuizApp uses JWT(JSON Web Tokens) and Passport to authenticate access to API endpoints in an Express.js application.
* Endpoints:
   * POST /example
   * Parameters:
       * first_name (required)
       * last_name (required)
       * email (required)
       * username (required)
       * password (required)
       * is_deleted (false default)
       * status (Active default)
       * roles (Student default)
       * phoneNo (not required)
       * countryCode (not required)
   * Response: 200 OK on success
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
 * Software Engineering Group C
 * To install the required packages: 
   * npm install jest supertest
 * Run the Jest test:
   * npm test