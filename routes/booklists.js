let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var Booklist = require('../models/booklists');
var User = require('../models/users');


var mongodbUri ='mongodb://booklist:booklist777@ds247430.mlab.com:47430/seesawforwhat';

mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});



router.findUserBooklistAll = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Booklist.find({'booklistid': req.params.booklistid},function(err, booklists) {
        if (err)
            res.send(err);

        res.send(booklists,null,5);
    });
};


router.addBook = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    var booklist = new Booklist();

    booklist.username = req.body.username;
    booklist.booklistid = req.body.booklistid;
    booklist.bookname = req.body.bookname;
    booklist.author = req.body.author;


    booklist.save(function(err) {
        if (err)
            res.json({ message: 'Booklist NOT Added!', errmsg : err } );
        else

            res.json({ message: 'Booklist Successfully Added!', data: booklist });
    });
};


router.deleteBook = (req, res) => {                                                                      //delete record             delete

    Booklist.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.status(404);
            res.json({message: 'Book NOT DELETED!', errmsg: err});
        }else
            res.json({ message: 'Book Successfully Deleted!'});
    });
};



module.exports = router;
