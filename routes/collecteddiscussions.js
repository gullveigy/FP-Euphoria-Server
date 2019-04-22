let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var CollectedDiscussion = require('../models/collecteddiscussions');
var User = require('../models/users');


var mongodbUri ='mongodb://collecteddiscussions:collecteddiscussions777@ds247430.mlab.com:47430/seesawforwhat';
//mongodb://<dbuser>:<dbpassword>@ds247430.mlab.com:47430/seesawforwhat
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});



router.findUserCollection = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    CollectedDiscussion.find({'collectemail': req.params.collectemail},function(err, collecteddiscussions) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(collecteddiscussions,null,5));
    });
};



router.addCollectedDiscussion = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    var collecteddiscussion = new CollectedDiscussion();

    collecteddiscussion.collectemail = req.body.collectemail;
    collecteddiscussion.discussionid = req.body.discussionid;
    collecteddiscussion.author = req.body.author;
    collecteddiscussion.email = req.body.email;
    collecteddiscussion.bookname = req.body.bookname;
    collecteddiscussion.content = req.body.content;
    collecteddiscussion.title = req.body.title;
    collecteddiscussion.file = req.body.file;


    collecteddiscussion.save(function(err) {
        if (err)
            res.json({ message: 'collecteddiscussion NOT Added!', errmsg : err } );
        else

            res.json({ message: 'collecteddiscussion Successfully Added!', data: collecteddiscussion });
    });
};



router.deleteCollectedDiscussion = (req, res) => {                                                                      //delete record             delete

    CollectedDiscussion.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.status(404);
            res.json({message: 'CollectedDiscussion NOT DELETED!', errmsg: err});
        }else
            res.json({ message: 'CollectedDiscussion Successfully Deleted!'});
    });
};



module.exports = router;
