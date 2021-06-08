const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.use(async (req, res, next) => {
    const domain = await Domain.findOne({
        where: { host: url.parse(req.get('origin')).host }
    });
    if (domain) {
        cors({
            origin: req.get('origin'),
            credentials: true
        })(req, res, next);
    } else {
        next();
    }
});

// -----------------------------------------
// 아래 두 코드는 같은 역할을 함
// router.use(cors()); 

// router.use((req, res, next) => {
//     cors()(req, res, next);
// });
// -----------------------------------------

router.post('/token', async (req, res) => {
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.findOne({
            where: { clientSecret },
            include: {
                model: User,
                attribute: ['nick', 'id']
            }
        });
        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인'
            });
        }
        const token = jwt.sign({
            id: domain.User.id,
            nick: domain.User.nick
        }, process.env.JWT_SECRET, {
            expiresIn: '30m', //1분
            issuer: 'nodebird'
        });
        return res.json({
            code: 200,
            message: '토큰 발급',
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: '서버 에러'
        });
    }
});

router.get('/test', verifyToken, apiLimiter, (req, res) => {
    res.json(req.decoded);
});

router.get('/posts/my', apiLimiter, verifyToken, (req, res) => {
    Post.findAll({ where: { userId: req.decoded.id } })
        .then((posts) => {
            console.log(posts);
            res.json({
                code: 200,
                payload: posts
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                code: 500,
                message: '서버 에러'
            });
        });
});

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, async (req, res) => {
    try {
        const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
        if (!hashtag) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과 없음'
            });
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: '서버 에러'
        });
    }
});

module.exports = router;