let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
        },
        usertype: String,
        actions:{
            upvotefor:{type:String,default:""},
            comment:{
                commentfor:[],
                content:[]
            }
        }
    },

    { collection: 'user' });
module.exports = mongoose.model('User', UserSchema);
