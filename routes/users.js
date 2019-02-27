let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var Booklist = require('../models/booklists');
var Users = require('../models/users');


router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Users.find({ "email" : req.params.email },function(err, user) {
        if (err)
            res.json({ message: 'User NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(user,null,5));
    });
};


router.addUser = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    var user = new User();

    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.usertype = req.body.usertype;




    user.save(function(err) {
        if (err)
            res.json({ message: 'User NOT Added!', errmsg : err } );
        else

            res.json({ message: 'User Successfully Added!', data: user });
    });
};





module.exports = router;
