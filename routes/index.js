const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');

let dat = fs.readFileSync('files/admin.json');
let admin = JSON.parse(dat);
const name = admin[0].name;

let data = fs.readFileSync('files/users.json');
let userData = JSON.parse(data);

// Get Request
router.get('/', (req, res) => res.render('index.ejs'));
router.get('/adminLogin', (req, res) => res.render('login'));
router.get('/contact', (req, res) => res.render('contact'));
router.get('/user', (req, res) => res.render('userdetails', { key: name }));
router.get('/dashboard', (req, res) =>
  res.render('dashboard', { key: `${admin[0].name}` })
);
router.get('/register', (req, res) => res.render('register'));
router.get('/request', (req, res) => res.render('request'));
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
  userData.push(user);
  let data = JSON.stringify(userData, null, 2);
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
