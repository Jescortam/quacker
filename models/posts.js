const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    body: String,
    author: String,
    date: Date,
})

module.exports = mongoose.model('Post', postSchema);