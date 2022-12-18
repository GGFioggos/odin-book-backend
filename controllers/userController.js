const async = require('async');
const { body, validationResult } = require('express-validator');
const faker = require('faker');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

exports.get_user = (req, res, next) => {
    User.findById(req.params.id)
        .populate('posts friends friendRequests')
        .exec(function (err, user) {
            if (err) {
                res.json({ error: err.message });
                return;
            }

            if (user == null) {
                res.json({ error: 'User not found' });
                return;
            }

            res.json(user);
        });
};
