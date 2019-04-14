let express = require('express');
let router = express.Router();

router.pay = (req, res) => {                                                                   //post record               post
    res.setHeader('Content-Type', 'application/json');
	var stripe = require("stripe")("sk_test_k5dLcqoGUBsbzTLuGOC6vDvj00jXJzVdoE");
	const token = req.body.id;
	console.log(req.body);
	(async () => {
	const charge = await stripe.charges.create({
		amount: '100',
		currency: 'usd',
		description: 'BOOK charge',
		source: token,
		});
	})();
	res.json({ message: 'Pay successful!' } );
};


module.exports = router;

