
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

function checkUserExists(jwt_payload, callback) {
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
            if(bcrypt.compareSync(jwt_payload.password, result.password)) {
              if(!result.verified){
                callback("Your account has not been verified.", null);
              }

              //Login successful
              callback(null, result);
            } else {
              callback("Incorrect Password or the user doesn’t exists.", false);
            }
          }

          db.close();
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
                }
                console.log('res', res);
                // Create a verification token for this user
                var token = new Token({ _userId: res.insertedId, token: crypto.randomBytes(16).toString('hex') });
         
                // Save the verification token
                token.save(function (err) {
                  if (err) { 
                    callback(err.message, null); 
                  } else {
                    console.log("TOKEN: "+token.token);
                    // TODO: Send the email

                    callback(null, user);
                  }
                });

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

module.exports = {
  connectToMongo : connectToMongo,
  checkUserExists : checkUserExists,
  addUser : addUser,
  getUser: getUser
}