var express = require('express');
var router = express.Router();

const { cookieJwtAuth } = require('../middleware/cookieJWTAuth');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// PATH /API/USER

router.get('/', cookieJwtAuth, userController.current_user);

router.get(
    '/feed',
    cookieJwtAuth,
    authController.refresh,
    userController.generate_feed
);

router.get('/:id/posts', userController.get_user_posts);

router.get('/:id', userController.get_user);

router.post('/:id/add', cookieJwtAuth, userController.send_friend_request);

router.post('/:id/remove', cookieJwtAuth, userController.remove_friend);

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
