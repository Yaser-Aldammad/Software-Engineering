/**
 * @file Unit testing of index.html webpage
 * @author Pranav Arora <parora@mun.ca>
 */

// loading libraries and HTML files
require("@testing-library/jest-dom/extend-expect");
const fs = require("fs");
const path = require("path");
const testingLibraryDom = require("@testing-library/dom");
const jsdom = require("jsdom");

const html = fs.readFileSync(
  path.resolve(__dirname, "../views/index.html"),
  "utf8"
);

const htmlQuiz = fs.readFileSync(
  path.resolve(__dirname, "../views/quiz.html"),
  "utf8"
);

let dom;
let container;
let quizDom;
let quizContainer;

/**
 * JEST unit testing starts
 * file: index.html
 * Test Suite: Index Page testing
 */
describe("index.html", () => {
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
   * Functionality of Login/Signup Buttons
   */
  it("Renders the navigation bar", () => {
    expect(container.querySelector("nav")).toBeInTheDocument();
    expect(
      testingLibraryDom.getByText(container, "Quizzy")
    ).toBeInTheDocument();
    expect(testingLibraryDom.getAllByText(container, "Home")).not.toBeNull();
  });

  it("Renders the login and signup buttons", () => {
    expect(container.querySelector("nav button")).toBeInTheDocument();
    expect(testingLibraryDom.getAllByText(container, "Login")).not.toBeNull();
    expect(testingLibraryDom.getAllByText(container, "SignUp")).not.toBeNull();
  });

  /**
   * Image Static Rendering:
   *
   * Testing whether the image is properly being rendered. Testing of:
   * indexCarousel1
   * indexCarousel2
   * indexCarousel3
   */
  it("Renders the image from static", () => {
    expect(container.querySelector("img")).toBeInTheDocument();
    expect(
      testingLibraryDom.getAllByAltText(container, "indexCarousel1")
    ).not.toBeNull();
    expect(
      testingLibraryDom.getAllByAltText(container, "indexCarousel2")
    ).not.toBeNull();
    expect(
      testingLibraryDom.getAllByAltText(container, "indexCarousel3")
    ).not.toBeNull();
  });

  it("renders a heading element", () => {
    expect(container.querySelector("h1")).not.toBeNull();

    expect(
      testingLibraryDom.getByText(container, "Lets have a quizz!")
    ).toBeInTheDocument();
  });

  /**Quiz Cards Rendering:
   *
   * Does the following in the quiz card renders:
   * card-title
   * card-body
   * card-subtitle
   * card-link
   * When clicked on the attempted quiz, does a unique webpage with the quiz object ID renders.
   */
  it("Renders the quiz cards", () => {
    expect(container.querySelector(".card")).not.toBeNull();
    expect(container.querySelector(".card-body")).not.toBeNull();
    expect(container.querySelector(".card-title")).not.toBeNull();
    expect(container.querySelector(".card-subtitle")).not.toBeNull();
    expect(container.querySelector(".card-text")).not.toBeNull();
    expect(container.querySelector(".card-link")).not.toBeNull();
  });

  it("renders a unique quiz when click on attempted quiz", async () => {
    const button = testingLibraryDom.getByText(container, "Attempt Quiz");

    testingLibraryDom.fireEvent.click(button);

    quizDom = new jsdom.JSDOM(htmlQuiz, { runScripts: "dangerously" });
    quizContainer = quizDom.window.document.body;

    expect(quizContainer.querySelectorAll("#data")).not.toBeNull();
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
