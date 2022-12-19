var express = require('express');
var router = express.Router();

const postController = require('../controllers/postController');
const { cookieJwtAuth } = require('../middleware/cookieJwtAuth');

// PATH /POST

router.post('/create', cookieJwtAuth, postController.create_post);

router.post('/:id/like', cookieJwtAuth, postController.like_post);

router.post('/:id/unlike', cookieJwtAuth, postController.unlike_post);

module.exports = router;
