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
const fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: `uploads/`, limits: {
        fileSize: 1024 * 1024 * 5
    }});

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
      result.password = undefined;
      var jwtToken = token.generateAccessToken(result);
      res.json({message: "Login Successful", token: jwtToken});
    }
  });
});

router.post("/register", cors(), function(req, res) {
  if(!req.body || !req.body.email || !req.body.password || !req.body.firstname || !req.body.lastname){
    res.status(401).json({message: "Incomplete data."});
    return;
  }

  if(!req.body.email.includes("@purdue.edu")){
    res.status(401).json({message: "Registration email has to be @purdue.edu"});
    return;
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
      res.status(401).json({message: error});
    } else {
      var payload = {email: req.body.email};
      var jwtToken = token.generateAccessToken(payload);
      res.json({message: "Login Successful", token: jwtToken});
    }
  });
});

router.post("/resendVerificationEmail", passport.authenticate(['jwt'], { session: false }), cors(), function(req,res){
  mongo.resendVerificationEmail(req.user, function(error, result){
    if(error) {
      res.status(401).json({message: error});
    } else {
      res.json({message: "Verification email resent successfully."});
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
        res.status(401).json({message: err})
      }
      else if (response){
        res.send(JSON.parse(JSON.stringify(response)));
      }
      else{
        res.status(401).json({message: "An error has occurred"});
      }
  });
});


router.post("/apply", upload.single('resume'), passport.authenticate(['jwt'], { session: false }), cors(), function(req, res){
  if (req.file) {
    if(!req.file.originalname.match(/\.(pdf)$/)) {
      res.status(401).json({message: 'Only PDF files are allowed.'});
      return;
    } else if(req.file.size > 1024 * 1024 * 5) { //files bigger than 5MBs
      res.status(401).json({message: 'Files cannot be bigger than 5MBs.'});
      return;
    }
  }

  const applicationData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    file: req.file,
    email: req.user.email,
    uid: req.body.uid,
    class_year: req.body.class_year,
    grad_year: req.body.grad_year,
    major: req.body.major,
    referral: req.body.referral,
    hackathon_count: req.body.hackathon_count,
    dietary_restrictions: req.body.dietary_restrictions,
    shirt_size: req.body.shirt_size,
    website: req.body.website,
    longanswer_1: req.body.longanswer_1,
    longanswer_2: req.body.longanswer_2,
    created_at: new Date(req.body.created_at) < Date.now() ? req.body.created_at : Date.now(),
    updated_at: Date.now(),
    status: "pending"
  }
  console.log('applicationData',applicationData);
  mongo.createOrUpdateApplication(req.user.email, applicationData, (err, response) => {
    if (err) {
      res.status(401).json({message: 'An error occurred', error: err});
    } else if (response.update) {
      res.send({message: 'Application successfully updated', response: response.result});
    } else if (response.insert) {
      res.send({message: 'Application successfully inserted', response: response.result});
    } else {
      res.status(401).json({message: 'An unknown error occurred'});
    }
  });
});

router.get('/announcements', function(req, res, next) {
  mongo.getAnnouncements(function(error, result) {
    if(error) {
      res.status(401).json({message:error});
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
