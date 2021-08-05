const express = require('express');
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utils/catchAsync');
const { validateBody, isLoggedIn } = require('../middleware');
const { commentSchema } = require('../schemas');
const commentController = require('../controllers/comments');

router.post('/', isLoggedIn, validateBody(commentSchema), catchAsync(commentController.create))

router.delete('/:commentId', isLoggedIn, catchAsync(commentController.delete))

module.exports = router;