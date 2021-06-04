const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

dotenv.config();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const app = express();
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.raw());
app.use(bodyParser.text());

app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        morgan('combined')(req, res, next);
    } else {
        morgan('dev')(req, res, next);
    }
});
app.use(
    // express.static('/', path.join(__dirname, 'public')),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(process.env.COOKIE_SECRET),
    );
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

app.use('/', indexRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// try {
//     fs.readdirSync('uploads');
// } catch (error) { 
//     console.error('uploads 폴더가 없음. 폴더 생성함');
//     fs.mkdirSync('uploads');
// }
// const upload = multer({
//     storage: multer.diskStorage({
//         destination(req, file, done) {
//             done(null, 'uploads/');
//         },
//         filename(req, file, done) {
//             const ext = path.extname(file.originalname);
//             done(null, path.basename(file.originalname, ext) + Date.now() + ext);
//         }
//     }),
//     limits: { fileSize: 5 * 1024 * 1024 }
// });
// app.get('/upload', (req, res) => {
//     res.sendFile(path.join(__dirname, 'multipart.html'));
// });
// app.post('/upload', upload.fields([{ name: 'image1'}, { name: 'image2'}]), (req, res) => {
//     console.log(req.files, req.body);
//     res.send('ok');
// });

// app.use((req, res, next) => {
//     req.data = '데이터 넣기';
//     next();
// }, (req, res, next) => {
//     console.log(req.data); // 데이터 받기
//     next();
// });

// app.get('/', (req, res, next) => {
//     // res.send('Hello, Express');
//     // res.sendFile(path.join(__dirname, '/index.html'));
    
//     console.log('GET / 요청에 다 실행됨.');
//     next();
// }, (req, res) => {
//     throw new Error('에러는 에러 처리 미들웨어로 갑니다.');
// });

// app.post('/upload', upload.single('image'), (req, res) => {
//     console.log(req.file, req.body);
//     res.send('ok');
// });

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
})