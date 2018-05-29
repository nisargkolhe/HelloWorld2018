var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({ 
    password: String, 
    email: String,
    password: String,
    firstname: String,
    lastname: String,
    roles: [],
    verified: Boolean
}));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
