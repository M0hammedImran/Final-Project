const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const fs = require('fs');
const router = require('./routes/index.js');

const app = express();

let data = fs.readFileSync(
  path.join(__dirname, './files') + '/admin.json',
  'utf8'
);

let admin = JSON.parse(data);

// Static Imports
app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.use('/script', express.static(path.join(__dirname, '/script')));

// Passport Config
const initializePassport = require('./passport-config');
initializePassport(
  passport,
  email => admin.find(user => user.email === email),
  id => admin.find(user => user.id === id)
);

// EJS
app.set('view engine', 'ejs');

// Express Body-Parser
app.use(express.urlencoded({ extended: true }));

// Express Session
app.use(
  session({
    secret: 'woff',
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
// app.use(methodOverride("_method"));

// Global Variables
app.use((req, res, next) => {
  res.locals.seccess_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Middleware
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/adminLogin');
};
const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  next();
};

// GET Requests
app.get('/', router);
app.get('/contact', router);
app.get('/adminLogin', checkNotAuthenticated, router);
app.get('/dashboard', checkAuthenticated, router);
app.get('/register', checkNotAuthenticated, router);
app.get('/user', router);
app.get('/request', router);
app.get('/request/search', router);
// End GET

// POST Requests
app.post('/adminLogin', router);
app.post('/register', router);
app.post('/logout', (req, res) => {
  req.logOut();
  res.redirect('/adminLogin');
});
// End POST

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server Running at port: ${PORT}`));
