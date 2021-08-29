const User = require('../models/users')

// Get registration form
module.exports.getRegister = (req, res) => {
    res.render('users/register')
}

// Register user
module.exports.register = async (req, res, next) => {
    try {
        if (await User.findOne({ email: req.body.email })) {
            req.flash('error', 'Email has already been taken');
            res.redirect('/register')
        }
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registUser = await User.register(user, password);
        req.login(registUser, err => {
            if (err) return next(err);
            req.flash('success', 'Successfully logged in!');
            res.redirect('/posts');
        })
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

// Get login form
module.exports.getLogin = (req, res) => {
    res.render('users/login');
}

// Login user
module.exports.login = async (req, res) => {
    const redirectUrl = req.session.returnTo || '/posts';
    delete req.session.returnTo;
    req.flash('success', `Welcome back!`);
    res.redirect(redirectUrl);
}

// Logout user
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', `Goodbye!`)
    res.redirect('/posts');
}