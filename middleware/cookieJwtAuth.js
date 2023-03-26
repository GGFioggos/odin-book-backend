const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const { user } = jwt.verify(token, process.env.SECRET);
        User.findById(user._id)
            .populate('friendRequests')
            .exec(function (err, dbUser) {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                req.user = dbUser;
                next();
            });
    } catch (err) {
        return res.clearCookie('token').json({ error: 'User not authorized' });
    }
};
