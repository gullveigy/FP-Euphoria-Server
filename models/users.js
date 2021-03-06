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
        signature: String,
        usertype: String,
        followers: {type: Number, default: 0},
        avatar: String
    },

    { collection: 'user' });
module.exports = mongoose.model('User', UserSchema);

