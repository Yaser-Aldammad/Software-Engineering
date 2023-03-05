const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

app.use("/assets", express.static(path.join(__dirname, "assets")));

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
  res.sendFile(path.join(__dirname, "views/", "admin.html"));
});
app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname, "views/", "test.html"));
});

app.listen(port, () => {
  console.log(`Quiz app listening on port http://localhost:${port}`);
});
