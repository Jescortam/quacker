const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateBody = schema => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errMsg = error.details.map(err => err.message).join(',') 
            next(new ExpressError(errMsg, 400));
        } else next();
    }
}