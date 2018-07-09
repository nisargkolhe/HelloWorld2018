var express = require('express');
var request = require('request');
var mongoose = require('mongoose');
var mongo = require('../utils/mongoDBCalls');
var config = require('../config/config');
var token = require('../utils/token');
var cors = require('cors');
require('../config/passport');
var User = require('../models/user')
var router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

mongoose.connect(config.mongoDBHost);

router.post("/login", cors(), function(req, res) {
  if(req.body.email && req.body.password){
    var email = req.body.email;
    var password = req.body.password;
  }

  mongo.checkUserExists(req.body, true, function(error, result) {
    if(error) {
      res.status(401).json({message:error});
    } else {
      var payload = {email: result.email, verified: result.verified};
      var jwtToken = token.generateAccessToken(payload);
      res.json({message: "Login Successful", token: jwtToken});
    }
  });
});

router.post("/register", cors(), function(req, res) {
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
    verified: false,
    checkedin: false
  }

  mongo.addUser(user, function(error, result) {
    if(error) {
      res.status(401).json({message:"Error: " + error});
    } else {
      var payload = {email: req.body.email};
      var jwtToken = token.generateAccessToken(payload);
      res.json({message: "Login Successful", token: jwtToken});
    }
  });
});

router.post("/verify", cors(), function(req,res){
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

router.post("/resetPassword", cors(), function(req,res){
  if(!req.body.email){
    res.status(401).json({message: "No email provided."});
  }

  mongo.resetPassword(req.body.email, function(err, user) {
    if (err){
      res.status(401).json({message: err});
    } else {
      res.json({message: "Reset password link successfully sent."});
    }
  });
});

router.post("/confirmPassword", cors(), function(req,res){
  if(!req.body.password){
    res.status(401).json({message: "No password provided."});
  }

  if(!req.body.token){
    res.status(401).json({message: "No reset token provided."});
  }

  let password = bcrypt.hashSync(req.body.password, 10);

  mongo.confirmPassword(req.body.token, password, function(err, user) {
    if (err){
      res.status(401).json({message: err});
    } else {
      res.json({message: "Password successfully updated. You'll be redirected to login shortly..."});
    }
  });
});

router.get('/', passport.authenticate(['jwt'], { session: false }), function(req, res, next) {
  mongo.getUser(req.user._id, (err, response) => {
    if(err) {
      res.send({error: err})
    }
    else if(response) {
      res.send(JSON.parse(JSON.stringify(response)));
    } else {
      res.send("Error!");
    }
  });
});

router.get('/application', passport.authenticate(['jwt'], { session: false }), cors(), function(req, res){
  if (!req.user.email){
    res.status(401).json({message: "Need to pass a user id"});
  }
  mongo.retrieveUserApplication(req.user.email,(err, response) => {
      if (err){
        res.send({Error: err})
      }
      else if (response){
        res.send(JSON.parse(JSON.stringify(response)));
      }
      else{
        res.send("An error has occurred");
      }
  });
});


router.post("/apply", passport.authenticate(['jwt'], { session: false }), cors(), function(req, res){
console.log(req.body.firstName)
console.log("xd")

  const applicationData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    email: req.user.email,
    status: "open"
  }
  mongo.createOrUpdateApplication(req.user.email, applicationData, (err, response) => {
    if (err) {
      res.send({error: 'An error occurred', error: err});
    } else if (response.update) {
      res.send({message: 'Application successfully updated', response: response.result});
    } else if (response.insert) {
      res.send({message: 'Application successfully inserted', response: response.result});
    } else {
      res.send('An unknown error occurred');
    }
  });
});

module.exports = router;
