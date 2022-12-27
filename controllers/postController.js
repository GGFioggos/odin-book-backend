const async = require('async');
const { body, validationResult } = require('express-validator');

const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

// GET

exports.get_post = (req, res) => {
    Post.findById(req.params.id)
        .populate('author likes')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                component: 'User',
            },
        })
        .populate({
            path: 'comments',
            populate: {
                path: 'likes',
                component: 'User',
            },
        })

        .exec(function (err, post) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            return res.status(200).json(post);
        });
};

// POST

exports.create_post = [
    body('content', 'Post content is required').trim().escape(),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        new Post({
            author: req.user._id,
            content: req.body.content,
            timestamp: Date.now(),
            comments: [],
            likes: [],
        }).save((err, post) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            User.findByIdAndUpdate(
                req.user._id,
                {
                    $addToSet: { posts: post._id },
                },
                { upsert: false },
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    return res
                        .status(200)
                        .json({ message: 'Post created successfully' });
                }
            );
        });
    },
];

exports.delete_post = (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // CHECK IF THE USER IS THE AUTHOR
        if (post.author._id != req.user._id) {
            return res.status(401).json({
                message: 'No authorization to delete this post',
            });
        } else {
            // USER IS THE AUTHOR
            Post.findByIdAndDelete(req.params.id, (err, post) => {
                if (!post) {
                    return res.status(404).json({ error: 'Post not found' });
                }
                // DELETE FROM USER POSTS
                User.findByIdAndUpdate(
                    post.author,
                    {
                        $pull: { posts: post._id },
                    },
                    { upsert: false },
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                    }
                );

                // DELETE COMMENTS FROM COMMENTS DOCUMENT
                post.comments.forEach((comment) => {
                    Comment.findByIdAndDelete(comment, (err) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                    });
                });

                return res
                    .status(200)
                    .json({ message: 'Post deleted successfully' });
            });
        }
    });
};

exports.like_post = (req, res) => {
    Post.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: req.user } },
        { upsert: false },
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            return res.status(200).json({ message: 'Post liked successfully' });
        }
    );
};

exports.unlike_post = (req, res) => {
    Post.findByIdAndUpdate(
        req.params.id,
        { $pull: { likes: req.user._id } },
        function (err) {
            if (err) {
                return res.status(500).json(err);
            }

            return res
                .status(200)
                .json({ message: 'Post unliked successfully' });
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
                return res.status(500).json({ error: err.message });
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
                    return res.status(500).json({ error: err.message });
                }
            });

            comment.save((err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
            });

            return res
                .status(200)
                .json({ message: 'Comment successfully created' });
        });
    },
];

exports.delete_comment = (req, res) => {
    // REMOVE FROM POST
    Comment.findById(req.params.comment, (err, comment) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        Post.findByIdAndUpdate(
            req.params.id,
            { $pull: { comments: comment._id } },
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                return res
                    .status(200)
                    .json({ message: 'Comment deleted successfully' });
            }
        );
    });

    // REMOVE FROM COMMENTS
    Comment.findByIdAndDelete(req.params.comment, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
    });
};

exports.like_comment = (req, res) => {
    Comment.findByIdAndUpdate(
        req.params.comment,
        {
            $addToSet: { likes: req.user },
        },
        { upsert: false },
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            return res
                .status(200)
                .json({ message: 'Comment liked successfully' });
        }
    );
};

exports.unlike_comment = (req, res) => {
    Comment.findByIdAndUpdate(
        req.params.comment,
        {
            $pull: { likes: req.user._id },
        },
        { upsert: false },
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            return res
                .status(200)
                .json({ message: 'Comment unliked successfully' });
        }
    );
};
