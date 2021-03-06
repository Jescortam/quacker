const express = require('express');
const router = express.Router();

const Post = require('../models/posts');
const { validateId, validateBody, isLoggedIn, isAuthor } = require('../middleware');
const { postSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const postController = require('../controllers/posts');

const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });

router.route('/')
    .get(
        catchAsync(postController.index))
    .post(
        isLoggedIn,
        upload.array('image'),
        validateBody(postSchema),
        catchAsync(postController.create))

router.get('/new',
        isLoggedIn,
        postController.getCreate)

router.route('/:id')
    .get(
        validateId,
        catchAsync(postController.show))
    .put(
        validateId,
        isLoggedIn,
        isAuthor(Post),
        upload.array('image'),
        validateBody(postSchema),
        catchAsync(postController.update))
    .delete(
        validateId,
        isLoggedIn,
        isAuthor(Post),
        catchAsync(postController.delete))

router.get('/:id/edit',
        validateId,
        isLoggedIn,
        isAuthor(Post),
        catchAsync(postController.getUpdate))

module.exports = router;