let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let ShoppingCar = require('../models/shoppingCart.js');


let mongodbUri = 'mongodb://admins:admins777@ds247430.mlab.com:47430/seesawforwhat';
mongoose.connect(mongodbUri);
 

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


router.addShoppingCar= (req, res) => {
	res.setHeader('Content-Type', 'application/json');

	let shopping = new ShoppingCar()
	    shopping.bookname = req.body.bookname;
	    shopping.bookcover = req.body.bookcover;
	    shopping.authors = req.body.authors;
	    shopping.price = req.body.price;
	    shopping.user_id = req.body.userid

	shopping.save(function(err) {
        if (err)
            res.json({ message: 'shopping NOT Added!', errmsg : err } );
        else
            res.json({ message: 'shopping Successfully Added!', data: shopping });
    });
}

router.shoppingCartList = (req, res) => {
	res.setHeader('Content-Type', 'application/json');

	let condition = {'user_id': req.params.id }
	ShoppingCar.find(condition, (err, shopping) => {
		if (err)
            res.json({ message: 'ShoppingCar NOT Found!', errmsg : err } );
        else
            res.json({ message: 'Get ShoppingCar Success!', data: shopping });
	})
}


router.removeShopping = (req, res) => {

	res.setHeader('Content-Type', 'application/json');

	let id = req.body.id
	let wherestr = { _id: { $in: id } }

    ShoppingCar.remove(wherestr, function(err, data){
        if (err) {
            console.log("Error:" + err);
        }
        else {
            res.json({ message: 'shopping Successfully Remove!' });
        }
    })
}

module.exports = router;









