let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var Discussion = require('../models/discussions');
var User = require('../models/users');

var mongodbUri ='mongodb://discussions:discussions777@ds247430.mlab.com:47430/seesawforwhat';
//mongodb://<dbuser>:<dbpassword>@ds247430.mlab.com:47430/seesawforwhat
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


router.findAllDiscussions = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Discussion.find(function(err, discussions) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(discussions,null,5));
    });
};



router.findAllindateorder = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Discussion.find(function(err, discussions) {
        if (err)
            res.send(err);
        else {
            var list = discussions.sort(compare("date"));

            res.send(JSON.stringify(list, null, 5));
        }
    });
};



router.findAllinvotesorder = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Discussion.find(function(err, discussions) {
        if (err)
            res.send(err);
        else {
            var list = discussions.sort(compare("upvotes"));

            res.send(JSON.stringify(list, null, 5));
        }
    });
};



router.findBookDiscussionAll = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Discussion.find({'bookname': req.params.bookname},function(err, discussions) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(discussions,null,5));
    });
};

router.findBookDisindateorder = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Discussion.find({'bookname': req.params.bookname},function(err, discussions) {
        if (err)
            res.send(err);
        else {
            var list = discussions.sort(compare("date"));

            res.send(JSON.stringify(list, null, 5));
        }
    });
};




router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Discussion.find({ "_id" : req.params.id },function(err, discussion) {
        if (err)
            res.json({ message: 'Discussion NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(discussion,null,5));
    });
};



router.findUserDis = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Discussion.find({ "email" : req.params.email },function(err, discussion) {
        if (err)
            res.json({ message: 'Discussion NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(discussion,null,5));
    });
};


function getTotalVotes(array) {
    let totalVotes = 0;
    array.forEach(function(obj) { totalVotes += obj.upvotes; });
    return totalVotes;
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


router.fuzzysearchDiscussion = (req, res) => {                                                            //通过的description查找记录，fuzzysearch    get
    res.setHeader('Content-Type', 'application/json');
    //var keyword = {'description': {$regex:req.params.description, $options:'i'}};
    Discussion.find({'bookname':{$regex:req.params.bookname, $options:'i'}}, function(err,discussion) {
        if (discussion.length <= 0)
            res.json({Message: 'Sorry! Cannot find this discussion by this message!'});
        else
            res.send(JSON.stringify(discussion,null,5));
    });
};


router.findQueryindateorder = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Discussion.find({'content':{$regex:req.params.content, $options:'i'}},function(err, discussions) {
        if (err)
            res.send(err);
        else {
            var list = discussions.sort(compare("date"));

            res.send(JSON.stringify(list, null, 5));
        }
    });
};


router.findQueryinvotesorder = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Discussion.find({'content':{$regex:req.params.content, $options:'i'}},function(err, discussions) {
        if (err)
            res.send(err);
        else {
            var list = discussions.sort(compare("upvotes"));

            res.send(JSON.stringify(list, null, 5));
        }
    });
};


router.incrementUpvotes = (req, res) => {

    Discussion.findById(req.params.id, function(err,discussion) {
        if (err)
            res.json({ message: 'Discussion NOT Found!', errmsg : err } );
        else {
            discussion.upvotes += 1;
            discussion.save(function (err) {
                if (err)
                    res.json({ message: 'Discussion NOT UpVoted!', errmsg : err } );
                else
                    res.json({ message: 'Discussion Successfully Upvoted!', data: discussion });
            });
        }
    });
};


router.incrementCollection = (req, res) => {

    Discussion.findById(req.params.id, function(err,discussion) {
        if (err)
            res.json({ message: 'Discussion NOT Found!', errmsg : err } );
        else {
            discussion.collect += 1;
            discussion.save(function (err) {
                if (err)
                    res.json({ message: 'Discussion NOT Collected!', errmsg : err } );
                else
                    res.json({ message: 'Discussion Successfully Collected!', data: discussion });
            });
        }
    });
};


router.addDiscussion = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    var discussion = new Discussion();

    discussion.username = req.body.username;
    discussion.email = req.body.email;
    discussion.bookname = req.body.bookname;
    discussion.content = req.body.content;
    discussion.title = req.body.title;
    discussion.file = req.body.file;


    discussion.save(function(err) {
        if (err)
            res.json({ message: 'Discussion NOT Added!', errmsg : err } );
        else

            res.json({ message: 'Discussion Successfully Added!', data: discussion });
    });
};







router.deleteDiscussion = (req, res) => {                                                                      //delete record             delete

    Discussion.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.status(404);
            res.json({message: 'Discussion NOT DELETED!', errmsg: err});
        }else
            res.json({ message: 'Discussion Successfully Deleted!'});
    });
};



router.changeDiscussion = (req, res) => {                                                                //put 记录的description             put

    Discussion.findById(req.params.id, function(err,discussion) {
        if (err) {
            res.status(404);
            res.json({Message: 'Sorry! Cannot find the discussion by this id!'});
        }else {
            discussion.content = req.body.content;

            discussion.save(function ( ) {
                if (err)
                    res.json({ Message: 'Discussion NOT Changed!', errmsg: err});
                else
                    res.json({ Message: 'Discussion Successfully Changed!', data: discussion });
            });
        }
    });
};



module.exports = router;
