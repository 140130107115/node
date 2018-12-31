var express = require('express');
var router = express.Router();
let User = require('../db/user');
const Response = require('../db/Response');
var path = require('path');

// router.use(function(req,res,next){
//   console.log(req.isAuthenticated());
// })
/* GET users listing. */
router.get('/', function (req, res, next) {
  User.find({}, (err, users) => {
    if (err) return next(err);
    return res.send(new Response(users, null, null));
    // res.json(users);
  })
});

router.get('/getUserById/:id', checkAuthentication, function (req, res, next) {
  console.log(req.isAuthenticated());
  User.find({ _id: req.params.id }, (err, users) => {
    if (err) return next(err);
    return res.send(new Response(users, null, null));
    // res.json(users);
  })
});

router.get('/profile', checkAuthentication, function (req, res, next) {
  console.log(req.isAuthenticated());
  res.sendFile(path.join(__dirname, '../public', 'profile.html'));

});

router.get('/logout', function (req, res, next) {
  req.logOut();
  return res.send(new Response(null, null, 'Successfully logged out'));
});



router.post('/insert', function (req, res, next) {
  console.log('insert');
  User.create(req.body, (err, result) => {
    if (err) return next(err);
    return res.send(new Response(result, null, null));
    // res.json(result);
  })
})

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    //req.isAuthenticated() will return true if user is logged in
    next();
  } else {
    res.status(403).send('Unauthorized User');
  }
}

module.exports = router;
