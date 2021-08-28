const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const userController = require('../controllers/users');
const { validateBody } = require('../middleware');
const { userSchema } = require('../schemas');


router.route('/register')
    .get(
        userController.getRegister)
    .post(
        validateBody(userSchema),
        catchAsync(userController.register))

router.route('/login')
    .get(
        userController.getLogin)
    .post(
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true,
            successFlash: true
        }),
        catchAsync(userController.login))

router.get('/logout',
        userController.logout)

module.exports = router;