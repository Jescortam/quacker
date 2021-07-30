const express = require('express');
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utils/catchAsync');
const { validateBody } = require('../middleware');
const { commentSchema } = require('../schemas');
const commentController = require('../controllers/comments');

router.post('/', validateBody(commentSchema), catchAsync(commentController.create))

router.delete('/:commentId', catchAsync(commentController.delete))

module.exports = router;