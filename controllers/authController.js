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
        .optional({ checkFalsy: true })
        .trim()
        .isURL()
        .withMessage('Please enter a valid image URL'),
    body(
        'passwordConfirm',
        'Password confirm must have the same value as the password field.'
    )
        .exists()
        .custom((value, { req }) => value === req.body.password),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        // CHECK IF USER WITH THE SAME EMAIL EXISTS
        User.findOne({ email: req.body.email }, (error, user) => {
            if (error) {
                return res.status(500).json({ error });
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
    body('email', 'Email is required').trim().escape().isEmail(),
    body('password', 'Password is required').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        User.findOne({ email: req.body.email })
            .populate('friendRequests')
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

                            return res.cookie('token', token).status(200).json({
                                message: 'Log in success',
                                user: newUser,
                            });
                        } else {
                            return res
                                .status(403)
                                .json({ error: 'Incorrect password' });
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

exports.refresh = (req, res, next) => {
    const refreshToken = req.cookies.token;
    if (!refreshToken) {
        res.status(403).json({ error: err });
        next();
    }

    jwt.verify(refreshToken, process.env.SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: err });
            next();
        }

        const accessToken = jwt.sign(
            {
                user: decoded.user,
            },
            process.env.SECRET,
            { expiresIn: '15m' }
        );
        res.cookie('token', accessToken);
        next();
    });
};
