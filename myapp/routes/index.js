var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("Index");
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));

});

router.get('/signup', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', 'signup.html'));

});



router.get('/logout', function (req, res, next) {
  req.logOut();
  res.redirect('/login');
});

module.exports = router;
