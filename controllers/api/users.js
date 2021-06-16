const express = require('express');

const router = express.Router();

const { User } = require('../../models');
const passport = require('../../passport');

router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err) {
      console.log('User Create Error: ', err);
      return;
    }

    if (user) {
      res.json({
        error: `Sorry, already a user with the username: ${username}`,
      });
      return;
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    newUser.save((err, savedUser) => {
      if (err) return res.json(err);

      res.json(savedUser);
    });
  });
});

router.post(
  '/login',
  (req, res, next) => {
    next();
  },
  passport.authenticate('local'),
  (req, res) => {
    console.log('LOGGED IN', req.user);
    res.send({
      user: req.user,
    });
  }
);

router.get('/me', (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

router.post('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.status(200).json({ msg: 'LOGGED OUT' });
  } else {
    res.status(404).json({ msg: 'NO USER TO LOGOUT' });
  }
});

module.exports = router;
