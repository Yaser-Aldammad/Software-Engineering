const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

// Set the template engine as pug
// app.set("view engine", "pug");

// // Set the pages directory

// app.set("views", path.join(__dirname, "views"));

// app.get("/base", (req, res) => {
//   res.status(200).render("base", { title: "Pranav", message: "Some message" });
// });

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
