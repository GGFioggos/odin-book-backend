const { nextDay } = require('date-fns');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const { cookieJwtAuth } = require('../middleware/cookieJWTAuth');

const userController = require('../controllers/userController');
const User = require('../models/User');

// PATH /USER

router.get('/:id', userController.get_user);

router.post('/:id/add', cookieJwtAuth, userController.send_friend_request);

router.post(
    '/request/:id/accept',
    cookieJwtAuth,
    userController.accept_friend_request
);

router.post(
    '/request/:id/decline',
    cookieJwtAuth,
    userController.decline_friend_request
);

module.exports = router;
