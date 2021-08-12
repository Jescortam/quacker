const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const { validateId, validateBody, isLoggedIn, isAuthor } = require('../middleware');
const { postSchema } = require('../schemas');
const postController = require('../controllers/posts');
const Post = require('../models/posts');

router.route('/')
    .get(catchAsync(postController.index))
    .post(isLoggedIn, validateBody(postSchema), catchAsync(postController.create))

router.get('/new', isLoggedIn, postController.getCreate) 

router.route('/:id')
    .get(validateId, catchAsync(postController.show))
    .put(validateId, isLoggedIn, isAuthor(Post), validateBody(postSchema), catchAsync(postController.update))
    .delete(validateId, isLoggedIn, isAuthor(Post), catchAsync(postController.delete))

router.get('/:id/edit', validateId, isLoggedIn, isAuthor(Post), catchAsync(postController.getUpdate))

module.exports = router;