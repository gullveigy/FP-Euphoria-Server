let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Order = require('../models/order');
let randomNumber = require('../utils/util.js')


let mongodbUri = 'mongodb://admins:admins777@ds247430.mlab.com:47430/seesawforwhat';
mongoose.connect(mongodbUri);
 

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


router.createOrder = (req, res) => {                                                                   //post record               post

    res.setHeader('Content-Type', 'application/json');

    let order = new Order();

    order.username = req.body.username;
    order.email = req.body.email;
    order.phone = req.body.phone;
    order.address = req.body.address;
    order.orderid = randomNumber();
    order.status = 0;
    order.userid = req.body.userid;
    order.bookList = req.body.bookList;

    order.save(function(err) {
        if (err)
            res.json({ message: 'order NOT Added!', errmsg : err } );
        else
            res.json({ message: 'order Successfully Added!', data: order });
    });
};

router.findUserOrderAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let pageSize = req.params.pageSize ? Number(req.params.pageSize) : 10;                   
    let currentPage = req.params.currentPage ? Number(req.params.currentPage) : 1;             
    let sort = {'createtime':-1};        
    let condition = {};                 
    let skipnum = (currentPage - 1) * pageSize;   
    if( req.params.username != 'undefined' ) {
        condition = {'userid': req.params.username }
    }

    Order.count(condition, (err, count) => {
        Order.find(condition).skip(skipnum)
        .limit(pageSize)
        .sort(sort)
        .exec(function (err, orderList) {
            if (err) {
                console.log("Error:" + err);
                res.json({ message: 'fail get orderlist!', errmsg : err } );
            } else {
                console.log("orderList:" + orderList);
                // orderList.send(JSON.stringify(orderList,null,5));
                res.json({message: 'success get orderlist', data: orderList, totalCount: count})
            }
        })       
    })
}

router.setOrderStatus = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let conditions = {_id: req.body.order_id}
    let updates   = {$set: {status: req.body.status}}; 

    Order.findByIdAndUpdate(conditions,updates, {new: true}, function( error, data ){
        if (error) {
            console.error(error);
            res.json({ message: 'Fail!', errmsg : error } );

        } else {
            res.json({ message: 'Success!', data: data });
        }          
    });  
}

router.fuzzySearch = (req, res) => {
    let pageSize = req.params.pageSize ? Number(req.params.pageSize) : 20;                 
    let currentPage = req.params.currentPage ? Number(req.params.currentPage) : 1;                
    let keyword = req.params.keyword ? req.params.keyword : ''
    let totalCount = 0
    let skipnum = (currentPage - 1) * pageSize;   

    let _filter={
        $or: [  
          {bookname: {$regex: keyword}},
          {username: {$regex: keyword, $options: '$i'}}, 
          {authors: {$regex: keyword, $options: '$i'}},
          {email: {$regex: keyword, $options: '$i'}},
          {phone: {$regex: keyword, $options: '$i'}}
        ]
      }


    Order.count(_filter, function (err, count) { 
        if (err) {
          console.log(err)
        } else {
            Order.find(_filter).limit(pageSize) 
            .sort({'_id': -1}) 
            .skip(skipnum)
            .exec(function (err, order) { 
                if (err) {
                    console.log(err)
                    res.json({ message: 'fail get orderlist!', errmsg : err } );
                } else {
                    res.json({message: 'Search success.', data: order, totalCount: count})
                }
            })
        }
    })


}



module.exports = router;




