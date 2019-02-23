let mongoose = require('mongoose');
let DiscussionSchema = new mongoose.Schema({
        username: String,
        bookname:String,
        content:String,
        date:{type: Date, default:Date.now},
        upvotes:{type: Number, default: 0}

    },
    { collection: 'discussion' });
module.exports = mongoose.model('Discussion', DiscussionSchema);
