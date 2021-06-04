const Member = require("../models/member");
const {wrapE} = require("../util");

exports.getMember = wrapE(async(req, res, next) => {
    Member.find(function(err, members) {
        if (err) return res.status(500).send({error: "database failure"});
        res.json(members);
    })
})

exports.getMemberById = wrapE(async(req, res, next) => {
    Member.findOne({_id: req.params.id}, function(err, member) {
        if (err) return res.status(500).send({error: err});
        if (!member) return res.status(404).json({error: 'member not found'});
        res.json(member);
    })
})

exports.getMemberByName = wrapE(async(req, res, next) => {
    Member.find({name: req.params.name}, {_id: 0, userid: 1, name: 1}, function(err, members) {
        if (err) return res.status(500).send({error: err});
        if (members.length === 0) return res.status(404).json({error: 'member not found'});
        res.json(members);
    })
})

exports.Insert = wrapE(async(req, res, next) => {
    const {userid, name, password} = req.body;
    let user = await Member.findOne({"userid": userid}).lean();
    if (user) return res.status(500).send({message: `${userid}는 이미 존재하는 아이디입니다.`, error: true});
    
    const member = new Member({userid, name, password});
    await member.save(function(err) {
        if (err) return res.status(500).send({error: err});
        res.status(201).send({message: 'Insert success!', success: true});
    })
})

exports.Update = wrapE(async(req, res, next) => {
    Member.updateOne({_id: req.params.id}, {$set: req.body}, function(err, output) {
        if (err) return res.status(500).send({error: 'database failure'});
        console.log(output);
        if (!output.n) return res.status(404).json({error: 'member not found'});
        res.status(200).send({message: 'Update success!', success: true});
    });
})

exports.Delete = wrapE(async(req, res, next) => {
    Member.remove({_id: req.params.id}, function(err, output) {
        if (err) return res.status(500).send({error: 'database failure'});
        res.status(204).send({message: 'Delete success!', success: true});
    })
})