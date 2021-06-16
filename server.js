const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const mongoose = require('mongoose');
const logger = require('morgan');
const LOG_MODE = process.env.NODE_ENV === 'production' ? 'common' : 'dev';


const controllers = require('./controllers');

const app = express();
const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(logger(LOG_MODE));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

mongoose.connect(
  process.env.MONGODB_URI ||
  'mongodb://localhost/slack-clone'
).then(
  () => {
    console.log('Connected to Mongoose')
  }, 
  (err) => {
    console.log(`Mongoose connection err:\n${err}`)
  }
);


// Sessions
app.use(
  session({
    secret: 'RANDOM STRING',
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Add routes, both API and view
app.use(controllers);

// Start the API server
app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
