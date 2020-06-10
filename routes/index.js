// eslint-env es6
require('dotenv').config();

const express = require('express');
const router = express.Router();
const passport = require('passport');
const mysqlConnection = require('../connection');
const multer = require('multer');
const path = require('path');
const SendMail = require('../smtp/index');
// const fs = require('fs');
let validId;

let updatedFileName = '';
let row = [];
let userinfo = [];
let emess = '';
let emessArray = [];
let umess = [];
let booksvalue = [];
let message;

const storage = multer.diskStorage({
  destination: 'assets/images/books',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
    updatedFileName =
      file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    console.log(updatedFileName);
  },
});
const upload = multer({ storage: storage });
//loading admin values
let sqlAdmin = [];

mysqlConnection.query('SELECT * FROM libsol_db.admin_table', (err, rows) => {
  if (!err) {
    rows.forEach((row) => {
      sqlAdmin.push(row);
    });
  } else {
    console.log(err);
  }
});

const event = new Date();
let dateArray = event.toLocaleString('en-GB').toString().split(',');
let dateArray2 = (dateArray[0] + '').split('/');
let today = `${dateArray2[0]}.${dateArray2[1]}.${+dateArray2[2]}`;

const event2 = new Date();
event2.setDate(event.getDate() + 30);
let dateArray3 = event2.toLocaleString('en-GB').toString().split(',');
let dateArray4 = (dateArray3[0] + '').split('/');
let tomorrow = `${dateArray4[0]}.${dateArray4[1]}.${+dateArray4[2]}`;

let tran_table = '';

// Get Request
router.get('/', (req, res) => res.render('index'));
router.get('/adminLogin', (req, res) => res.render('login'));
router.get('/contact', (req, res) =>
  res.render('contact', { admins: sqlAdmin })
);
router.get('/dashboard', (req, res) =>
  mysqlConnection.query(`SELECT * FROM libsol_db.admin_table`, (err, rows) => {
    if (rows.toString().length !== 0) {
      res.render('dashboard', { umess: umess, rows: rows[0] });
    }
  })
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
  mysqlConnection.query(`SELECT * FROM libsol_db.user_table`, (err, rows) => {
    let users;
    if (!err) users = rows;
    else console.log(err);
    res.render('viewuser', { users: users });
  });
});
router.get('/dashboard/addbook', (req, res) => {
  res.render('addbook');
});
router.get('/dashboard/removebook', (req, res) => {
  res.render('rmbook');
});
router.get('/dashboard/checkbookremoval', (req, res) => {
  res.render('checkbook', { book: row[0] });
});
router.get('/dashboard/checkuserremoval', (req, res) => {
  res.render('checkuser', { user: userinfo[0] });
});
router.get('/dashboard/viewbook', (req, res) => {
  mysqlConnection.query(`SELECT * FROM libsol_db.books_table`, (err, rows) => {
    let books;
    if (!err) {
      books = rows;
    } else {
      console.log(err);
    }
    res.render('viewbook', { books: books });
  });
});
router.get('/dashboard/updatebook', (req, res) => {
  console.log(emess);
  res.render('upbook', { message: emess });
});

router.get('/register', (req, res) => res.render('register'));
router.get('/request', (req, res) => res.render('request', { message: '' }));

router.get('/request/search', (req, res) => {
  const val = req.query.search.toLowerCase();
  mysqlConnection.query(`SELECT * FROM libsol_db.books_table`, (err, rows) => {
    if (!err) {
      let books = rows;
      let found_book = books.find(
        (book) => book.book_name.toLowerCase() === val
      );
      console.log(found_book);
      if (found_book !== undefined) {
        console.log('Found');
        message = '';
        res.render('searchresult', {
          book: found_book,
          message: message,
        });
      } else {
        message = 'No such book is available';
        res.render('searchresult', { message: message });
      }
    }
  });
});

router.get('/request/invoice', (req, res) => {
  res.render('invoice', {
    book: row[0],
    user: userinfo[0],
    boDate: today,
    reDate: tomorrow,
  });
});

router.get('/request/auth', (req, res) =>
  res.render('confirm', { book: row[0] })
);
router.get('/request/error', (req, res) => {
  res.render('error', { emess: emessArray });
});
router.get('/request/someerror', (req, res) => {
  res.render('someerror');
});
router.get('/request/success', (req, res) => {
  res.render('success', { data: tran_table });
});

