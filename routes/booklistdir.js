let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var Booklistdir = require('../models/booklistdir');
var User = require('../models/users');


var mongodbUri ='mongodb://booklistdir:booklistdir777@ds247430.mlab.com:47430/seesawforwhat';
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


router.findUserbooklistdirAll = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Booklistdir.find({'username': req.params.username},function(err, booklistdirs) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(booklistdirs,null,5));
    });
};



router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Booklistdir.find({ "_id" : req.params.id },function(err, booklistdir) {
        if (err)
            res.json({ message: 'Booklistdir NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(booklistdir,null,5));
    });
};



router.addBooklist = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    var booklistdir = new Booklistdir();

    booklistdir.username = req.body.username;
    booklistdir.booklistname = req.body.booklistname;
    booklistdir.commentnumber = req.body.commentnumber;



    booklistdir.save(function(err) {
        if (err)
            res.json({ message: 'Booklistdir NOT Added!', errmsg : err } );
        else

            res.json({ message: 'Booklistdir Successfully Added!', data: booklistdir });
    });
};



router.incrementUpvotes = (req, res) => {

    Booklistdir.findById(req.params.id, function(err,booklistdir) {
        if (err)
            res.json({ message: 'Booklistdir NOT Found!', errmsg : err } );
        else {
            booklistdir.upvotes += 1;
            booklistdir.save(function (err) {
                if (err)
                    res.json({ message: 'Booklistdir NOT UpVoted!', errmsg : err } );
                else
                    res.json({ message: 'Booklistdir Successfully Upvoted!', data: booklistdir });
            });
        }
    });
};


router.changeBooklistName = (req, res) => {                                                                //put 记录的description             put

    Booklistdir.findById(req.params.id, function(err,booklistdir) {
        if (err) {
            res.status(404);
            res.json({Message: 'Sorry! Cannot find the booklistdir by this id!'});
        }else {
            booklistdir.booklistname = req.body.booklistname;

            booklistdir.save(function ( ) {
                if (err)
                    res.json({ Message: 'Booklistdir NOT Changed!', errmsg: err});
                else
                    res.json({ Message: 'Booklistdir Successfully Changed!', data: booklistdir });
            });
        }
    });
};



router.deleteBooklist = (req, res) => {                                                                      //delete record             delete

    Booklistdir.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.status(404);
            res.json({message: 'Booklistdir NOT DELETED!', errmsg: err});
        }else
            res.json({ message: 'Booklistdir Successfully Deleted!'});
    });
};








module.exports = router;
