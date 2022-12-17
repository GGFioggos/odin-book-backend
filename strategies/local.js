const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect username!' });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if (err) {
                return next(err);
            }
            if (res) {
                // passwords match! log user in
                return done(null, user, {
                    message: 'Logged in successfully',
                });
            } else {
                // passwords do not match!
                return done(null, false, { message: 'Incorrect password' });
            }
        });
    });
});

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
