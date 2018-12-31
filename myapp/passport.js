let localStrategy = require('passport-local');
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let User = require('./db/user');
module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new localStrategy(function (username, password, done) {
        User.findOne({ username: username }, (err, user) => {
            if (err) { done(err) }
            else {
                if (user) {
                    let valid = user.comparePassword(password, user.password);
                    if (valid) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                } else {
                    done(null, false)
                }
            }
        })
    }))

    passport.use(new GoogleStrategy({
        clientID: '515835634976-gsvlptt7309fnjrh4jiifl1h86ur7asl.apps.googleusercontent.com',
        clientSecret: 'NjXJEXBAKzimmV7Ezd2LcUiP',
        callbackURL: "http://localhost:3000/auth/google/callback"
    }, function (accessToken, refreshToken, profile, done) {
        console.log(profile);

        // User.findOrCreate({ username: profile.displayName }, { username: profile.displayName, firstname: profile.name.familyName, lastname : profile.name.givenName }, function (err, user) {
        //     if (err) { return done(err); }
        //     done(null, user);
        // });

        User.findOrCreate({ username: profile.emails[0].value }, { name: profile.displayName, provider: profile.provider, user_Id: profile.id }, function (err, click) {
            done(err, click);
        })


    }))

    passport.use(new FacebookStrategy({
        clientID: '2314610828771448',
        clientSecret: '480b0a4b3b0d5689a089cb40051254c3',
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
        function (accessToken, refreshToken, profile, done) {
            // User.findOrCreate(..., function (err, user) {
            //     if (err) { return done(err); }
            //     done(null, user);
            // });

            console.log(profile);
            User.findOrCreate({ user_Id: profile.id }, { user_Id: profile.id, name: profile.displayName, provider: profile.provider }, function (err, click) {
                done(err, click);
            })

        }
    ));


}