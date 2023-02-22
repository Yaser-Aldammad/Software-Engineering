const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/", "index.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views/", "login.html"));
});
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views/", "signup.html"));
});
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "views/", "signup.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
