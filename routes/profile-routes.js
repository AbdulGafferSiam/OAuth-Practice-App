const router = require('express').Router();

// create a middleware to check user already logged in or not
// so that anyone cannot redirect to /profile route without logging in
const authCheck = (req, res, next) => {
    if (!req.user) {
        // if user is not logged in
        res.redirect('/auth/login');
    } else {
        // if logged in
        // ok go on to the next piece of middleware which is (req, res) => {}
        next();
    }
}

// middleware set in the middle of '/' and (req, res) => {}
router.get('/', authCheck, (req, res) => {
    res.render('profile', { user: req.user });
});

module.exports = router;