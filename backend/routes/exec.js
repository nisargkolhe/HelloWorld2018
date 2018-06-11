var express = require('express');
var request = require('request');
var mongoose = require('mongoose');
var nev = require('email-verification')(mongoose);
var mongo = require('../utils/mongoDBCalls');
var config = require('../config/config');
var token = require('../utils/token');
require('../config/passport');
var User = require('../models/user')
var router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

mongoose.connect(config.mongoDBHost);

var myHasher = function(password, tempUserData, insertTempUser, callback) {
  var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  return insertTempUser(hash, tempUserData, callback);
};

nev.configure({
    verificationURL: 'http://helloworld.purduehackers.com/${URL}',
    persistentUserModel: User,
    passwordFieldName: 'password', 
    hashingFunction: myHasher
}, function(error, options){
  if(error)
    console.log(error);
});

router.post('/checkin', function(req, res, next) {
	mongo.checkCheckInStatus(req.body.email, function(error, result) {
	    if(error) {
	      //res.status(401).json({message:error});
        res.status(401).json({message:error});

	    } else {
	      var payload = {email: req.body.email};
	      var jwtToken = token.generateAccessToken(payload);
	      res.json({message: "Check In Successful", token: jwtToken});
	    }
  	});
});

module.exports = router;
