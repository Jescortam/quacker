const Post = require('../models/posts');
const { cloudinary } = require('../cloudinary/index')

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
    post.images = req.files.map( file => ({ url: file.path, filename: file.filename }))
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
    const { id } = req.params;
    const { deleteImgs } = req.body;
    const post = await Post.findByIdAndUpdate(id, req.body.post, { new: true, runValidators: true });
    post.author = req.user;
    post.date = new Date(Date.now());
    if (deleteImgs) {
        for (let image of deleteImgs) {
            await cloudinary.uploader.destroy(image);
        }
        await post.updateOne({ $pull: { images: { filename: { $in: deleteImgs } } } })
    }
    post.images.push(...req.files.map(file => ({ url: file.path, filename: file.filename })));
    await post.save();
    req.flash('success', 'Successfully updated post')
    res.redirect(`/posts/${post._id}`);
}

module.exports.delete = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted post')
    res.redirect('/posts')
}