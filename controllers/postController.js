const async = require('async');
const { body, validationResult } = require('express-validator');

const Post = require('../models/Post');
const User = require('../models/User');

exports.create_post = [
    body('content', 'Post content is required').trim().escape(),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json(errors);
        }

        User.findOne({ email: req.user.email }, (err, user) => {
            if (err) {
                return res.json(err);
            }

            const post = new Post({
                author: user,
                content: req.body.content,
                timestamp: Date.now(),
                comments: [],
                likes: [],
            }).save((err) => {
                if (err) {
                    return res.json(err);
                }

                return res.json({ message: 'Post created!' });
            });
        });
    },
];
