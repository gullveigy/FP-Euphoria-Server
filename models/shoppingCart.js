let mongoose = require('mongoose');

let ShoppingCartSchema = new mongoose.Schema({
        bookname: String,
        bookcover: String,
        authors: [String],
        price: String,
        num: {
            type: Number,
            default: 1
        },
        user_id: String
    },

    { collection: 'shoppingCart' });
module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);
