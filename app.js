if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// Requiring packages
const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

// Requiring utilities and models
const ExpressError = require('./utils/ExpressError');
const User = require('./models/users');

// Requiring routes
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');

// Connecting to DB
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/quacker';
const mongoose = require('mongoose');
mongoose.connect(dbUrl, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Successfully connnected to DB')
});

// Setting engines, directories and general middlewares
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(mongoSanitize({ replaceWith: '_' }));

// Setting a session
const store = new MongoStore({
    mongoUrl: dbUrl,
    secret: process.env.SESSION_SECRET,
    touchAfter: 24 * 3600
})

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

app.use(session({
    name: 'session',
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        maxAge: 3600000 * 24 
    }
}))

// Setting session-related middlewares
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setting the content security policy
const scriptSrcUrls = [];
const styleSrcUrls = [
    "https://fonts.googleapis.com/",
];
const connectSrcUrls = [];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dx5veymx5/",
                "https://images.unsplash.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// Setting res.locals variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Setting routes
app.use('/posts', postRoutes);
app.use('/posts/:id/comments', commentRoutes);
app.use('/', userRoutes)

// Home route
app.get('/', (req, res) => {
    res.render('home');
})

// Page not found
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
})

// Setting the port
const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`);
})