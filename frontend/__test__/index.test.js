require("@testing-library/jest-dom/extend-expect");
const fs = require("fs");
const path = require("path");
const testingLibraryDom = require("@testing-library/dom");
const jsdom = require("jsdom");

const html = fs.readFileSync(
  path.resolve(__dirname, "../views/index.ejs"),
  "utf8"
);

const htmlQuiz = fs.readFileSync(
  path.resolve(__dirname, "../views/quiz.ejs"),
  "utf8"
);

let dom;
let container;
let quizDom;
let quizContainer;

describe("index.ejs", () => {
  beforeEach(() => {
    dom = new jsdom.JSDOM(html, { runScripts: "dangerously" });
    container = dom.window.document.body;
  });

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

  it("Renders the quiz cards", () => {
    expect(container.querySelector(".card")).not.toBeNull();
    expect(container.querySelector(".card-body")).not.toBeNull();
    expect(container.querySelector(".card-title")).not.toBeNull();
    expect(container.querySelector(".card-subtitle")).not.toBeNull();
    expect(container.querySelector(".card-text")).not.toBeNull();
    expect(container.querySelector(".card-link")).not.toBeNull();
  });

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

  it("renders a unique quiz when click on attempted quiz", async () => {
    const button = testingLibraryDom.getByText(container, "Attempt Quiz");

    testingLibraryDom.fireEvent.click(button);

    quizDom = new jsdom.JSDOM(htmlQuiz, { runScripts: "dangerously" });
    quizContainer = quizDom.window.document.body;

    expect(quizContainer.querySelectorAll("#data")).not.toBeNull();
  });
});
