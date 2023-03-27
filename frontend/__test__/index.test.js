/**
 * @file API Unit testing of index.js using JEST
 * @author Pranav Arora <parora@mun.ca>
 */

// Importing the jest testing library and axios api fetching library
require("@testing-library/jest-dom/extend-expect");
const axios = require("axios");

/**
 * get_quiz
 * method: GET
 * summary: API Testing of Quiz Module
 */
async function get_quiz() {
  const res = await axios("http://localhost:3000/v1/quiz", {
    method: "GET",
    headers: {
      Authorization: `bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDEyMTJkNDQ1ZjViMTIwMDkxNDNhYWEiLCJpYXQiOjE2Nzg5MDYwNjh9.nRV-BLTIaSScwVsL-xr5oPUvHKmpdu3pT92ujs3Gk6hHSIPOlJ2ZKvkzztUc9ZGqdRcFqKJV4B79xEcxLnV9XA`,
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
