const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comments');
const { cloudinary } = require('../cloudinary/index');

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('pad16_9').get(function() {
    return this.url.replace('/upload', '/upload/h_400,w_520,c_pad,b_auto:predominant');
})

imageSchema.virtual('padSquare').get(function() {
    return this.url.replace('/upload', '/upload/h_400,w_400,c_pad,b_auto:predominant');
})

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
    images: [imageSchema]
})

postSchema.virtual('creationString').get(function () {
    return `${this.date.toLocaleDateString()}, 
            ${this.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
})

postSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Comment.deleteMany({ _id: { $in: doc.comments } })
        for (let image of doc.images) {
            cloudinary.uploader.destroy(image.filename)
        }
    }
})

module.exports = mongoose.model('Post', postSchema);