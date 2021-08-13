const ExpressError = require('./utils/ExpressError')
const Post = require('./models/posts');
const Comment = require('./models/comments')

module.exports.validateId = async (req, res, next) => {
    await Post.findById(req.params.id).catch((err) => {
        req.flash('error', 'Oops, post not found!');
        return res.redirect('/posts');
    })
    next();
}

module.exports.validateCommentId = async (req, res, next) => {
    const { id, commentId } = req.params;
    if (req.originalUrl.includes('/comments')) {
        await Comment.findById(commentId).catch((err) => {
            req.flash('error', 'Oops, comment not found!');
            return res.redirect(`/posts/${id}`);
        })
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = collection => {
    return async (req, res, next) => {
        const { id, commentId } = req.params;
        const doc = await collection.findById(commentId || id);
        if (!doc.author.equals(req.user._id)) {
            req.flash('error', 'You are not allowed to do that')
            return res.redirect(`/posts/${id}`);
        }
        next();
    }
}

module.exports.validateBody = schema => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errMsg = error.details.map(err => err.message).join(',') 
            next(new ExpressError(errMsg, 400));
        } else next();
    }
}