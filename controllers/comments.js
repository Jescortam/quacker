const Comment = require('../models/comments');
const Post = require('../models/posts');

// Creates a comment
module.exports.create = async (req, res) => {
    const comment = new Comment(req.body.comment);
    comment.author = req.user;
    comment.date = Date.now();

    const { id } = req.params;
    const post = await Post.findById(id);
    post.comments.push(comment);

    await comment.save();
    await post.save();
    req.flash('success', 'Successfully created comment');
    res.redirect(`/posts/${id}`);
}

// Deletes the comment
module.exports.delete = async (req, res) => {
    const { id, commentId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    
    req.flash('success', 'Successfully deleted comment')
    res.redirect(`/posts/${id}`);
}