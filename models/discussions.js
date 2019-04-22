let mongoose = require('mongoose');
let DiscussionSchema = new mongoose.Schema({
        username: String,
        title: String,
        bookname:String,
        content:String,
        email: String,
        file: String,
        date:{type: Date, default:Date.now},
        upvotes:{type: Number, default: 0},
        collect: {type: Number, default: 0}


    },
    { collection: 'discussion' });
module.exports = mongoose.model('Discussion', DiscussionSchema);
