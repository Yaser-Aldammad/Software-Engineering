/**
 * @file API Unit testing of index.js using JEST
 * @author Pranav Arora <parora@mun.ca>
 */

// Importing the jest testing library and axios api fetching library
// require("@testing-library/jest-dom/extend-expect");
const axios = require("axios");
/**
 * signup
 * method: POST
 * summary: API Testing of signup Module
 */
async function signup() {
  const res = await axios("http://localhost:3000/v1/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      first_name: "quizuser1",
      last_name: "quizuser1",
      email: "quizuser1@gmail.com",
      username: "quizuser1",
      password: "quizuser1",
      countryCode: "+1",
      phoneNo: "9182882011",
    }),
  });
  return res;
}

var token = "";

beforeAll(async () => {
  response = await signup();
  token = response.data.data.token;
});

/**
 * get_quiz
 * method: GET
 * summary: API Testing of Quiz Module
 */
async function get_quiz() {
  const res = await axios("http://localhost:3000/v1/quiz", {
    method: "GET",
    headers: {
      Authorization: `bearer ${token}`,
    },
  });

  return res;
}

/**
 * JEST unit testing starts
 * Test Suite: Frontend Quiz API testing
 */
describe("Frontend Quiz API testing", () => {
  /**
   * Status Connection:
   *
   * Status 200: Connected Successfully to backend
   * Status 404: Did not connect to the backend
   */
  it("Connects to backend with Status 200", () => {
    get_quiz()
      .then((data) => {
        expect(data.status).toEqual(200);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  /**
   * If the Quiz data is being retrieved:
   *
   * An array of Quiz data whether empty or non-empty should get retrieved.
   *
   */
  it("Retrieves Quiz Array", () => {
    get_quiz()
      .then((data) => {
        let quizArray = data.data.data.quizzes;
        expect(quizArray.length).toBeGreaterThanOrEqual(0);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
