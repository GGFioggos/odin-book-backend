const jwt = require('jsonwebtoken');

exports.cookieJwtAuth = (req, res, next) => {
    const token = req.cookies.token;

    try {
        const user = jwt.verify(token, process.env.SECRET);
        req.user = user;
        next();
    } catch (err) {
        res.clearCookie('token');
        return res.json({ error: 'User not authorized' });
    }
};
