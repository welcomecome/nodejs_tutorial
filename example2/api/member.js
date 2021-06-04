const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', function(req, res) {
    fs.readFile(`data/member`, 'utf8', 
    function(err, member) {
        res.json({success:true, data:JSON.parse(member)});
    });
});

router.post('/', function(req, res) {
    const member = {
        id: req.body.id,
        name: req.body.name,
        password: req.body.password
    }
    fs.writeFile(`data/${member.name}`, JSON.stringify(member), 'utf8', 
    function(err) {
        res.json({success:true, data:member});
    });
});

router.put('/', function(req, res) {
    const member = {
        id: req.body.id,
        name: req.body.name,
        password: req.body.password
    }
    fs.writeFile(`data/${req.body.name}`, JSON.stringify(member), 'utf8', 
    function(err) {
        res.json({success:true, message:"success"});
    });
});

router.delete('/', function(req, res) {
    fs.unlink(`data/${req.body.name}`, function(err) {
        res.json({success:true, message:"success"});
      });
});

module.exports = router;