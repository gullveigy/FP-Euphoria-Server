let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var Admins = require('../models/admins');


var mongodbUri ='mongodb://admins:admins777@ds247430.mlab.com:47430/seesawforwhat';
mongoose.connect(mongodbUri);


let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.addAdmin = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    var admin = new Admins();

    admin.username = req.body.username;
    admin.email = req.body.email;
    admin.password = req.body.password;
    admin.usertype = req.body.usertype;

    admin.save(function(err) {
        if (err)
            res.json({ message: 'Admin NOT Added!', errmsg : err } );
        else

            res.json({ message: 'Admin Successfully Added!', data: admin });
    });
};



router.findAlladmins = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Admins.find(function(err, admins) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(admins,null,5));
    });
};








module.exports = router;
