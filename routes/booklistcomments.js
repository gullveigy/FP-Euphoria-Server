let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var Booklistcomment = require('../models/booklistcomments');
var User = require('../models/users');


var mongodbUri ='mongodb://booklistcomment:booklistcomment777@ds247430.mlab.com:47430/seesawforwhat';
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


router.findBooklistCommentAll = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Booklistcomment.find({'booklistid': req.params.booklistid},function(err, booklistcomments) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(booklistcomments,null,5));
    });
};


router.addComment = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    var booklistcomment = new Booklistcomment();

    booklistcomment.username = req.body.username;
    booklistcomment.booklistname = req.body.booklistname;
    booklistcomment.booklistid = req.body.booklistid;
    booklistcomment.comment = req.body.comment;


    booklistcomment.save(function(err) {
        if (err)
            res.json({ message: 'Booklistcomment NOT Added!', errmsg : err } );
        else

            res.json({ message: 'Booklistcomment Successfully Added!', data: booklistcomment });
    });
};



router.incrementUpvotes = (req, res) => {

    Booklistcomment.findById(req.params.id, function(err,booklistcomment) {
        if (err)
            res.json({ message: 'Booklistcomment NOT Found!', errmsg : err } );
        else {
            booklistcomment.upvotes += 1;
            booklistcomment.save(function (err) {
                if (err)
                    res.json({ message: 'Booklistcomment NOT UpVoted!', errmsg : err } );
                else
                    res.json({ message: 'Booklistcomment Successfully Upvoted!', data: booklistcomment });
            });
        }
    });
}




module.exports = router;
