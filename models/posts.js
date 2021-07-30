const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comments')

const postSchema = new Schema({
    body: String,
    author: String,
    date: Date,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
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