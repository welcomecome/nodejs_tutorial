const express = require("express");
const router = express.Router();
const memberService = require("../service/memberService");

//get member list
router.get('/', memberService.getMember);
router.get('/:id', memberService.getMemberById);
router.get('/name/:name', memberService.getMemberByName);
router.post('/', memberService.Insert);
router.put('/:id', memberService.Update);
router.delete('/:id', memberService.Delete);

module.exports = router;

// module.exports = function(app, Member) {
    
//     //get member
//     app.get('/api/members/:id', function(req, res) {
//         Member.findOne({_id: req.params.id}, function(err, member) {
//             if (err) return res.status(500).json({error: err});
//             if (!member) return res.status(404).json({error: 'member not found'});
//             res.json(member);
//         })
//     });
    
//     //get member by userid
//     app.get('/api/members/userid/:userid', function(req, res) {
//         Member.find({userid: req.params.userid}, {_id: 0, userid: 1, name: 1}, function(err, members) {
//             if (err) return res.status(500).json({error: err});
//             if (members.length === 0) return res.status(404).json({error: 'member not found'});
//             res.json(members);
//         })
//     });
    
//     //create member
//     app.post('/api/members', function(req, res) {
//         var member = new Member();
//         member.userid = req.body.id;
//         member.name = req.body.name;
//         member.password = req.body.password;

//         member.save(function(err) {
//             if (err) {
//                 console.error(err);
//                 res.json({result: 0});
//                 return;
//             }
//             console.log('member created');
//             res.json({result: 1});
//         });
//     });
    
//     //update member
//     app.put('/api/members/:id', function(req, res) {
//         Member.findById(req.params.id, function(err, member) {
//             // --------------------------------------------------
//             // 데이터 먼저 찾고 save()하는 경우
//             // --------------------------------------------------
//             // if (err) return res.status(500).json({error: 'database failure'});
//             // if (!member) return res.status(404).json({error: 'member not found'});

//             // if (req.body.userid) member.userid = req.body.userid;
//             // if (req.body.name) member.name = req.body.name;
//             // if (req.body.password) member.password = SHA256(req.body.password);

//             // member.save(function(err) {
//             //     if (err) res.status(500).json({error: 'failed to update'});
//             //     res.json({message: 'member updated'});
//             // });

//             // --------------------------------------------------
//             // 조회 안 하고 바로 update()하는 경우
//             // --------------------------------------------------
//             Member.update({_id: req.params.id}, {$set: req.body}, function(err, output) {
//                 if (err) return res.status(500).json({error: 'database failure'});
//                 console.log(output);
//                 if (!output.n) return res.status(404).json({error: 'member not found'});
//                 console.log('member updated');
//                 res.json({message: 'member updated'});
//             })
//         });
//     });
    
//     //delete member
//     app.delete('/api/members/:id', function(req, res) {
//         Member.remove({_id: req.params.id}, function(err, output) {
//             if (err) return res.status(500).json({error: 'database failure'});
//             // --------------------------------------------------
//             // 삭제 확인해주는 코드
//             // --------------------------------------------------
//             // if (!output.result.n) return res.status(404).json({error: 'member not found'});
//             // res.json({message: 'member deleted'});
//             console.log('member deleted');
//             res.status(204).end();
//         })
//     });
// }