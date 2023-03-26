/**
 * @file Unit testing of index.html webpage
 * @author Balsher Singh <balshers@mun.ca>
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const testingLibraryDom = require('@testing-library/dom');

const html = fs.readFileSync(path.resolve(__dirname, '../views/signup.html'), 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

describe('Signup Form', () => {
  let usernameInput, firstNameInput, lastNameInput, emailInput, passwordInput, phoneInput, countrycodeInput, submitButton, container;

  beforeAll(() => {
    container = document.body;
    usernameInput = document.getElementById('username');
    firstNameInput = document.getElementById('firstName');
    lastNameInput = document.getElementById('lastName');
    emailInput = document.getElementById('email');
    passwordInput = document.getElementById('password');
    phoneInput = document.getElementById('phone');
    countrycodeInput = document.getElementById('countrycode');
    submitButton = document.getElementById('submit');
  });

  it("Renders the navigation bar", () => {
    expect(container.querySelector("nav")).toBeTruthy();
    expect(
      testingLibraryDom.getByText(container, "Quizzy")
    ).toBeTruthy();
    expect(testingLibraryDom.getAllByText(container, "Home")).toBeDefined();
  });

  it('should have a form with id "signup"', () => {
    const form = document.getElementById('signup');
    expect(form).toBeDefined();
  });

  it('should have a username input with id "username"', () => {
    expect(usernameInput).toBeDefined();
  });

  it('should have a first name input with id "firstName"', () => {
    expect(firstNameInput).toBeDefined();
  });

  it('should have a last name input with id "lastName"', () => {
    expect(lastNameInput).toBeDefined();
  });

  it('should have an email input with id "email"', () => {
    expect(emailInput).toBeDefined();
  });

  it('should have a password input with id "password"', () => {
    expect(passwordInput).toBeDefined();
  });

  it('should have a phone input with id "phone"', () => {
    expect(phoneInput).toBeDefined();
  });

  it('should have a country code input with id "countrycode"', () => {
    expect(countrycodeInput).toBeDefined();
  });

  it("Renders the footer", () => {
    expect(container.querySelector("footer")).toBeDefined();
    expect(
      testingLibraryDom.getByText(container.querySelector("footer"), "Home")
    ).toBeDefined();
    expect(
      testingLibraryDom.getByText(container.querySelector("footer"), "Login")
    ).toBeDefined();
    expect(
      testingLibraryDom.getByText(container.querySelector("footer"), "SignUp")
    ).toBeDefined();
    expect(
      testingLibraryDom.getByText(container.querySelector("footer"), "Admin")
    ).toBeDefined();
    expect(
      testingLibraryDom.getByText(
        container.querySelector("footer"),
        "GitHub Repo"
      )
    ).toBeDefined();
  });
});
