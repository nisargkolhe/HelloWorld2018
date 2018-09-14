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

router.post('/checkin', passport.authenticate(['jwt'], { session: false }), function(req, res, next) {
  var isExecOrAdmin = false;
  for (i in req.user.roles) {
    if (req.user.roles[i] == "exec" || req.user.roles[i] == "admin")
    {
      isExecOrAdmin = true;
    }
  }
  if (isExecOrAdmin == false){
    res.status(401).json({message: "Only execs and admins can access this page"});
  }

	mongo.checkCheckInStatus(req.body.email, function(error, result) {
    if(error) {
      res.status(401).json({message:error});
    } else {
      res.json({message: "Check In Successful"});
    }
	});
});

router.get('/checkin', passport.authenticate(['jwt'], { session: false }), function(req, res, next) {
  var isExecOrAdmin = false;
  for (i in req.user.roles) {
    if (req.user.roles[i] == "exec" || req.user.roles[i] == "admin")
    {
      isExecOrAdmin = true;
    }
  }
  if (isExecOrAdmin == false){
    res.status(401).json({message: "Only execs and admins can access this information"});
  }

  mongo.getCheckedInUsers(function(error, result) {
    if(error) {
      res.status(401).json({message:error});
    } else {
      res.json(result);
    }
  });
});

router.get('/applications', passport.authenticate(['jwt'], { session: false }), function(req, res){
  var isExecOrAdmin = false;
  for (i in req.user.roles) {
    if (req.user.roles[i] == "exec" || req.user.roles[i] == "admin")
    {
      isExecOrAdmin = true;
    }
  }
  if (isExecOrAdmin == false){
    res.status(401).json({message: "Only execs and admins can access this information"});
  }

  mongo.retrieveAllApplications((err, response) => {
    if (err){
      res.send({Error: err})
    }
    else if (response){
      res.send(response);
    }
    else{
      res.send("An error has occurred");
    }
});
});

router.post('/applications/:id', passport.authenticate(['jwt'], { session: false }), function(req,res){
  var isAdmin = false;
  for (i in req.user.roles) {
    if (req.user.roles[i] == "admin")
    {
      isAdmin = true;
    }
  }
  if (isAdmin == false){
    res.status(401).json({message: "Only admins can access this information"});
  }
  console.log(req.params.id);

  mongo.retrieveApplicationByID(req.params.id, function(error, application) {
    if(error) {
      res.status(401).json({message:error});
    } else {
      mongo.changeUserStatus(application.email, req.body.status, (err, response) => {
        if (err){
          res.send({Error: err})
        }
        else if (response){
          res.send(response);
        }
        else{
          res.send("An error has occurred");
        }
    });
    }
  });
});

router.get('/applications/status', passport.authenticate(['jwt'], { session: false }), function(req,res){
  var isAdmin = false;
  for (i in req.user.roles) {
    if (req.user.roles[i] == "admin")
    {
      isAdmin = true;
    }
  }
  if (isAdmin == false){
    res.status(401).json({message: "Only admins can access this information"});
  }
  mongo.retrieveOpenApplications((err, response) => {
    if (err){
      res.send({Error: err})
    }
    else if (response){
      res.send(response);
    }
    else{
      res.send("An error has occurred");
    }
});
});

router.post('/announcement', passport.authenticate(['jwt'], { session: false }), function(req, res, next) {
  var isExecOrAdmin = false;
  for (i in req.user.roles) {
    if (req.user.roles[i] == "exec" || req.user.roles[i] == "admin")
    {
      isExecOrAdmin = true;
    }
  }
  if (isExecOrAdmin == false){
    res.status(401).json({message: "Only execs and admins can access this page"});
  }

  let announcement = {
    ancm: req.body.ancm,
    title: req.body.title,
    badge: req.body.badge ? req.body.badge : "general",
    time: Date.now()
  }

  mongo.addAnnouncement(announcement, function(error, result) {
    if(error) {
      res.status(401).json({message:error});
    } else {
      res.json({message: "Announcement added!"});
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
