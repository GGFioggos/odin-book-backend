const async = require('async');

const Post = require('../models/Post');

exports.get_post = (req, res, next) => {
    res.json({ content: 'test post' });
};
