const Comment = require('../models/comments');
const Post = require('../models/posts');

module.exports.create = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const comment = new Comment(req.body.comment);
    comment.date = Date.now();
    post.comments.push(comment);
    await comment.save();
    await post.save();
    res.redirect(`/posts/${id}`);
}

module.exports.delete = async (req, res) => {
    const { id, commentId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/posts/${id}`);
}