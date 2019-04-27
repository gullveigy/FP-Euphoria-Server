let mongoose = require('mongoose');
let FollowSchema = new mongoose.Schema({
        email: {type:String},
        followername: String,
        followeremail: String


    },
    { collection: 'follow' });
module.exports = mongoose.model('Follow', FollowSchema);
