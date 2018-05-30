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
    hashingFunction: myHasher, 
    tempUserCollection: 'tempUsers',
    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'myawesomeemail@gmail.com',
            pass: 'mysupersecretpassword'
        }
    },
    verifyMailOptions: {
        from: 'Do Not Reply <myawesomeemail_do_not_reply@gmail.com>',
        subject: 'Please confirm account',
        html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
        text: 'Please confirm your account by clicking the following link: ${URL}'
    }
}, function(error, options){
  if(error)
    console.log(error);
});

nev.generateTempUserModel(User, function(err, tempUserModel) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});

router.post("/login", function(req, res) {
  if(req.body.email && req.body.password){
    var email = req.body.email;
    var password = req.body.password;
  }

  mongo.checkUserExists(req.body, function(error, result) {
    if(error) {
      res.status(401).json({message:error});
    } else {
      var payload = {email: req.body.email};
      var jwtToken = token.generateAccessToken(payload);
      res.json({message: "Login Successful", token: jwtToken});
    }
  });
});

router.post("/register", function(req, res) {
  if(!req.body.email || !req.body.password){
    res.status(401).json({message: "Email or password was not provided."});
  }

  if(!req.body.email.includes("@purdue.edu")){
    res.status(401).json({message: "Registration email has to be @purdue.edu"});
  }

  var newUser = User({
    email: req.body.email,
    password: req.body.password
  });

  nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
    if (err)
      res.status(401).json({message: "Error in registration! " + err});

    // user already exists in persistent collection...
    if (existingPersistentUser)
        res.status(401).json({message: "Email is already registered."});

    // a new user
    if (newTempUser) {
      var URL = newTempUser[nev.options.URLFieldName];
      nev.sendVerificationEmail(email, URL, function(err, info) {
          if (err){
            res.status(401).json({message: "Error in sending verification email! " + err});
          }

          res.json({message: "Registration successful! Lookout for a verification email to login."});
      });
    } else {
      res.status(401).json({message: "Email is already registered but not verified. Try re-sending verification email."});
    }
  });
});

router.post("/verify", function(req,res){
  if(!req.body.url){
    res.status(401).json({message: "Invalid URL."});
  }

  var url = req.body.url;

  nev.confirmTempUser(url, function(err, user) {
      if (err)
        res.status(401).json({message: "Invalid URL."});

      // user was found!
      if (user) {
        res.json({message: "Email verified successful! You'll be redirected to login shortly..."});
      } else {
        res.json({message: "This URL is expired."});
      }
  });
});

module.exports = router;
