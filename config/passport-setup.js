const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');

// function that take a piece of info from our record
// then pass it on to stuff in a cookie
// here we use mongodb genarated id and send it as a cookie
// here 'done' is a callback function
// ques: Where does user.id go after passport.serializeUser has been called?
// serializeUser determines which data of the user object should be stored in the session
// The result of the serializeUser method is attached to the session as req.session.passport.user = {id: 'xyz'}
passport.serializeUser((user, done) => {
    // this function execute cookieSession() in server.js file
    // The user id is saved in the session and is later used to retrieve the whole object via the deserializeUser function
    done(null, user.id);
});

// when cookie comes back to us on the server when a browser makes a request
// for the profile page for example
// then we are going to receive that ID and deserialize it
// so that we can grab a user from that ID
// ques: We are calling passport.deserializeUser right after it where does it fit in the workflow?
// The first argument of deserializeUser corresponds to the key of the user object that was given to the serializeUsers done function
// So your whole object is retrieved with help of that key
// The fetched object is attached to the request object as req.user
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            // send user to the request object as req.user
            // here error is null
            done(null, user);
        })
});

passport.use(
    new GoogleStrategy({
        // options for the google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        // access or refresh token get from google

        // console.log(profile);

        // check if user already exists in our db
        // find one record inside our db based on certain criteria
        User.findOne({ googleID: profile.id })
            .then((currentUser) => {
                if (currentUser) {
                    // already have the user
                    console.log('User already exist: ' + currentUser);
                    // this callback execute serializeUser() method
                    done(null, currentUser);
                } else {
                    // if not, create user in our db
                    new User({
                        username: profile.displayName,
                        googleID: profile.id,
                        thumbnail: profile._json.picture
                    })
                        .save()
                        // save() return promise with newUser which is saved
                        .then((newUser) => {
                            console.log('New user created: ' + newUser);
                            // this callback execute serializeUser() method
                            done(null, newUser);
                        })
                }
            })
    })
)