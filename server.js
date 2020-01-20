const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

let data = fs.readFileSync("./files/users.json");
let userData = JSON.parse(data);

app.engine("html", require("ejs").renderFile);

app.use(express.urlencoded({ extended: false }));
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use("/script", express.static(path.join(__dirname, "/script")));

// GET Requests
app.get("/", (req, res) => res.render("index.html"));

app.get("/contact", (req, res) => res.render("contact.html"));

app.get("/admin", (req, res) => res.render("admin.html"));

app.get("/sign", (req, res) => res.render("sign.html"));

app.get("/request", (req, res) => res.render("request.html"));

// POST Requests
app.post("/admin", (req, res) => res.send("Success!"));

app.post("/sign", (req, res) => {
  let user = {
    id: Date.now().toString(),
    firstName: req.body.fname,
    lastName: req.body.lname,
    gender: req.body.gender,
    DOB: req.body.bday,
    address1: req.body.address1,
    address2: req.body.address2,
    email1: req.body.email1
  };
  userData.push(user);
  let data = JSON.stringify(userData, null, 2);
  fs.writeFile("./files/users.json", data, err => {});
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
  console.log(`Server Running at port: ${PORT}`);
});
