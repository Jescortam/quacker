const Post = require('../models/posts');
const User = require('../models/users')
const { cloudinary } = require('../cloudinary/index')

// Gets queried posts
module.exports.index = async (req, res) => {
    // Set variables and constants
    let { offset = 0, p_author } = req.query;
    offset = parseInt(offset);
    const limit = 20;
    const findQuery = (p_author) ? { author: { _id: p_author } } : {}

    // Find matching posts 
    const posts = await Post.find(findQuery)
        .populate('author')
        .sort({ date: -1 })
        .skip(parseInt(offset))
        .limit(limit);

    // Set queries of previous and next pages
    const postsLength = await Post.countDocuments(findQuery);
    let prevQuery = (offset >= limit) ? `?offset=${offset - limit}` : '';
    let nextQuery = (postsLength > offset + limit) ? `?offset=${offset + limit}` : '';

    // If an author is specified, add it to the query
    let author;
    if (p_author) {
        const addAuthorQuery = query => {
            query.concat(((query.includes('?')) ? '&' : '?') + `author=${p_author}`)
        }
        addAuthorQuery(prevQuery);
        addAuthorQuery(nextQuery);
        author = await User.findById(p_author);
    }

    // Render index
    res.render('posts/index', { posts, prevQuery, nextQuery, author});
}

// Gets post creation form
module.exports.getCreate = (req, res) => {
    res.render('posts/new');
}

// Creates post
module.exports.create = async (req, res) => {
    const post = new Post(req.body.post);
    post.author = req.user;
    post.date = new Date(Date.now());
    post.images = req.files.map( file => ({ url: file.path, filename: file.filename }))

    await post.save();
    req.flash('success', 'Successfully made post')
    res.redirect(`/posts/${post._id}`);
}

// Shows post
module.exports.show = async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author').populate({ path: 'comments', populate: 'author' });
    res.render('posts/show', { post });
}

// Gets post updation form
module.exports.getUpdate = async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post });
}

// Updates post
module.exports.update = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body.post, { new: true, runValidators: true });
    post.author = req.user;
    post.date = new Date(Date.now());

    const { deleteImgs } = req.body;
    if (deleteImgs) {
        for (let image of deleteImgs) await cloudinary.uploader.destroy(image);
        await post.updateOne({ $pull: { images: { filename: { $in: deleteImgs } } } })
    }
    post.images.push(...req.files.map(file => ({ url: file.path, filename: file.filename })));

    await post.save();
    req.flash('success', 'Successfully updated post')
    res.redirect(`/posts/${post._id}`);
}

// Deletes post
module.exports.delete = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted post')
    res.redirect('/posts')
}