const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.engine("html", require("ejs").renderFile);
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use("/script", express.static(path.join(__dirname, "/script")));

let data = fs.readFileSync("./file.json");
let students = JSON.parse(data);

app.get("/", (req, res) => {
  res.render("index.html");
});

app.get("/contact", (req, res) => {
  res.render("contact.html");
});

app.get("/admin", (req, res) => {
  res.render("admin.html");
});

app.get("/sign", (req, res) => {
  res.render("sign.html");
});

app.post("/sign", urlencodedParser, (req, res) => {
  const random = Math.floor(Math.random() * (10000000 - 1000000) + 1000000);

  let student = {
    id: random,
    firstName: req.body.fname,
    lastName: req.body.lname,
    gender: req.body.gender,
    DOB: req.body.bday,
    address1: req.body.address1,
    address2: req.body.address2,
    email1: req.body.email1
  };
  students.push(student);
  let data = JSON.stringify(students, null, 2);
  fs.writeFile("./file.json", data, err => console.log(student.id));
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
  console.log(`Server Running at port: ${PORT}`);
});
