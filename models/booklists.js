let mongoose = require('mongoose');
let BooklistSchema = new mongoose.Schema({
        username: String,
        booklistid: String,
        bookname:String,
        author:String,
        date:{type: Date, default:Date.now}
    },
    { collection: 'booklist' });
module.exports = mongoose.model('Booklist', BooklistSchema);
