var express = require('express');
var router = express.Router();

const postController = require('../controllers/postController');
const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');

// PATH /POST

router.get('/:id', cookieJwtAuth, postController.get_post);

router.post('/create', cookieJwtAuth, postController.create_post);

router.post('/:id/delete', cookieJwtAuth, postController.delete_post);

router.post('/:id/like', cookieJwtAuth, postController.like_post);

router.post('/:id/unlike', cookieJwtAuth, postController.unlike_post);

router.post('/:id/comment', cookieJwtAuth, postController.create_comment);

router.post(
    '/:id/:comment/delete',
    cookieJwtAuth,
    postController.delete_comment
);

router.post('/:id/:comment/like', cookieJwtAuth, postController.like_comment);

router.post(
    '/:id/:comment/unlike',
    cookieJwtAuth,
    postController.unlike_comment
);

module.exports = router;
