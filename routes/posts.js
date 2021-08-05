const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const { validateBody, isLoggedIn } = require('../middleware');
const { postSchema } = require('../schemas');
const postController = require('../controllers/posts');

router.route('/')
    .get(catchAsync(postController.index))
    .post(isLoggedIn, validateBody(postSchema), catchAsync(postController.create))

router.get('/new', isLoggedIn, postController.getCreate) 

router.route('/:id')
    .get(catchAsync(postController.show))
    .put(isLoggedIn, validateBody(postSchema), catchAsync(postController.update))
    .delete(isLoggedIn, catchAsync(postController.delete))

router.get('/:id/edit', isLoggedIn, catchAsync(postController.getUpdate))

module.exports = router;