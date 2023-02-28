const jwt = require('jsonwebtoken');

exports.cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const { user } = jwt.verify(token, process.env.SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.clearCookie('token').json({ error: 'User not authorized' });
    }
};
