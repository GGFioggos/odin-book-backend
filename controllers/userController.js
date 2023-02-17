const async = require('async');
const { body, validationResult } = require('express-validator');
const faker = require('faker');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Post = require('../models/Post');

exports.get_user = (req, res, next) => {
    User.findById(req.params.id)
        .populate('posts friends friendRequests')
        .exec(function (err, user) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (user == null) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json(user);
        });
};

exports.current_user = (req, res) => {
    const user = req.user;
    return res.json({ user });
};

exports.send_friend_request = (req, res, next) => {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.user._id == user._id) {
            return res.status(406).json({ error: 'Cannot friend yourself' });
        }

        if (req.user.friends.includes(user)) {
            return res.status(406).json({ message: 'Already friends' });
        }

        user.updateOne(
            {
                $addToSet: { friendRequests: req.user },
            },
            {
                upsert: false,
            },
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                return res.status(200).json({ message: 'Friend request sent' });
            }
        );
    });
};

exports.accept_friend_request = (req, res, next) => {
    if (req.user.friends.includes(req.params.id)) {
        return res.status(406).json({ message: 'Users are already friends' });
    }

    if (req.user.friendRequests.includes(req.params.id)) {
        User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: { friends: req.params.id },
                $pull: { friendRequests: req.params.id },
            },
            { upsert: false },
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                User.findByIdAndUpdate(
                    req.params.id,
                    {
                        $addToSet: { friends: req.user._id },
                        upsert: false,
                    },
                    function (err) {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        return res
                            .status(200)
                            .json({ message: 'Friend request accepted' });
                    }
                );
            }
        );
    } else {
        return res
            .status(404)
            .json({ message: 'Friend request is no longer valid' });
    }
};

exports.decline_friend_request = (req, res, next) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { friendRequests: req.params.id },
        },
        { upsert: false },
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            return res.status(200).json({ message: 'Friend request rejected' });
        }
    );
};

exports.generate_feed = async (req, res, next) => {
    const posts = await Post.find()
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
            },
        })
        .populate('author')
        .where('author')
        .in([...req.user.friends, req.user._id])
        .sort({
            timestamp: 'desc',
        });
    return res.json(posts);
};
