const mongoose = require('mongoose');

const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    mongoose.connect('mongodb://사용자아이디:비밀번호@localhost:27017/admin', {
        dbName: 'nodejs',
        useNewUrlParser: true,
        useCreateIndex: true,
    }, (error) => {
        if (error) {
            console.log('connect error', error);
        } else {
            console.log('connect');
        }
    });
};
mongoose.connection.on('error', (error) => {
    console.error('error: ', error);
});
mongoose.connection.on('disconnected', () => {
    console.error('disconnected, retry');
    connect();
});

module.exports = connect;
