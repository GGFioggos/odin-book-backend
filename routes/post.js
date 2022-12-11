var express = require('express');
var router = express.Router();

const postController = require('../controllers/postController');

// PATH /POST

router.get('/:id', postController.get_post);

module.exports = router;
