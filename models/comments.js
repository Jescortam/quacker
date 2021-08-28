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

// Get date and time in the user time zone and in the form of a string
commentSchema.virtual('creationString').get(function () {
    const localDate = new Date(this.date + this.date.getTimezoneOffset() * 60000)
    return `${localDate.toLocaleDateString()}, 
            ${localDate.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })}`
})

module.exports = mongoose.model('Comment', commentSchema);