let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var Users = require('../models/users');
var fs = require("fs");
var formidable = require("formidable");
var path = require('path');

var mongodbUri ='mongodb://users:users777@ds247430.mlab.com:47430/seesawforwhat';
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});



router.findAllusers = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Users.find(function(err, users) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(users,null,5));
    });
};



router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Users.find({ "email" : req.params.email },function(err, user) {
        if (err)
            res.json({ message: 'User NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(user,null,5));
    });
};



router.findOneByname = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Users.find({ "username" : req.params.username },function(err, user) {
        if (err)
            res.json({ message: 'User NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(user,null,5));
    });
};


router.addUser = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    var user = new Users();

    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.usertype = req.body.usertype;
    user.signature = req.body.signature;

    user.save(function(err) {
        if (err)
            res.json({ message: 'User NOT Added!', errmsg : err } );
        else

            res.json({ message: 'User Successfully Added!', data: user });
    });
};


router.incrementFollow = (req, res) => {

    Users.findById(req.params.id, function(err,user) {
        if (err)
            res.json({ message: 'User NOT Found!', errmsg : err } );
        else {
            user.followers += 1;
            user.save(function (err) {
                if (err)
                    res.json({ message: 'User NOT Followed!', errmsg : err } );
                else
                    res.json({ message: 'User Successfully Followed!', data: user });
            });
        }
    });
};



router.reduceFollow = (req, res) => {

    Users.findById(req.params.id, function(err,user) {
        if (err)
            res.json({ message: 'User NOT Found!', errmsg : err } );
        else {
            user.followers -= 1;
            user.save(function (err) {
                if (err)
                    res.json({ message: 'User not cancel Followed!', errmsg : err } );
                else
                    res.json({ message: 'User Successfully cancel Followed!', data: user });
            });
        }
    });
};

router.uploadAvatarUrl = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname,'../public/images');
    form.keepExtensions = true;
    form.maxFieldSize = 1*1024*1024;
    form.parse(req, function(err, fields, files) {
        if(err) {
            res.json({ message: 'Upload fail!', errmsg : err } );
        }
        console.log('fields',fields); //表单传递的input数据
        console.log('files',files); //上传文件数据
        console.log('files.file.path', files.avatar.path)
        console.log( 'basepath', path.basename(files.avatar.path))


        if(!fields.id) {
            res.json({ message: 'No UserId!', errmsg : err } );
        }

        let conditions = {_id: fields.id};

        Users.findOne(conditions,function(err, user) {
            if(user.avatar) {
                fs.unlink('/images/' + user.avatar, ( result ) => {
                    console.log( result )
                });
            }
        });

        let updates = {$set: {avatar: path.basename(files.avatar.path)}};
        Users.findByIdAndUpdate(conditions,updates, {new: true}, function( error, data ){
            console.log( data )
            if (error) {
                console.error(error);
                res.json({ message: 'No UserId!', errmsg : error } );

            } else {
                console.error("Upload Successfully!")
                res.json({ message: 'Upload avatar success!', data: data });
            }
        });
    });

}

module.exports = router;
