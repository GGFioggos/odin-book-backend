require('dotenv').config();
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const { check, body, validationResult } = require('express-validator');
const User = require('../models/User');
const { response } = require('express');

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

module.exports = router;
