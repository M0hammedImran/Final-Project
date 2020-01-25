const express = require('express');
const router = express.Router();
// const passport = require('passport');
const fs = require('fs');

let data = fs.readFileSync('files/users.json');
let userData = JSON.parse(data);
const name = userData[0].name;
router.get('/user', (req, res) => res.render('userinfo', { key: name }));
module.exports = router;
