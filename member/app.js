// [package]
const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").createServer(app);
const util = require("./util");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const memberController = require('./controller/memberController');

// [server port]
const PORT = process.env.PORT || 3000;
// {mongoDB Information}
const USER = 'samwoo';
const PWD = 'sws1234#';
const HOST = 'localhost:27017';
const DB = 'member';
const mongodbURL = `mongodb://${USER}:${PWD}@${HOST}:${DB}`;

const path_dist = path.join(__dirname, './view/');
const path_dist2 = path.join(__dirname, './view/index.html');

const main = async() => {

    // [mongoose]
    // connect mongoDB server
    await mongoose.connect(mongodbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log(`DB connection succesful :: ${util._date()}`))
    .catch((err) => console.error(`DB connection error :: ${util._date()}`))
    mongoose.set('useFindAndModify', false);

    // [use package]
    app.use(cookieParser());
    // express가 4.16버전부터 bodyparser 지원
    app.use(express.json());

    // static path and controller setting 
    app.use(express.static(path_dist));
    app.use('/api/members', memberController);

    // [error handler]
    app.use((error, req, res, next) => {
        console.log(`${util._date()} :: Error ${error}`);
        return res.status(500).send({success: false, message: error.message.replace(/"|\\/g, ''), error: true});
    });

    app.get('*', (req, res) => { 
        res.sendFile(path_dist2);
    });

    // [run server]
    http.listen(PORT, () => console.log(`Express server has started on port localhost:${PORT} :: ${util._date()}`));
}
main();