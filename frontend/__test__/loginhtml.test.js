/**
 * @file Unit testing of login.html webpage
 * @author Pranav Arora <parora@mun.ca>
 */

// loading libraries and HTML files
require("@testing-library/jest-dom/extend-expect");
const fs = require("fs");
const path = require("path");
const testingLibraryDom = require("@testing-library/dom");
const jsdom = require("jsdom");

const html = fs.readFileSync(
  path.resolve(__dirname, "../views/login.html"),
  "utf8"
);

let dom;
let container;

/**
 * JEST unit testing starts
 * file: login.html
 * Test Suite: Login Page testing
 */
describe("login.html", () => {
  beforeEach(() => {
    dom = new jsdom.JSDOM(html, { runScripts: "dangerously" });
    container = dom.window.document.body;
  });

  /**
   * Navigation bar rendering:
   *
   * Does NavBar renders on the page
   * Does the heading 'Quizzy' renders
   * Is 'Home' link workable
   */
  it("Renders the navigation bar", () => {
    expect(container.querySelector("nav")).toBeInTheDocument();
    expect(
      testingLibraryDom.getByText(container, "Quizzy")
    ).toBeInTheDocument();
    expect(testingLibraryDom.getAllByText(container, "Home")).not.toBeNull();
  });

  /**
   * Image Rendering:
   *
   * Testing whether the image is properly being rendered. Testing of:
   * Trendy Pants and Shoes
   */
  it("Renders the image from static", () => {
    expect(container.querySelector("img")).toBeInTheDocument();
    expect(
      testingLibraryDom.getAllByAltText(container, "Trendy Pants and Shoes")
    ).not.toBeNull();
  });

  /**Quiz Cards Rendering:
   *
   * Does the login card being rendered properly with alignments
   *
   */
  it("Renders the login card", () => {
    expect(container.querySelector(".card")).not.toBeNull();
  });

  /**
   * Testing of login form rendering:
   *
   * Does the login form rendered?
   * Does it have username & password fields
   * Does it offer Remember me option?
   * Does it offer Forgot password feature?
   * Does it have sign in button
   */
  it("renders the login form component", () => {
    expect(container.querySelector("form")).toBeInTheDocument();
    expect(
      testingLibraryDom.getByText(container, "Username")
    ).toBeInTheDocument();
    expect(
      testingLibraryDom.getByText(container, "Password")
    ).toBeInTheDocument();
    expect(
      testingLibraryDom.getByText(container, "Remember me")
    ).toBeInTheDocument();
    expect(
      testingLibraryDom.getByText(container, "Forgot password?")
    ).toBeInTheDocument();
    expect(
      testingLibraryDom.getByText(container, "Sign in")
    ).toBeInTheDocument();
  });

  /**
   * Footer Rendering:
   *
   * Footer Rendering will check whether:
   * Does the footer rendered on the page
   * Are the given footer links functional
   * */
  it("Renders the footer", () => {
    expect(container.querySelector("footer")).not.toBeNull();
    expect(
      testingLibraryDom.getByText(container.querySelector("footer"), "Home")
    );
    expect(
      testingLibraryDom.getByText(container.querySelector("footer"), "Login")
    );
    expect(
      testingLibraryDom.getByText(container.querySelector("footer"), "SignUp")
    );
    expect(
      testingLibraryDom.getByText(container.querySelector("footer"), "Admin")
    );
    expect(
      testingLibraryDom.getByText(
        container.querySelector("footer"),
        "GitHub Repo"
      )
    );
  });
});
