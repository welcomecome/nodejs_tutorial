const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};

exports.verifyToken = (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰 만료'
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰'
        });
    }
};

exports.apiLimiter = new RateLimit({
    windowMs: 60 * 1000,
    max: 10,
    handler(req, res) {
        res.status(this.statusCode).json({
            code: this.statusCode,
            message: '1분에 한 번만 요청 가능'
        });
    }
});

exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: '새로운 버전 나옴'
    });
};