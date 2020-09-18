const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');

// "emitters" emit named events that cause Function objects ("listeners") to be called
// All objects that emit events are instances of the EventEmitter class
// use to avoid "MaxListenersExceededWarning"
// By default, a maximum of 10 listeners can be registered for any single event
// ref: https://nodejs.org/api/events.html
require('events').EventEmitter.defaultMaxListeners = 15;

const app = express();

// set the view engine (views folder) to ejs
app.set('view engine', 'ejs');

// after serializeUser() in passport-setup file, this code will execute to encrypt the cookie
// after encryption, cookie will be sent to browser
// this all happening once a user logged in
app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(keys.mongodb.MongoURI,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }, () => {
        console.log('Connected to mongodb');
    });

// set up routes by using it as middleware
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

app.listen(3000, () => {
    console.log('App listening on port 3000');
});