const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');
const path = require('path');

let dat = fs.readFileSync(
  path.join(__dirname, '../files') + '/admin.json',
  'utf8'
);
let data = fs.readFileSync(
  path.join(__dirname, '../files') + '/users.json',
  'utf8'
);

//Formatted Text
let admin = JSON.parse(dat);
let n1 = admin[0].name;
let a1 = n1.toUpperCase();
let name1 = a1;

//Formatted Text
let users = JSON.parse(data);
let n2 = users[0].firstName;
let m2 = users[0].lastName;
let a2 = n2[0].toUpperCase();
let b2 = m2[0].toUpperCase();
let name2 = '';
name2 = `${a2}${n2.substr(1)} ${b2}${m2.substr(1)}`;

// Get Request
router.get('/', (_req, res) => res.render('index.ejs'));
router.get('/adminLogin', (_req, res) => res.render('login'));
router.get('/contact', (_req, res) => res.render('contact'));
router.get('/dashboard', (_req, res) =>
  res.render('dashboard', { name: name1 })
);
router.get('/register', (req, res) => res.render('register'));
router.get('/request', (req, res) => res.render('request'));
router.get('/request/search', (req, res) => {
  const value = req.query.search;
  console.log(value);
  res.render('searchresult', { value: value, imran: 'imran' });
});
router.get('/user', (req, res) => res.render('userinfo', { name: name2 }));
// POST Requests
router.post('/register', (req, res) => {
  let user = {
    id: Date.now().toString(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    DOB: req.body.DOB,
    address1: req.body.address1,
    address2: req.body.address2,
    email1: req.body.email1
  };
  users.push(user);
  let data = JSON.stringify(users, null, 2);
  fs.writeFile('./files/users.json', data, err => console.log(err));
  res.redirect('/user');
});

router.post('/adminLogin', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/adminLogin',
    failureMessage: 'error'
  })(req, res, next);
});

module.exports = router;
