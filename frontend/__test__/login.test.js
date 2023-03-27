/**
 * @file API Unit testing of loginform.js using JEST
 * @author Balsher Singh <balshers@mun.ca>
 */

// Importing the jest testing library and axios api fetching library
// require("@testing-library/jest-dom/extend-expect");
const axios = require("axios");

/**
 * login
 * method: GET
 * summary: API Testing of Login Module
 */
async function login() {
    const apiUrl = 'http://localhost:3000/v1/login';
    const params = {
        username: 'test123',
        password: 'test123'
    };
    const res = axios.get(apiUrl, { params });
    return res;
}

/**
 * JEST unit testing starts
 * Test Suite: Frontend Login API testing
 */
describe("Frontend Login API testing", () => {
  /**
   * Status Connection:
   *
   * Status 200: Connected Successfully to backend
   * Status 404: Did not connect to the backend
   */
  it("Connects to backend with Status 200", () => {
    login()
      .then((resp) => {
        expect(resp.status).toEqual(200);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  /**
   * If the login response is being retrieved:
   *
   * Is login for that user successful?
   *
   */
  it("Retrieves Login Success Flag", () => {
    login()
      .then((resp) => {
        expect(resp.data.success).toEqual(true);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
