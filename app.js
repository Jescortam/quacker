const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');

const postRoutes = require('./routes/posts')
const commentRoutes = require('./routes/comments')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/quacker', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
});

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

app.use('/posts', postRoutes);
app.use('/posts/:id/comments', commentRoutes);

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

app.listen(3000, (req, res) => {
    console.log('Listening on port 3000');
})