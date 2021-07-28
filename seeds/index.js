const mongoose = require('mongoose');
const Post = require('../models/posts');
const facts = require('./facts');
const usernames = require('./usernames')

mongoose.connect('mongodb://localhost:27017/quacker', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Successfully connnected to DB')
});

const getRandomDate = () => {
    const limitInferior = 1420092000000;
    return new Date(Math.floor(Math.random() * (Date.now() - limitInferior) + limitInferior))
}

const sample = arr => arr[Math.floor(Math.random() * arr.length)]
 
const seedDB = async (qty) => {
    await Post.deleteMany({});
    const posts = [];
    for (let i = 0; i < qty; i++) {
        posts.push({
            body: sample(facts),
            author: sample(usernames),
            date: getRandomDate()
        })
    }

    await Post.insertMany(posts);
    console.log('Successfully seeded DB');
}

seedDB(50).then(() => { db.close() })