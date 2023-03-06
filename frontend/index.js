/**
 * @file Renders frontend pages using ExpressJS routing
 * @author Pranav Arora <parora@mun.ca>
 */

const express = require("express");
const app = express();
const path = require("path");
const port = 8080;

// load assets
app.use("/assets", express.static(path.join(__dirname, "assets")));

/**
 * /
 * method: get
 * summary: retrieves the homepage and renders it to the browser
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/", "index.html"));
});

/**
 * /login
 * method: get
 * summary: retrieves the login page and renders it to the browser
 */
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views/", "login.html"));
});

/**
 * /signup
 * method: get
 * summary: retrieves the signup page and renders it to the browser
 */
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views/", "signup.html"));
});

/**
 * /admin
 * method: get
 * summary: retrieves the admin page and renders it to the browser
 */
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "views/", "admin.html"));
});

/**
 * /test
 * method: get
 * summary: kept for testing purposes
 */
app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "views/", "test.html"));
});

/**
 * app listens to port 3000
 */
app.listen(port, () => {
  console.log(`Quiz app listening on port http://localhost:${port}`);
});
