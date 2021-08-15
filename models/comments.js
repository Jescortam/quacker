const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: Date
});

commentSchema.virtual('creationString').get(function () {
    return `${this.date.toLocaleDateString()}, 
            ${this.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
})

module.exports = mongoose.model('Comment', commentSchema);