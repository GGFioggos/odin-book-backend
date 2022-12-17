require('dotenv').config();
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const { check, body, validationResult } = require('express-validator');
const User = require('../models/User');
const { nextDay } = require('date-fns');

// PATH /AUTH

router.post('/log-in', async (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email }, (err, user) => {
        if (err) {
            return next(err);
        }

        if (!user || !bcrypt.compare(user.password, password)) {
            res.json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ user }, process.env.SECRET, {
            expiresIn: '10m',
        });

        res.cookie('token', token);
        return res.json({
            message: 'Log in successfully',
        });
    });
});

module.exports = router;
