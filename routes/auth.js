require('dotenv').config();
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');

const User = require('../models/User');

// PATH /AUTH

router.post('/log-in', async (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email }, (err, user) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.json({ error: 'User does not exist' });
        }

        bcrypt.compare(password, user.password, function (err, results) {
            if (err) {
                throw new Error(err);
            }

            if (results) {
                const token = jwt.sign({ user }, process.env.SECRET, {
                    expiresIn: '10m',
                });

                res.cookie('token', token, { httpOnly: true });
                return res.json({
                    message: 'Log in success',
                });
            } else {
                return res.json({ error: 'Passwords do not match' });
            }
        });
    });
});

router.post('/sign-up', authController.sign_up);

module.exports = router;
