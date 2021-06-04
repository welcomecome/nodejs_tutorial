var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var memberSchema = new Schema({
    userid: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        // required: true
    }
});

module.exports = mongoose.model('member', memberSchema);

// SchemaType 종류
// 1. String
// 2. Number
// 3. Date
// 4. Buffer
// 5. Boolean
// 6. Mixed
// 7. Objectid
// 8. Array

//model을 사용하여 데이터를 DB에 저장하거나 조회할 수 있음
// var member = new Member({
//     name: '테스트',
//     password: '1234'
// });
// member.save(function(err, member) {
//     if (err) return console.error(err);
//     console.dir(member);
// })