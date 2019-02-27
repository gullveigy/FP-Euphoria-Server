let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
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

    { collection: 'user' });
module.exports = mongoose.model('User', UserSchema);
