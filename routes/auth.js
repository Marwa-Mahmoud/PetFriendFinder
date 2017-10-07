const authController = require('../controllers/authcontroller.js');

module.exports = function (app, passport) {
    app.get('/signup', authController.signup);
    app.get('/signin', authController.signin);
    app.get('/profile', isLoggedIn, authController.profile);
    app.get('/logout', authController.logout);
    app.get('/', authController.home);

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup'
    }));

    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/pets',
        failureRedirect: '/signup'
    }));

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/signup');
    }
}