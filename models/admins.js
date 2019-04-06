let mongoose = require('mongoose');

let AdminSchema = new mongoose.Schema({
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

    { collection: 'admin' });
module.exports = mongoose.model('Admin', AdminSchema);
