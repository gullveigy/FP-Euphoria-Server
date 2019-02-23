let mongoose = require('mongoose');
let DiscommentSchema = new mongoose.Schema({
        username: String,
        discussionid: String,
        content:String,
        date:{type: Date, default:Date.now},
        upvotes:{type: Number, default: 0},
        downvotes:{type: Number, default: 0}

    },
    { collection: 'discomment' });
module.exports = mongoose.model('Discomment', DiscommentSchema);
