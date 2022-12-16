var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

// PATH /USER

router.get('/:id', userController.get_user);

router.post('/create', userController.create_user);

module.exports = router;