router.get('/user', (req, res) => res.render('user'));
router.get('/user/info', (req, res) => {
  mysqlConnection.query(
    `SELECT * FROM libsol_db.user_table WHERE user_id='${validId}'`,
    (err, rows) => {
      if (!err) {
        let d = rows[0].DOB + '';
        let a = d.split(' ');
        let [, m, da, y] = a;
        let formattedDate = `${da}-${m}-${y}`;

        const {
          user_id,
          firstName,
          lastName,
          gender,
          address1,
          address2,
          email,
          phone,
        } = rows[0];

        let currentUser = {
          user_id,
          firstName,
          lastName,
          gender,
          DOB: formattedDate,
          address1,
          address2,
          email,
          phone,
        };

        console.log(currentUser);
        res.render('userinfo', { user: currentUser });
      } else {
        console.log(`No Such USER`);
        res.render('user', {
          message: 'Sorry! Unable to fetch Data Try Again.',
        });
      }
    }
  );
});

router.get('/viewall', (req, res) => {
  mysqlConnection.query(`SELECT * FROM libsol_db.books_table`, (err, rows) => {
    let books;
    if (!err) books = rows;
    else console.log(err);
    res.render('viewall', { books: books });
  });
});
router.get('/**', (req, res) => res.redirect('/'));

