const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const Comment = require('./models/comments');
const Post = require('./models/posts');
const catchAsync = require('./utils/catchAsync')

const postRoutes = require('./routes/posts')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/quacker', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: true
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

app.use('/posts', postRoutes)

app.get('/', (req, res) => {
    res.render('home');
})

app.post('/posts/:id/comments', catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const comment = new Comment(req.body.comment);
    comment.date = Date.now();
    post.comments.push(comment);
    await comment.save();
    await post.save();
    res.redirect(`/posts/${id}`);
}))

app.delete('/posts/:id/comments/:commentId', catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/posts/${id}`);
}))

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

// VALIDATION
// ROUTES
// CONTROLLERS
// delete post delete comment middleware