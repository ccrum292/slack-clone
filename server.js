const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const mongoose = require('mongoose');
const logger = require('morgan');
const LOG_MODE = process.env.NODE_ENV === 'production' ? 'common' : 'dev';
const controllers = require('./controllers');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
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

passport.serializeUser(function(user, done) {
  console.log('serializing user: ');
  console.log(user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  user.findById(id, function(err, user) {
    console.log('no im not serial');
    done(err, user);
  });
});



// Add routes, both API and view
app.use(controllers);


io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit("connection", null);
  require('./sockets/chat/joinManyRooms')(io, socket);
  require("./sockets/chat/msg")(io, socket);
  require("./sockets/disconnected")(io, socket);

});


// Start the API server
server.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
