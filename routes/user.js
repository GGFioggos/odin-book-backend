const { nextDay } = require('date-fns');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const userController = require('../controllers/userController');
const User = require('../models/User');

// PATH /USER

router.get('/get', (req, res) => {
    const token = req.cookies.token;

    try {
        const user = jwt.verify(token, process.env.SECRET);
        req.user = user;
        res.json(user);
    } catch (err) {
        res.clearCookie('token');
        return console.log(err);
    }
});

router.get('/:id', userController.get_user);

router.post('/create', userController.create_user);

module.exports = router;
