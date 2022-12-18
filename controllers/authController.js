const { body, validationResult } = require('express-validator');
const faker = require('faker');
const bcrypt = require('bcryptjs');

exports.sign_up = [
    body('firstName')
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3, max: 25 })
        .withMessage('Name must not exceed 25 characters'),
    body('lastName')
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3, max: 25 })
        .withMessage('Last name must not exceed 25 characters'),
    body('email')
        .trim()
        .escape()
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .trim()
        .escape()
        .isLength({ min: 4, max: 25 })
        .withMessage('Password must not exceed 25 characters'),
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
    },
];
