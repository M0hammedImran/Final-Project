const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

let data = fs.readFileSync("./file.json");
let students = JSON.parse(data);

const app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.engine("html", require("ejs").renderFile);

app.get("/sign", (req, res) => {
  res.redirect("localhost:5500/sign.html");
});

app.post("/sign", urlencodedParser, (req, res) => {
  let student = {
    // id: req.body.fname.slice(1, 3) + time,
    firstName: req.body.fname,
    lastName: req.body.lname,
    gender: req.body.gender,
    DOB: req.body.bday,
    address1: req.body.address1,
    address2: req.body.address2,
    email1: req.body.email1,
    pass: req.body.password1
  };
  students.push(student);
  let data = JSON.stringify(students, null, 2);

  fs.writeFile("./file.json", data, err => console.log("success"));
  res.redirect("localhost:5500/index.html");
});

app.get("/", (req, res) => {
  res.redirect("localhost:5500/index.html");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
  console.log(`Server Running at port: ${PORT}`);
});
