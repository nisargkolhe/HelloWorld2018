var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    id: String,
    email: String,
    firstname: String,
    lastname: String,
    username: String,
    roles: [String],
    verified: Boolean
});

var User = mongoose.model('User', userSchema);
module.exports = User;