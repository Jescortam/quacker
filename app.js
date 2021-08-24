if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// IMAGE UPLOAD MODERATION
// SECURITY STUFF
// Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');

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

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('ejs', engine);

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(mongoSanitize({ replaceWith: '_' }));

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
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/posts', postRoutes);
app.use('/posts/:id/comments', commentRoutes);
app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`);
})