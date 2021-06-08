const express = require('express');
const axios = require('axios');

const router = express.Router();
const URL = 'http://localhost:8002/v2';
axios.defaults.headers.origin = 'http://localhost:4000';
const request = async (req, api) => {
    try {
        if (!req.session.jwt) {
            const tokenResult = await axios.post(`${URL}/token`, {
                clientSecret: process.env.CLIENT_SECRET
            });
            req.session.jwt = tokenResult.data.token; //세션에 토큰 저장
        }
        return await axios.get(`${URL}${api}`, {
            headers: { authorization: req.session.jwt },
        }); //API 요청
    } catch (err) {
        if (err.response.status === 419) {
            delete req.session.jwt;
            return request(req, api);
        }
        return err.response;
    }
};

router.get('/mypost', async (req, res, next) => {
    try {
        const result = await request(req, '/posts/my');
        res.json(result.data);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/search/:hashtag', async(req, res, next) => {
    try {
        const result = await request(
            req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`
        );
        res.json(result.data);
    } catch (err) {
        if (err.code) {
            console.error(err);
            next(err);
        }
    }
});

router.get('/', (req, res) => {
    res.render('main', { key: process.env.CLINET_SECRET });
});

// router.get('/test', async (req, res, next) => {
//     try {
//         if (!req.session.jwt) {
//             const tokenResult = await axios.post('http://localhost:8002/v1/token', {
//                 clientSecret: process.env.CLIENT_SECRET
//             });
//             if (tokenResult.data && tokenResult.data.code === 200) {
//                 req.session.jwt = tokenResult.data.token;
//             } else {
//                 return res.json(tokenResult.data);
//             }
//         }
//         const result = await axios.get('http://localhost:8002/v1/test', {
//             headers: { authorization: req.session.jwt },
//         });
//         return res.json(result.data);
//     } catch (err) {
//         console.error(err);
//         if (err.response.status === 419) {
//             return res.json(err.response.data);
//         }
//         return next(err);
//     }
// });

module.exports = router;