// POST Requests
router.post('/register', (req, res) => {
  let {
    firstName,
    lastName,
    gender,
    DOB,
    address1,
    address2,
    email,
    phone,
  } = req.body;

  let user = {
    user_id: keyGen(),
    firstName,
    lastName,
    gender,
    DOB,
    address1,
    address2,
    email,
    phone,
  };

  validId = user.user_id;

  mysqlConnection.query('SELECT * FROM libsol_db.user_table', (err, rows) => {
    if (!err) {
      let adminData = rows;
      let notval = adminData.find(
        (invalidUser) => invalidUser.email === user.email
      );
      if (notval) res.redirect('/register');
      else if (notval == undefined) {
        mysqlConnection.query(
          'INSERT INTO libsol_db.user_table SET ?',
          user,
          (err, rows) => {
            if (!err) {
              let messageBody = `<div style="font-size:16px;"><You>Welcome, <br/> Your new HASH KEY is <strong>${user.user_id}</strong>. You can use this to request/return Books.</p> </div>`;
              SendMail(user.email, messageBody);
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
  });
});

router.post('/adminLogin', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/adminLogin',
    failureMessage: 'error',
  })(req, res, next);
});

router.post('/request/book', (req, res) => {
  // console.log(req.body.id);
  mysqlConnection.query(
    `SELECT * FROM libsol_db.books_table WHERE book_id=${req.body.id}`,
    (err, rows) => {
      row.length = 0;
      row.push(rows[0]);
    }
  );
  res.redirect('/request/auth');
});

router.post('/request/auth', (req, res) => {
  mysqlConnection.query(
    `SELECT * FROM libsol_db.user_table WHERE user_id=${req.body.user_id}`,
    (err, rows) => {
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

router.post('/request/last', (req, res) => {
  const trans_msg = `${userinfo[0].firstName} ${userinfo[0].lastName} borrowed ${row[0].book_name} on ${today} and have to return it by ${tomorrow}`;
  const { user_id, book_id, boDate, reDate } = req.body;

  let trans = {
    transaction_id: keyGenSmall(),
    user_id,
    book_id,
    borrow_date: boDate,
    due_date: reDate,
    transaction_message: trans_msg,
  };

  console.log(trans);

  mysqlConnection.query(
    `SELECT * FROM libsol_db.transaction_table WHERE user_id='${user_id}'`,
    (err, rows) => {
      if (!err) {
        let transData = rows;
        let notval = transData.find(
          (invalidUser) => invalidUser.user_id === trans.user_id
        );
        if (notval) {
          emessArray = [];
          if (notval.due_date.toString() == today) {
            emessArray.push(notval);
            console.log(emessArray);
          }
          res.redirect('/request/error');
        } else if (!notval) {
          mysqlConnection.query(
            'INSERT INTO libsol_db.transaction_table SET ?',
            trans,
            (err, rows) => {
              if (!err) {
                mysqlConnection.query(
                  `UPDATE libsol_db.books_table SET copies=copies-1 WHERE book_id=${row[0].book_id}`,
                  (err, rows) => {
                    if (!err) {
                      mysqlConnection.query(
                        `SELECT * FROM libsol_db.transaction_table WHERE user_id=${req.body.user_id}`,
                        (err, rows) => {
                          if (!err) {
                            tran_table = '';
                            tran_table = rows[0];
                            res.redirect('/request/success');
                          }
                        }
                      );
                    } else {
                      console.log(err);
                      res.redirect('/request/someerror');
                    }
                  }
                );
              } else {
                console.log(err);
                res.redirect('/register/someerror');
              }
            }
          );
        }
      } else console.log(err);
    }
  );
});

router.post('/dashboard/addbook', upload.single('cover'), (req, res) => {
  const {
    book_id,
    book_name,
    author,
    publisher,
    published_year,
    origin_country,
    pages,
    copies,
  } = req.body;

  if (!req.file) {
    console.log('No file received');
    return res.redirect('/dashboard/addbook');
  } else {
    console.log('file received');
    const completeBookDetails = {
      book_id,
      book_name,
      author,
      publisher,
      published_year,
      origin_country,
      pages,
      copies,
      cover_name: updatedFileName,
    };

    mysqlConnection.query(
      'INSERT INTO libsol_db.books_table SET ?',
      completeBookDetails,
      (err, rows) => {
        if (!err) {
          umess = [];
          umess = 'Added a new book';
          return res.redirect('/dashboard');
        } else {
          umess = [];
          umess = 'Error adding a new book';
          res.redirect('/dashboard/addbook');
        }
      }
    );
  }
});

router.post('/dashboard/updatebook', (req, res) => {
  const { transaction_id, book_id } = req.body;

  mysqlConnection.query(
    `SELECT * FROM libsol_db.transaction_table WHERE transaction_id=${transaction_id}`,
    (err, rows) => {
      if (rows.toString().length !== 0) {
        emess = '';
        mysqlConnection.query(
          `DELETE FROM libsol_db.transaction_table WHERE transaction_id=${transaction_id}`,
          (err, rows) => {
            console.log(err);
            if (rows.toString().length !== 0) {
              mysqlConnection.query(
                `UPDATE libsol_db.books_table SET copies=copies+1 WHERE book_id=${book_id}`,
                (err, rows) => {
                  if (!err) {
                    umess = [];
                    umess = 'Book Updated Successfully!';
                    console.log(umess);
                    res.redirect('/dashboard');
                  } else console.log(err);
                }
              );
            } else console.log(err);
          }
        );
      } else {
        emess = 'Check the Transaction ID and try again.';
        console.log(emess);
        res.redirect('/dashboard/updatebook');
      }
    }
  );
});

router.post('/dashboard/removebook', (req, res) => {
  mysqlConnection.query(
    `SELECT * FROM libsol_db.books_table WHERE book_id=${req.body.book_id}`,
    (err, rows) => {
      if (!err) {
        if (rows.toString().length !== 0) {
          row = [];
          row.push(rows[0]);
          res.redirect('/dashboard/checkbookremoval');
        } else {
          umess = '';
          umess = 'Wrong Book ID';
          res.redirect('/dashboard');
        }
      } else {
        console.log(err);
        res.redirect('/dashboard');
      }
    }
  );
});

router.post('/dashboard/confirmbookremoval', (req, res) => {
  mysqlConnection.query(
    `DELETE FROM libsol_db.books_table WHERE book_id=${row[0].book_id}`,
    (err, rows) => {
      if (!err) {
        if (rows.toString().length !== 0) {
          umess = [];
          umess = 'Book Removed Successfully!';
          console.log(umess);
          res.redirect('/dashboard');
        }
      } else {
        console.log(err);
        umess = [];
        umess = 'Book Removal was Unsuccessful!';
        console.log(umess);
        res.redirect('/dashboard');
      }
    }
  );
});

router.post('/dashboard/removeuser', (req, res) => {
  mysqlConnection.query(
    `SELECT * FROM libsol_db.user_table WHERE user_id=${req.body.user_id}`,
    (err, rows) => {
      if (!err) {
        if (rows.toString().length !== 0) {
          userinfo = [];
          userinfo.push(rows[0]);
          console.log(userinfo);
          res.redirect('/dashboard/checkuserremoval');
        } else {
          umess = '';
          umess = 'Wrong User ID';
          res.redirect('/dashboard');
        }
      } else {
        console.log(err);
        res.redirect('/dashboard');
      }
    }
  );
});

router.post('/dashboard/confirmuserremoval', (req, res) => {
  mysqlConnection.query(
    `DELETE FROM libsol_db.user_table WHERE user_id=${userinfo[0].user_id}`,
    (err, rows) => {
      if (!err) {
        if (rows.toString().length !== 0) {
          umess = [];
          umess = 'User Removed Successfully!';
          console.log(umess);
          res.redirect('/dashboard');
        }
      } else {
        console.log(err);
        umess = [];
        umess = 'User Removal was Unsuccessful!';
        console.log(umess);
        res.redirect('/dashboard');
      }
    }
  );
});

function keyGen() {
  return (Math.random() + '').substring(2, 10);
}
function keyGenSmall() {
  return (Math.random() + '').substring(2, 6);
}

function viewall() {
  mysqlConnection.query(`SELECT * FROM libsol_db.books_table`, (err, rows) => {
    if (!err) {
      if (rows.toString().length !== 0) {
        booksvalue = [];
        booksvalue.push(rows[0]);
      }
    } else {
      console.log(err);
    }
  });
}
viewall();

module.exports = router;
