const express = require('express');
const router = express.Router();

const User = require('../schemas/user');

router.get('/', async (req, res, next) => {
    try {
        const users = await User.find({});
        res.render('mongoose', {users});
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;