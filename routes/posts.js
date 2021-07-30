const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const { validateBody } = require('../middleware');
const { postSchema } = require('../schemas');
const postController = require('../controllers/posts');

router.route('/')
    .get(catchAsync(postController.index))
    .post(validateBody(postSchema), catchAsync(postController.create))

router.get('/new', postController.getCreate) 

router.route('/:id')
    .get(catchAsync(postController.show))
    .put(validateBody(postSchema), catchAsync(postController.update))
    .delete(catchAsync(postController.delete))

router.get('/:id/edit', catchAsync(postController.getUpdate))

module.exports = router;