let mongoose = require('mongoose');
let BooklistdirSchema = new mongoose.Schema({
        username: String,
        booklistname: String,
        date:{type: Date, default:Date.now},
        upvotes:{type: Number, default: 0}


    },
    { collection: 'booklistdir' });
module.exports = mongoose.model('Booklistdir', BooklistdirSchema);
