let mongoose = require('mongoose');
let ContactSchema = new mongoose.Schema({
        username: String,
        email: String,
        phonenumber:String,
        title: String,
        content:String,
        date:{type: Date, default:Date.now}

    },
    { collection: 'contact' });
module.exports = mongoose.model('Contact', ContactSchema);
