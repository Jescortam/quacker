const Post = require('../models/posts');

module.exports.index = async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', { posts });
}

module.exports.getCreate = (req, res) => {
    res.render('posts/new');
}

module.exports.create = async (req, res) => {
    const post = new Post(req.body.post);
    post.date = new Date(Date.now());
    await post.save();
    res.redirect(`/posts/${post._id}`);
}

module.exports.show = async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/show', { post });
}

module.exports.getUpdate = async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post });
}

module.exports.update = async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body.post);
    post.date = new Date(Date.now());
    await post.save();
    res.redirect(`/posts/${post._id}`);
}

module.exports.delete = async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id);
    res.redirect('/posts')
}