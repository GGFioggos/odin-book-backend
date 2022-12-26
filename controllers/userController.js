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

exports.send_friend_request = (req, res, next) => {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return res.json(err);
        }

        if (!user) {
            return res.json({ error: 'User not found' });
        }

        if (req.user._id == user._id) {
            return res.json({ error: 'cannot friend yourself' });
        }

        if (req.user.friends.includes(user)) {
            return res.json({ message: 'already friends' });
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
                    return res.json(err);
                }

                return res.json({ message: 'Friend request sent' });
            }
        );
    });
};

exports.accept_friend_request = (req, res, next) => {
    if (req.user.friends.includes(req.params.id)) {
        return res.json({ message: 'users are already friends' });
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
                    return res.json(err);
                }

                User.findByIdAndUpdate(
                    req.params.id,
                    {
                        $addToSet: { friends: req.user._id },
                        upsert: false,
                    },
                    function (err) {
                        if (err) {
                            return res.json(err);
                        }

                        return res.json({ message: 'Friend request accepted' });
                    }
                );
            }
        );
    } else {
        return res.json({ message: 'Friend request is no longer valid' });
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
                return res.json(err);
            }

            return res.json({ message: 'Friend request rejected' });
        }
    );
};
