const User = require('../models/user');

const LocalStrategy = require('passport-local').Strategy;

const strategy = new LocalStrategy(
  {
    usernameField: 'email',
  },
  (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'Incorrect Email' });
      }

      if (!user.checkPassword(password)) {
        return done(null, false, { message: 'Incorrect Password' });
      }

      return done(null, user);
    });
  }
);

module.exports = strategy;
