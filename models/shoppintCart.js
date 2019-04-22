let mongoose = require('mongoose');

let ShoppingCartSchema = new mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        usertype: String
    },

    { collection: 'shoppingCart' });
module.exports = mongoose.model('ShoppingCart', ShoppingCartSchema);
