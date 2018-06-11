
var MongoClient = require('mongodb').MongoClient
, assert = require('assert')
, ObjectId = require('mongodb').ObjectID
, token = require('./token')
, crypto = require('crypto');

var User = require('../models/user')
var Token = require('../models/token')

const config = require('../config/config');
const mongodbUrl = config.mongoDBHost;
const bcrypt = require('bcrypt');

function connectToMongo(callback) {
  MongoClient.connect(mongodbUrl, function(err, db) {
    if (err) {
      console.log("Error connecting to mongodb");
    } else {
      console.log("Connected successfully to database");
    }

    callback(err, true);
    db.close();
  });
}

function checkUserExists(jwt_payload, logging_in, callback) {
  if (!jwt_payload || !jwt_payload.email) {
    callback("No user found!", null);
  } else {
    MongoClient.connect(mongodbUrl, function (err, db) {
      if (err) {
        callback("We are currently facing some technically difficulties, please try again later!", null);
      } else {
        var dbo = db.db(config.mongoDBDatabase);
        dbo.collection("Users").findOne({'email' : jwt_payload.email}, function(err, result) {
          if (err) {
            callback("Incorrect Password or the user doesn’t exists.", null);
          } else {
            if(logging_in) {
              if(bcrypt.compareSync(jwt_payload.password, result.password)) {
                if(!result.verified){
                  callback("Your account has not been verified.", null);
                }

                //Login successful
                callback(null, result);
              } else {
                callback("Incorrect Password or the user doesn’t exists.", false);
              }
            } else {
              callback(null, result);
            }
          }
        });
      }
    });
  }
}

function addUser(user, callback) {
  if (!user) {
    callback("Error adding the user!", null);
  } else {
    MongoClient.connect(mongodbUrl, function (err, db) {
      if (err) {
        callback("We are currently facing some technically difficulties, please try again later!", null);
      } else {
        var dbo = db.db(config.mongoDBDatabase);
        dbo.collection("Users").findOne({'email' : user.email}, function(err, result) {
          if (err) {
            callback("Error adding the user! " + err.message, null);
          } else {
            if (result) {
              callback("The email address you have entered is already associated with another account.", null);
            } else  {
              dbo.collection("Users").insertOne(user, function(err, res) {
                if (err) {
                  console.log("Error inserting the user : " + user);
                  callback("Error inserting the user : " + user.email, null);
                } else {
                  console.log('res', res);
                  // Create a verification token for this user
                  var token = new Token({ _userId: res.insertedId, token: crypto.randomBytes(16).toString('hex') });
           
                  // Save the verification token
                  token.save(function (err) {
                    if (err) { 
                      callback(err.message, null); 
                    } else {
                      console.log("TOKEN URL: /confirmEmail?token="+token.token);
                      // TODO: Send the email

                      callback(null, user);
                    }
                  });
                }

                db.close();
              });
            }
          }
        });
      }
    });
  }
}

function getUser(user_id, callback) {
  if (!user_id) {
    callback("Error adding the user!", null);
  } else {
    MongoClient.connect(mongodbUrl, function (err, db) {
      if (err) {
        callback("We are currently facing some technically difficulties, please try again later!", null);
      } else {
        var dbo = db.db(config.mongoDBDatabase);
        dbo.collection("Users").findOne({'_id' : user_id}, function(err, result) {
          if (err) {
            callback("Error finding the user!", null);
          } else {
            if (result) {
              result.password = undefined;
              callback(null, result);
            } else  {
              callback("User does not exist!", null);
            }
          }
        });
      }
    });
  }
}

function verifyUser(verification_token, callback) {
  Token.findOne({ token: verification_token }, function (err, token) {
    if (!token) { 
      callback("We were unable to find a valid token. Your token may have expired.", null); 
    } else {
      // If we found a token, find a matching user
       MongoClient.connect(mongodbUrl, function (err, db) {
        if (err) {
          callback("We are currently facing some technically difficulties, please try again later!", null);
        } else {
          var dbo = db.db(config.mongoDBDatabase);
          dbo.collection("Users").findOne({'_id' : token._userId}, function(err, user) {
            if(err) {
              callback(err.message, null); 
            } else if (!user) { 
              console.log('user', user);
              callback("We were unable to find a user for this token.", null); 
            } else if (user.verified) {
              callback("This email is already verified.", null); 
            } else {
              // Verify and save the user
              dbo.collection("Users").update({'_id': token._userId}, {$set: {'verified': true}}, function(err, res){
                if (err) { 
                  callback(err.message, null); 
                } else {
                  //Success
                  callback(null, res);
                }
              });
            }
          });
        } 
      });
    }
  });
}

function resetPassword(email, callback) {
   MongoClient.connect(mongodbUrl, function (err, db) {
    if (err) {
      callback("We are currently facing some technically difficulties, please try again later!", null);
    } else {
      var dbo = db.db(config.mongoDBDatabase);
      dbo.collection("Users").findOne({'email' : email}, function(err, user) {
        if (err) {
          callback("Error finding the user! " + err.message, null);
        } else {
          if (!user) {
            callback("The email provided is not registered.", null);
          } else  {
            // Create a reset password token for this user
            var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
     
            // Save the verification token
            token.save(function (err) {
              if (err) { 
                callback(err.message, null); 
              } else {
                console.log("TOKEN URL: /resetPassword?token="+token.token);
                // TODO: Send the email

                callback(null, user);
              }
            });
          }

          db.close();
        }
      });
    }
  });
}

function confirmPassword(password_token, password, callback) {
  Token.findOne({ token: password_token }, function (err, token) {
    if (!token) { 
      callback("We were unable to find a valid token. Your token may have expired.", null); 
    } else {
      // If we found a token, find a matching user
       MongoClient.connect(mongodbUrl, function (err, db) {
        if (err) {
          callback("We are currently facing some technically difficulties, please try again later!", null);
        } else {
          var dbo = db.db(config.mongoDBDatabase);
          dbo.collection("Users").findOne({'_id' : token._userId}, function(err, user) {
            if(err) {
              callback(err.message, null); 
            } else if (!user) { 
              console.log('user', user);
              callback("We were unable to find a user for this token.", null); 
            } else {
              // Update user password
              dbo.collection("Users").update({'_id': token._userId}, {$set: {'password': password}}, function(err, res){
                if (err) { 
                  callback(err.message, null); 
                } else {
                  //Success
                  callback(null, res);
                }
              });
            }
          });
        } 
      });
    }
  });
}

module.exports = {
  connectToMongo : connectToMongo,
  checkUserExists : checkUserExists,
  addUser : addUser,
  getUser: getUser,
  verifyUser: verifyUser,
  resetPassword: resetPassword,
  confirmPassword: confirmPassword
}