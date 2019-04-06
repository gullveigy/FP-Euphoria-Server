let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
var Contact = require('../models/contact');
var Admin = require('../models/admins');


var mongodbUri ='mongodb://contact:contact777@ds247430.mlab.com:47430/seesawforwhat';
//mongodb://<dbuser>:<dbpassword>@ds247430.mlab.com:47430/seesawforwhat
mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


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



router.findAllindateorder = (req, res) => {                                                                               //findall                 get
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Contact.find(function(err, contacts) {
        if (err)
            res.send(err);
        else {
            var list = contacts.sort(compare("date"));

            res.send(JSON.stringify(list, null, 5));
        }
    });
};




router.addContact = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    var contact = new Contact();

    contact.username = req.body.username;
    contact.email = req.body.email;
    contact.phonenumber = req.body.phonenumber;
    contact.title = req.body.title;
    contact.content = req.body.content;


    contact.save(function(err) {
        if (err)
            res.json({ message: 'Contact NOT Added!', errmsg : err } );
        else

            res.json({ message: 'Contact Successfully Added!', data: contact });
    });
};




module.exports = router;
