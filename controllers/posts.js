const Post = require('../models/posts');

module.exports.index = async (req, res) => {
    const posts = await Post.find({})
        .populate('author')
        .sort({ date: -1 })
    res.render('posts/index', { posts });
}

module.exports.getCreate = (req, res) => {
    res.render('posts/new');
}

module.exports.create = async (req, res) => {
    const post = new Post(req.body.post);
    post.author = req.user;
    post.date = new Date(Date.now());
    await post.save();
    req.flash('success', 'Successfully made post')
    res.redirect(`/posts/${post._id}`);
}

module.exports.show = async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author').populate({ path: 'comments', populate: 'author' });
    res.render('posts/show', { post });
}

module.exports.getUpdate = async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post });
}

module.exports.update = async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body.post, { new: true, runValidators: true });
    post.author = req.user;
    post.date = new Date(Date.now());
    await post.save();
    req.flash('success', 'Successfully updated post')
    res.redirect(`/posts/${post._id}`);
}

module.exports.delete = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted post')
    res.redirect('/posts')
}