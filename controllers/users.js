module.exports.getRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
    try {
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

module.exports.getLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = async (req, res) => {
    const redirectUrl = (req.method === 'GET' && req.session.returnTo) ? req.session.returnTo : '/posts';
    delete req.session.returnTo;
    req.flash('success', `Welcome back!`);
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', `Goodbye!`)
    res.redirect('/posts');
}