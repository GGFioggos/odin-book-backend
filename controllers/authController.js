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
            return res.status(400).json({ error: errors.array() });
        }
        // CHECK IF USER WITH THE SAME EMAIL EXISTS
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
                return res.status(500).json(err);
            }
            // USER EXISTS
            if (user) {
                return res.status(400).json({
                    error: 'A user with the same email already exists',
                });
            } else {
                // USER DOES NOT EXIST
                bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
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
                            return res.status(500).json({ error: err.message });
                        }
                        return res.status(200).json({ message: 'Success' });
                    });
                });
            }
        });
    },
];

exports.log_in = [
    // const { email, password } = req.body;
    body('email', 'Email is required').trim().escape().isEmail(),
    body('password', 'Password is required').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        User.findOne({ email: req.body.email })
            .select('+password')
            .exec(function (err, user) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                if (!user) {
                    return res
                        .status(404)
                        .json({ error: 'User does not exist' });
                }

                bcrypt.compare(
                    req.body.password,
                    user.password,
                    function (err, results) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        if (results) {
                            const token = jwt.sign(
                                { user },
                                process.env.SECRET,
                                {
                                    expiresIn: '10m',
                                }
                            );

                            // remove password from response
                            const newUser = user.toObject();
                            delete newUser.password;

                            return res
                                .cookie('token', token, {
                                    expiresIn: '10m',
                                })
                                .status(200)
                                .json({
                                    message: 'Log in success',
                                    user: newUser,
                                });
                        } else {
                            return res
                                .status(403)
                                .json({ error: 'Passwords do not match' });
                        }
                    }
                );
            });
    },
];

exports.log_out = (req, res) => {
    res.status(200).clearCookie('token');
    res.end();
};
