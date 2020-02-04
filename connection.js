const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'libsol_db',
  multipleStatements: true
  // if it does not work properly use this =>  insecureAuth: true
});

mysqlConnection.connect(err => {
  if (!err) {
    console.log('Connected');
  } else {
    console.log('Connection Failed : ' + err);
  }
});

module.exports = mysqlConnection;
