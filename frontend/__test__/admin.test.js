/**
 * @file API Unit testing of signupform.js using JEST
 * @author Balsher Singh <balshers@mun.ca>
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
        first_name: "quizadmin1",
        last_name: "quizadmin1",
        email: "quizadmin1@gmail.com",
        username: "quizadmin1",
        password: "quizadmin1",
        countryCode: "+1",
        phoneNo: "91828820113",
      }),
    });
    return res;
}

async function add_quiz() {
    const res = await axios("http://localhost:3000/v1/quiz", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `bearer ${token}`
    },
    data: JSON.stringify({
        title:"Quiz_add_test",
        quizType:"Quiz_add_test",
        description:"Quiz_add_test",
        createdBy:objectid
    }),
  });
    return res;
}


/**
 * JEST unit testing starts
 * Test Suite: Frontend signup API testing
 */

var token = "";
var objectid = "";
  
beforeAll(async () => {
  response = await signup();
  token = response.data.data.token;
  objectid = response.data.data.user._id;
});

describe("Frontend Admin API testing", () => {
  /**
   * Status Connection:
   *
   * Status 200: Connected Successfully to backend
   * Status 404: Did not connect to the backend
   */
  it("Connects to backend with Status 200", async () => {
    const response = await add_quiz();
    expect(response.status).toEqual(200);
  });

  /**
   * If the signup response is being retrieved:
   *
   * Is signup for that user successful?
   *
   */
  it("Retrieves Quiz Add Success Flag", async () => {
    const response = await add_quiz();
    expect(response.data.success).toEqual(true);
  });
});
