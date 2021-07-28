const express = require('express');
const app = express();
const path = require('path');
const Post = require('./models/posts');

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

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/posts', (req, res) => {
    res.render('posts/index');
})

app.listen(3000, (req, res) => {
    console.log('Listening on port 3000');
})