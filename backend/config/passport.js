var passport = require('passport');
var jwt = require('jsonwebtoken');
var passportJWT = require('passport-jwt');
var _ = require("lodash");
var mongo = require('../utils/mongoDBCalls');

var mongoose = require('mongoose');
const userSchema = require('./../models/user');

const config = require('./config')

// Use connect method to connect to the server
mongo.connectToMongo(function(error, response) {
  if (!error) {
    console.log("connected: " + response);
  }
});

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = config.JWT_SECRET;
jwtOptions.issuer = config.JWT_ISSUER;
jwtOptions.audience = config.JWT_AUDIENCE;

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  mongo.checkUserExists(jwt_payload, function(error, result) {
    next(error, result);
  });
});

passport.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});