let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var Discomment = require('../models/discomments');
var User = require('../models/users');


var mongodbUri ='mongodb://discomments:discomments777@ds247430.mlab.com:47430/seesawforwhat';
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});



router.findDiscommentAll = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Discomment.find({ "discussionid" : req.params.discussionid },function(err, discomments) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(discomments,null,5));
    });
};


router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Discomment.find({ "_id" : req.params.id },function(err, discomment) {
        if (err)
            res.json({ message: 'Discomment NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(discomment,null,5));
    });
}


function compare(str) {
    return function(obj1, obj2) {
        var value2 = obj1[str];
        var value1 = obj2[str];
        if (value2 < value1) {
            return 1;
        } else if (value2 > value1) {
            return -1;
        } else {
            return 0;
        }
    }
}


router.findDiscommentsindateorder = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Discomment.find({"discussionid" : req.params.discussionid},function(err, discomments) {
        if (err)
            res.send(err);
        else {
            var list = discomments.sort(compare("date"));

            res.send(JSON.stringify(list, null, 5));
        }
    });
}



router.addDiscomment = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    var discomment = new Discomment();

    discomment.username = req.body.username;
    discomment.discussionid = req.body.discussionid;
    discomment.content = req.body.content;


    discomment.save(function(err) {
        if (err)
            res.json({ message: 'Discomment NOT Added!', errmsg : err } );
        else

            res.json({ message: 'Discomment Successfully Added!', data: discomment });
    });
};



router.incrementUpvotes = (req, res) => {

    Discomment.findById(req.params.id, function(err,discomment) {
        if (err)
            res.json({ message: 'Discomment NOT Found!', errmsg : err } );
        else {
            discomment.upvotes += 1;
            discomment.save(function (err) {
                if (err)
                    res.json({ message: 'Discomment NOT UpVoted!', errmsg : err } );
                else
                    res.json({ message: 'Discomment Successfully Upvoted!', data: discomment });
            });
        }
    });
}



router.incrementDownvotes = (req, res) => {

    Discomment.findById(req.params.id, function(err,discomment) {
        if (err)
            res.json({ message: 'Discomment NOT Found!', errmsg : err } );
        else {
            discomment.downvotes += 1;
            discomment.save(function (err) {
                if (err)
                    res.json({ message: 'Discomment NOT DownVoted!', errmsg : err } );
                else
                    res.json({ message: 'Discomment Successfully Downvoted!', data: discomment });
            });
        }
    });
};



router.deleteDiscomment = (req, res) => {                                                                      //delete record             delete

    Discomment.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.status(404);
            res.json({message: 'Discomment NOT DELETED!', errmsg: err});
        }else
            res.json({ message: 'Discomment Successfully Deleted!'});
    });
};






module.exports = router;

