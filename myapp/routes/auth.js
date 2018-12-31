var express = require('express');
var router = express.Router();
var path = require('path');
var app = express();

let User = require('../db/user');
const Response = require('../db/Response');
/* GET home page. */



module.exports = function (passport) {
    router.post('/signup', function (req, res) {
        var body = req.body,
            username = body.username,
            password = body.password
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                res.status(500).send('Error Occured');
            } else {
                if (user) {
                    res.status(500).send('User Already Exist');
                } else {
                    let record = new User();
                    record.username = username;
                    record.password = record.hashPassword(password);
                    record.firstname = req.body.firstname;
                    record.lastname = req.body.lastname;
                    record.save((err, user) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('DB Error');
                        } else {
                            res.send(user);
                        }
                    })
                }
            }
        })
    });

    router.post('/login', function (req, res, next) {
        passport.authenticate('local', function (err, user) {
            if (err) {
                return res.status(500).send(err.message); // will generate a 500 error
            }

            if (!user) {
                return res.status(401).send("Authentication failed!!");
            }
            req.login(user, loginErr => {
                if (loginErr) {
                    return res.status(500).send("Some Error Occured!!");
                }

                // return res.redirect('/users/profile');
                return res.send(new Response(user, false, "Login Successfull!!"));
            });



        })(req, res, next);
    })


    router.get('/google', passport.authenticate('google', {
        scope: ['email']
    }));

    router.get('/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/users/profile');
        });

    router.get('/facebook', passport.authenticate('facebook'));

    router.get('/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        }));

    return router;
}
