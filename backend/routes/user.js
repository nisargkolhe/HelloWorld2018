var express = require('express');
var request = require('request');
var mongoose = require('mongoose');
var mongo = require('../utils/mongoDBCalls');
var config = require('../config/config');
var token = require('../utils/token');
require('../config/passport');
var User = require('../models/user')
var router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

mongoose.connect(config.mongoDBHost);

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
  if(!req.body || !req.body.email || !req.body.password || !req.body.firstname || !req.body.lastname){
    res.status(401).json({message: "Incomplete data."});
  }

  if(!req.body.email.includes("@purdue.edu")){
    res.status(401).json({message: "Registration email has to be @purdue.edu"});
  }

  let user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    verified: false
  }

  mongo.addUser(user, function(error, result) {
    if(error) {
      res.status(401).json({message:error});
    } else {
      var payload = {email: req.body.email};
      var jwtToken = token.generateAccessToken(payload);
      res.json({message: "Login Successful", token: jwtToken});
    }
  });
});

router.post("/verify", function(req,res){
  if(!req.body.token){
    res.status(401).json({message: "Invalid token."});
  }

  var token = req.body.token;

  mongo.verifyUser(token, function(err, user) {
      if (err){
        res.status(401).json({message: err});
      } else {
        // user was found!
        if (user) {
          res.json({message: "Email verified successful! You'll be redirected to login shortly..."});
        } else {
          res.json({message: "This URL is expired."});
        }
      }
  });
});

module.exports = router;
