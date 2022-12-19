const async = require('async');
const { body, validationResult } = require('express-validator');

const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

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

exports.like_post = (req, res) => {
    Post.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: req.user } },
        { upsert: false },
        function (err) {
            if (err) {
                return res.json(err);
            }

            return res.json({ message: 'Post liked successfully' });
        }
    );
};

exports.unlike_post = (req, res) => {
    Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user._id } },
        function (err) {
            if (err) {
                return res.json(err);
            }

            return res.json({ message: 'Post unliked successfully' });
        }
    );
};

exports.create_comment = [
    body('content', 'Comment content is required.').trim().escape(),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json(errors);
        }

        Post.findById(req.params.id, (err, post) => {
            if (err) {
                return res.json(err);
            }

            const comment = new Comment({
                author: req.user,
                content: req.body.content,
                timestamp: Date.now(),
                post: post,
                likes: [],
            });
            post.comments.push(comment);
            post.save((err) => {
                if (err) {
                    return res.json(err);
                }
            });

            comment.save((err) => {
                if (err) {
                    return res.json(err);
                }
            });

            return res.json({ message: 'Comment successfully created' });
        });
    },
];
