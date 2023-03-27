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
        'Content-Type': 'application/json'
    },
    data: JSON.stringify({
        first_name: "testuser1",
        last_name: "testuser1",
        email: "testuser1@gmail.com",
        username: "testuser1",
        password: "testuser1",
        countryCode: "+1",
        phoneNo: "9182882011",
    })
  });
    return res;
}
/**
 * JEST unit testing starts
 * Test Suite: Frontend signup API testing
 */
let response;

beforeAll(async () => {
  response = await signup();
});

describe("Frontend signup API testing", () => {
  /**
   * Status Connection:
   *
   * Status 200: Connected Successfully to backend
   * Status 404: Did not connect to the backend
   */
  it("Connects to backend with Status 200", () => {
    expect(response.status).toEqual(200);
  });

  /**
   * If the signup response is being retrieved:
   *
   * Is signup for that user successful?
   *
   */
  it("Retrieves signup Success Flag", () => {
    expect(response.data.success).toEqual(true);
  });
});
