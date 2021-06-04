const express = require('express');
const bodyparser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

app.set('views', __dirname + '/views'); //서버가 읽을 수 있도록 HTML 위치 정의
//서버가 HTML 랜더링을 할 때, EJS 엔진을 사용하도록 설정
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', function(request, response) {
    response.render('index.html');
});

app.use(methodOverride('_method'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

var member = require('./api/member');
app.use('/member', member);

var server = app.listen(3000, function () {
    console.log('Express server has started on port 3000')
});