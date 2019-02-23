let mongoose = require('mongoose');
let BooklistcommentSchema = new mongoose.Schema({
        username: String,
        booklistname: String,
        booklistid:String,
        comment:String,
        date:{type: Date, default:Date.now},
        upvotes:{type: Number, default: 0}


    },
    { collection: 'booklistcomment' });
module.exports = mongoose.model('Booklistcomment', BooklistcommentSchema);
