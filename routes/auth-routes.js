const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logout();
    res.redirect('/');
});

// auth with google
router.get('/google', passport.authenticate('google', {
    // scope use to tell passport what we want to retrive from the users profile
    scope: ['profile']
}));

// callback route for google to redirect to
router.get('/google/redirect',
    // this time of auth we have a code in the URL
    // so instead of redirect to consent screen
    // it take the code and exchange the code for profile info
    // at this time passport callback function will be fired
    passport.authenticate('google'), (req, res) => {
        // Successful authentication
        res.redirect('/profile');
    }
);

module.exports = router;