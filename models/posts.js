const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comments')

const postSchema = new Schema({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: Date,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    images: [{
        url: String,
        filename: String,
    }]
})

postSchema.virtual('creationString').get(function () {
    return `${this.date.toLocaleDateString()}, 
            ${this.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
})

postSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Post', postSchema);