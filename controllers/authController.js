const { body, validationResult } = require('express-validator');
const faker = require('faker');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.sign_up = [
    body('firstName', 'First name is required')
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3, max: 25 }),
    body('lastName', 'Last name required')
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3, max: 25 }),
    body('email', 'Email required')
        .trim()
        .escape()
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password', 'Password required')
        .trim()
        .escape()
        .isLength({ min: 4, max: 25 }),
    body('profilePictureUrl')
        .optional()
        .trim()
        .isURL()
        .withMessage('Please enter a valid image URL'),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json({ error: errors.array() });
        }
        // CHECK IF USER WITH THE SAME EMAIL EXISTS
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
                return res.json(err);
            }
            // USER EXISTS
            if (user) {
                return res.json({
                    error: 'A user with the same email already exists',
                });
            } else {
                // USER DOES NOT EXIST
                bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                    if (err) {
                        return next(err);
                    }
                    const user = new User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: hashedPassword,
                        profilePictureUrl: req.body.profilePictureUrl
                            ? req.body.profilePictureUrl
                            : faker.image.imageUrl(),
                    }).save((err) => {
                        if (err) {
                            return next(err);
                        }
                        return res.json({ message: 'Success' });
                    });
                });
            }
        });
    },
];

exports.log_in = async (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email })
        .select('+password')
        .exec(function (err, user) {
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
                        expiresIn: '30m',
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
};
exports.log_out = (req, res) => {};
