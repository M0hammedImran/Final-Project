const express = require("express");
const fs = require("fs");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const initializePasspost = require("./passport-config");
const flash = require("express-flash");

// const methodOverride = require("method-override");
// const bcryptjs = require("bcryptjs");

const app = express();

let users = [
  {
    id: "157",
    name: "imran",
    email: "w@w.c",
    password: "123"
  }
];

initializePasspost(
  passport,
  email => users.findOne(user => user.email === email),
  id => users.findOne(user => user.id === id)
);

let data = fs.readFileSync("./files/users.json");
let userData = JSON.parse(data);

app.set("view-engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use("/script", express.static(path.join(__dirname, "/script")));

app.use(flash());

app.use(
  session({
    secret: "woff",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

// app.use(methodOverride("_method"));

// Middleware
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/admin");
};
const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
};

// GET Requests
app.get("/", (req, res) => res.render("index.ejs"));

app.get("/contact", (req, res) => res.render("contact.ejs"));

app.get("/adminLogin", checkNotAuthenticated, (req, res) =>
  res.render("login.ejs")
);

app.get("/test", checkAuthenticated, (req, res) => res.render("test.ejs"));

app.get("/register", checkNotAuthenticated, (req, res) =>
  res.render("register.ejs")
);

app.get("/user", (req, res) =>
  res.render("userdetails.ejs", { key: userData.id })
);

app.get("/request", (req, res) => res.render("request.ejs"));

app.get("/fail", (req, res) => res.send("<h1>error</h1>"));

// POST Requests
app.post(
  "/adminLogin",
  passport.authenticate("local", {
    successRedirect: "/test",
    failureRedirect: "/adminLogin",
    failureFlash: true
  }),
  (req, res) => res.redirect("/")
);

app.post("/register", checkNotAuthenticated, (req, res) => {
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
  fs.writeFile("./files/users.json", data, err => console.log(err));
  res.redirect("/user");
});

// app.delete("/logout", (req, res) => {
//   req.logOut();
//   res.redirect("/login");
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, err => {
  console.log(`Server Running at port: ${PORT}`);
});
