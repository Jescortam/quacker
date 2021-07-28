const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');

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