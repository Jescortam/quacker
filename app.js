const express = require('express');
const app = express();
const path = require('path');
const Post = require('./models/posts');
const engine = require('ejs-mate')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/quacker', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Successfully connnected to DB')
});

app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')
app.engine('ejs', engine)

app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/posts', async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', { posts });
})

app.get('/posts/new', (req, res) => {
    res.render('posts/new');
})

app.post('/posts', async (req, res) => {
    const post = new Post(req.body.post)
    post.date = new Date(Date.now())
    await post.save()
    res.redirect('/posts');
})

app.get('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/show', { post })
})

app.listen(3000, (req, res) => {
    console.log('Listening on port 3000');
})