const express = require('express');
const router = express.Router();
const passport = require('passport');

const mysqlConnection = require('../connection');

// let dat = fs.readFileSync(
//   path.join(__dirname, '../files') + '/admin.json',
//   'utf8'
// );
// let data = fs.readFileSync(
//   path.join(__dirname, '../files') + '/users.json',
//   'utf8'
// );

let validId;

let sqlAdmin = [];
mysqlConnection.query(
  'SELECT * FROM libsol_db.admin_table',
  (err, rows, fields) => {
    if (!err) {
      adminData = rows;
      sqlAdmin.push(adminData);
    } else {
      console.log(err);
    }
  }
);
// Get Request
router.get('/', (_req, res) => res.render('index.ejs'));
router.get('/adminLogin', (_req, res) => res.render('login'));
router.get('/contact', (_req, res) => res.render('contact'));
router.get('/dashboard', (_req, res) =>
  res.render('dashboard', { name: name1 })
);
router.get('/register', (req, res) => res.render('register'));
router.get('/request', (req, res) => res.render('request', { message: '' }));
router.get('/request/search', (req, res) => {
  const val = req.query.search.toUpperCase();
  console.log(val);
  mysqlConnection.query(
    `SELECT * FROM libsol_db.books_table WHERE book_name='${val}'`,
    (err, rows, fields) => {
      console.log(rows);
      if (err) {
        res.render('request', { message: 'no such book is available' });
      } else {
        res.render('searchresult', { book: rows[0] });
      }
    }
  );
});

router.get('/user', (req, res) => res.render('user'));

router.get('/user/info', (req, res) => {
  mysqlConnection.query(
    `SELECT * FROM libsol_db.user_table WHERE user_id='${validId}'`,
    (err, rows, fields) => {
      if (!err) {
        rows = rows;
        // console.log(rows);
        currentUser = {
          id: rows[0].user_id,
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
    user_id: Date.now().toString(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    DOB: req.body.DOB,
    address1: req.body.address1,
    address2: req.body.address2,
    email: req.body.email1
  };
  validId = user.user_id;
  mysqlConnection.query(
    'SELECT * FROM libsol_db.user_table',
    (err, rows, fields) => {
      if (!err) {
        adminData = rows;
        let notval = adminData.find(
          invalidUser => invalidUser.email === user.email
        );
        if (notval) res.redirect('/register');
        else if (notval == undefined) {
          mysqlConnection.query(
            'INSERT INTO libsol_db.user_table SET ?',
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

// users.push(user);
// let data = JSON.stringify(users, null, 2);
// fs.writeFile('./files/users.json', data, err => {
//   if (err) throw err;
// });
