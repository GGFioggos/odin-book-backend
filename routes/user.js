const { nextDay } = require('date-fns');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const { cookieJwtAuth } = require('../middleware/cookieJWTAuth');

const userController = require('../controllers/userController');
const User = require('../models/User');

// PATH /USER

router.get('/get', cookieJwtAuth, (req, res) => {
    res.json({ message: 'authenticated', user: req.user });
});

router.get('/:id', userController.get_user);

module.exports = router;
