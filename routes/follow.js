let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var Follow = require('../models/follow');
var User = require('../models/users');


var mongodbUri ='mongodb://follow:follow777@ds247430.mlab.com:47430/seesawforwhat';
//mongodb://<dbuser>:<dbpassword>@ds247430.mlab.com:47430/seesawforwhat
mongoose.connect(mongodbUri);


let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});



router.findUserFollower = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Follow.find({'email': req.params.email},function(err, follows) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(follows,null,5));
    });
};



router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Follow.find({ "_id" : req.params.id },function(err, follow) {
        if (err)
            res.json({ message: 'Follow NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(follow,null,5));
    });
};




router.addFollower = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    var follow = new Follow();

    follow.email = req.body.email;
    follow.followername = req.body.followername;
    follow.followeremail = req.body.followeremail;



    follow.save(function(err) {
        if (err)
            res.json({ message: 'Follower NOT Added!', errmsg : err } );
        else

            res.json({ message: 'Follower Successfully Added!', data: follow });
    });
};



router.deleteFollow = (req, res) => {                                                                      //delete record             delete

    Follow.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.status(404);
            res.json({message: 'Follower NOT DELETED!', errmsg: err});
        }else
            res.json({ message: 'Follower Successfully Deleted!'});
    });
};




module.exports = router;
