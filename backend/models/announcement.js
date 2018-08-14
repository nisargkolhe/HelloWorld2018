var mongoose = require('mongoose');

var appSchema = new mongoose.Schema({
        ancm: String,
        time: String,
        date: String
});
    
var Announcement = mongoose.model('Announcement', appSchema);
module.exports = Announcement;