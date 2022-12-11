const async = require('async');

const User = require('../models/User');

let users = [
    {
        id: 1,
        firstname: 'John',
        lastname: 'Smith',
        email: 'john@smoth@gmail.com',
    },
    {
        id: 2,
        firstname: 'Mpampis',
        lastname: 'sougias',
        email: 'sougias@gmail.com',
    },
];

exports.get_user = (req, res, next) => {
    res.json(users[req.params.id].firstname);
};
