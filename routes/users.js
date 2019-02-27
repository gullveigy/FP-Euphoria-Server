let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var Booklist = require('../models/booklists');
var Users = require('../models/users');


var mongodbUri ='mongodb://users:users777@ds247430.mlab.com:47430/seesawforwhat';
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


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

    var user = new Users();

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
