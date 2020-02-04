const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');
const path = require('path');
const mysqlConnection = require('../connection');
const flash = require('express-flash');

let dat = fs.readFileSync(
  path.join(__dirname, '../files') + '/admin.json',
  'utf8'
);
let data = fs.readFileSync(
  path.join(__dirname, '../files') + '/users.json',
  'utf8'
);

let validId;
//Formatted Text
let admin = JSON.parse(dat);
let n1 = admin[0].name;
let a1 = n1.toUpperCase();
let name1 = a1;

let users = JSON.parse(data);
// let n2 = users[0].firstName;
// let m2 = users[0].lastName;
// let a2 = n2[0].toUpperCase();
// let b2 = m2[0].toUpperCase();
// let name2 = `${a2}${n2.substr(1)} ${b2}${m2.substr(1)}`;

// JSON Object
const books = [
  {
    bookName: "hitchhiker's guide to the galaxy",
    bookID: 42,
    imageFormat: 'webp'
  },
  {
    bookName: 'IMRAN',
    bookID: 123,
    imageFormat: 'jpg'
  },
  {
    bookName: 'LOCOMO',
    bookID: 1234,
    imageFormat: 'jpg'
  },
  {
    bookName: 'QWERTY',
    bookID: 1235,
    imageFormat: 'jpg'
  },
  {
    bookName: 'LOCOC',
    bookID: 12345,
    imageFormat: 'jpg'
  },
  {
    bookName: 'SUFIYA',
    bookID: 7464,
    imageFormat: 'jpg'
  }
];
let sqlAdmin = [];

// Get Request
router.get('/', (_req, res) => {
  mysqlConnection.query('SELECT * FROM admin_table', (err, rows, fields) => {
    if (!err) {
      adminData = rows;
      sqlAdmin.push(adminData);
    } else {
      console.log(err);
    }
  });
  res.render('index.ejs');
});
router.get('/adminLogin', (_req, res) => res.render('login'));
router.get('/contact', (_req, res) => res.render('contact'));
router.get('/dashboard', (_req, res) =>
  res.render('dashboard', { name: name1 })
);
router.get('/register', (req, res) => res.render('register'));
router.get('/request', (req, res) => res.render('request'));
router.get('/request/search', (req, res) => {
  const val = req.query.search;
  let book = findBook(val);
  res.render('searchresult', {
    value: book.bookName,
    id: book.bookID,
    format: book.imageFormat
  });
});

router.get('/user', (req, res) => res.render('user'));

router.get('/user/info', (req, res) => {
  mysqlConnection.query(
    `SELECT * FROM libsol_db.user_table WHERE id=${validId}`,
    (err, rows, fields) => {
      if (!err) {
        rows = rows;
        // console.log(rows);
        currentUser = {
          id: rows[0].id,
          firstName: rows[0].firstName,
          lastName: rows[0].lastName,
          gender: rows[0].gender,
          DOB: rows[0].DOB,
          address1: rows[0].address1,
          address2: rows[0].address2,
          email: rows[0].email
        };
        console.log(currentUser);
        res.render('userinfo', { user: currentUser });
      } else {
        console.log(`No Such USER`);
      }
    }
  );
});

router.get('/**', (req, res) => res.redirect('/'));

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
    email: req.body.email1
  };
  validId = user.id;
  mysqlConnection.query(
    'SELECT * FROM libsol_db.user_table',
    (err, rows, fields) => {
      if (!err) {
        adminData = rows;
        let notval = adminData.find(
          invalidUser => invalidUser.email === user.email
        );
        // console.log(notval);
        if (notval) res.redirect('/register');
        else if (notval == undefined) {
          // console.log(JSON.stringify(notval));
          mysqlConnection.query(
            'INSERT INTO user_table SET ?',
            user,
            (err, rows, fields) => {
              if (!err) {
                console.log(rows);
                res.redirect('/user');
              } else {
                console.log('error');
                res.redirect('/register');
              }
            }
          );
        }
      } else console.log(err);
    }
  );
});

router.post('/adminLogin', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/adminLogin',
    failureMessage: 'error'
  })(req, res, next);
});

module.exports = router;

const findBook = val => {
  const foundBook = books.find(
    book => book.bookName.toUpperCase() === val.toUpperCase()
  );
  return foundBook;
};

// users.push(user);
// let data = JSON.stringify(users, null, 2);
// fs.writeFile('./files/users.json', data, err => {
//   if (err) throw err;
// });
