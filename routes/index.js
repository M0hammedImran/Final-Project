const express = require('express');
const router = express.Router();
const passport = require('passport');
const mysqlConnection = require('../connection');

let validId;
var row = [];
var userinfo = [];
// console.log(row);

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
router.get('/', (req, res) => res.render('index'));
router.get('/adminLogin', (req, res) => res.render('login'));
router.get('/contact', (req, res) => res.render('contact'));
router.get('/dashboard', (req, res) =>
  res.render('dashboard', { name: 'Admin' })
);

router.get('/dashboard/adduser', (req, res) => {
  res.render('adduser');
});
router.get('/dashboard/removeuser', (req, res) => {
  res.render('rmuser');
});
router.get('/dashboard/updateuser', (req, res) => {
  res.render('upuser');
});
router.get('/dashboard/viewuser', (req, res) => {
  mysqlConnection.query(
    `SELECT * FROM libsol_db.user_table`,
    (err, rows, fields) => {
      let users;
      if (!err) users = rows;
      else console.log(err);
      res.render('viewuser', { users: users });
    }
  );
});
router.get('/dashboard/addbook', (req, res) => {
  res.render('addbook');
});
router.get('/dashboard/removebook', (req, res) => {
  res.render('rmbook');
});
router.get('/dashboard/viewbook', (req, res) => {
  mysqlConnection.query(
    `SELECT * FROM libsol_db.books_table`,
    (err, rows, fields) => {
      let books;
      if (!err) {
        books = rows;
      } else {
        console.log(err);
      }
      res.render('viewbook', { books: books });
    }
  );
});
router.get('/dashboard/updatebook', (req, res) => {
  res.render('upbook');
});

router.get('/register', (req, res) => res.render('register'));
router.get('/request', (req, res) => res.render('request', { message: '' }));
router.get('/request/search', (req, res) => {
  const val = req.query.search.toUpperCase();
  // console.log(`01.${val}`);
  mysqlConnection.query(
    `SELECT * FROM libsol_db.books_table WHERE book_name='${val}'`,
    (err, rows, fields) => {
      // console.log(typeof rows.toString());
      let book, message;
      if (!err) {
        if (rows.toString().length === 0) {
          book = [
            {
              book_id: '',
              book_name: '',
              author: '',
              publisher: '',
              published_year: '',
              origin_country: '',
              pages: '',
              copies: ''
            }
          ];
          message = 'No Such Book is Available';
        } else {
          book = rows[0];
          message = '';
        }
        console.log(book);
        res.render('searchresult', {
          book: book,
          message: message
        });
        // console.log(err);
      } else {
        console.log(err);
        res.render('request', { message: 'no such book is available' });
      }
    }
  );
});
router.get('/request/invoice', (req, res) => {
  res.render('invoice', { book: row[0] });
});

router.get('/request/auth', (req, res) =>
  res.render('confirm', { book: row[0] })
);

router.get('/user', (req, res) => res.render('user'));
router.get('/user/info', (req, res) => {
  mysqlConnection.query(
    `SELECT * FROM libsol_db.user_table WHERE user_id='${validId}'`,
    (err, rows, fields) => {
      if (!err) {
        d = rows[0].DOB + '';
        a = d.split(' ');
        y = a[3];
        m = a[1];
        da = a[2];
        formattedDate = `${da}-${m}-${y}`;
        currentUser = {
          id: rows[0].user_id,
          firstName: rows[0].firstName,
          lastName: rows[0].lastName,
          gender: rows[0].gender,
          DOB: formattedDate,
          address1: rows[0].address1,
          address2: rows[0].address2,
          email: rows[0].email,
          phone: rows[0].phone
        };
        console.log(currentUser);
        res.render('userinfo', { user: currentUser });
      } else {
        console.log(`No Such USER`);
        res.render('user', {
          message: 'Sorry! Unable to fetch Data Try Again.'
        });
      }
    }
  );
});
router.get('/**', (req, res) => res.redirect('/'));

// POST Requests
router.post('/register', (req, res) => {
  let user = {
    user_id: keyGen(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    DOB: req.body.DOB,
    address1: req.body.address1,
    address2: req.body.address2,
    email: req.body.email,
    phone: req.body.phone
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
                console.log('Success!');
                res.redirect('/user');
              } else {
                console.log(err);
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

router.post('/request/book', (req, res) => {
  // console.log(req.body.id);
  mysqlConnection.query(
    `SELECT * FROM libsol_db.books_table WHERE book_id=${req.body.id}`,
    (err, rows, fields) => {
      // console.log(err, rows);
      row.length = 0;
      row.push(rows[0]);
    }
  );
  res.redirect('/request/auth');
});

router.post('/request/auth', (req, res) => {
  mysqlConnection.query(
    `SELECT * FROM libsol_db.user_table WHERE user_id=${req.body.user_id}`,
    (err, rows, fields) => {
      if (!err && rows.toString().length !== 0) {
        userinfo = [];
        userinfo.push(rows[0]);
        console.log(userinfo);
        res.redirect('/request/invoice');
      } else {
        console.log(err);
        res.redirect('/request');
      }
    }
  );
});

const keyGen = () => (Math.random() + '').substring(2, 10);

module.exports = router;
