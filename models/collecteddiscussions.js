let mongoose = require('mongoose');
let CollectedDiscussionSchema = new mongoose.Schema({
        collectemail: String,
        discussionid: String,
        author: String,
        title: String,
        bookname:String,
        content:String,
        email: String,
        file: String,
        date:{type: Date, default:Date.now},
        upvotes:{type: Number, default: 0},
        collect: {type: Number, default: 0}

    },
    { collection: 'collecteddiscussion' });
module.exports = mongoose.model('CollectedDiscussion', CollectedDiscussionSchema);
