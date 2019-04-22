let mongoose = require('mongoose');

let OrderSchema = new mongoose.Schema({
        orderid: {
            type: Number,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        bookname: {
            type: String,
            required: true
        },
        bookcover: {
            type: String,
            required: true,
        },
        authors: [String],
        price: {
            type: String,
            required: true,
        },
        createtime: {
            type: Date,
            default: Date.now
        },
        address: {
            type: String,
            required: true,
        },
        status: {
            type: Number,
            required: true
        },              // order status 0:unfinish finished 
        userid: {
            type: String,
            required: true
        }
    },

    { collection: 'order' });
module.exports = mongoose.model('Order', OrderSchema);
