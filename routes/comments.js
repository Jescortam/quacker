const express = require('express');
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utils/catchAsync');
const { validateCommentId, validateBody, isLoggedIn, isAuthor } = require('../middleware');
const { commentSchema } = require('../schemas');
const commentController = require('../controllers/comments');
const Comment = require('../models/comments');


router.post('/', isLoggedIn, validateBody(commentSchema), catchAsync(commentController.create))

router.delete('/:commentId', validateCommentId, isLoggedIn, isAuthor(Comment), catchAsync(commentController.delete))

module.exports = router;