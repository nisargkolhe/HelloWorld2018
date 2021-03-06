var MongoClient = require('mongodb').MongoClient
, assert = require('assert')
, ObjectID = require('mongodb').ObjectID
, token = require('./token')
, crypto = require('crypto');

var User = require('../models/user')
var Token = require('../models/token')

const config = require('../config/config');
const mongodbUrl = config.mongoDBHost;
const bcrypt = require('bcrypt');

const webpush = require('web-push');

const vapidKeys = {"publicKey":"BE8kp7w24mEcUUtRlQwo9K-FvVrpX9sNQ9NUG-QliKf0wmA2cmM1Gl5szfGV30xt47MhQbUgQJL95wlntxaYwD0","privateKey":"Vrb_QpFCrcfhkPZyzY6wVgZNu3f6wBfHnoVMLCkfDUU"}

webpush.setVapidDetails(
    'mailto:noreply@helloworld.purduehackers.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

//For sending confirmation emails
var mailgun = require("mailgun-js");
var api_key = config.MAILGUN_KEY;
var DOMAIN = 'helloworld.purduehackers.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

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
              if(result && bcrypt.compareSync(jwt_payload.password, result.password)) {
                // if(!result.verified){
                //   callback("Your account has not been verified.", result);
                // }

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
                      let confirmEmailTemplate = require('../views/confirm_email').TEMPLATE;
                      confirmEmailTemplate = confirmEmailTemplate.replace("dummy", "#/confirmEmail?token="+token.token).replace("dummy", "#/confirmEmail?token="+token.token);
                      var data = {
                        from: 'Hello World 2018 <noreply@helloworld.purduehackers.com>',
                        to: user.email,
                        subject: 'Hi '+user.firstname+', please verify your Hello World account',
                        html: confirmEmailTemplate,
                        text: 'Email confirmation link: http://helloworld.purduehackers.com/#/confirmEmail?token='+token.token
                      };

                      mailgun.messages().send(data, function (error, body) {
                        console.log(body);
                      });

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

function resendVerificationEmail(user, callback) {
  let user_id = user._id;
  if (!user_id) {
    callback("No user id provided!", null);
  } else {
    MongoClient.connect(mongodbUrl, function (err, db) {
      if (err) {
        callback("We are currently facing some technically difficulties, please try again later!", null);
      } else {
        var dbo = db.db(config.mongoDBDatabase);
        dbo.collection("tokens").findOne({'_userId' : user_id}, function(err, result) {
          if (err) {
            callback("Error finding the user!", null);
          } else {
            if (result) {
              console.log("TOKEN URL: /confirmEmail?token="+result.token);
              let confirmEmailTemplate = require('../views/confirm_email').TEMPLATE;
              confirmEmailTemplate = confirmEmailTemplate.replace("dummy", "#/confirmEmail?token="+result.token).replace("dummy", "#/confirmEmail?token="+result.token);
              console.log(confirmEmailTemplate);
              var data = {
                from: 'Hello World 2018 <noreply@helloworld.purduehackers.com>',
                to: user.email,
                subject: 'Hi '+user.firstname+', please verify your Hello World account',
                html: confirmEmailTemplate,
                text: 'Email confirmation link: http://helloworld.purduehackers.com/#/confirmEmail?token='+result.token
              };

              mailgun.messages().send(data, function (error, body) {
                console.log(body);
              });

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

function getUser(user_id, callback) {
  if (!user_id) {
    callback("ID is needed to find user", null);
  } else {
    MongoClient.connect(mongodbUrl, function (err, db) {
      if (err) {
        callback("We are currently facing some technical difficulties, please try again later!", null);
      } else {
        var dbo = db.db(config.mongoDBDatabase);
        dbo.collection("Users").findOne({ _id : user_id}, function(err, result) {
          if (err) {
            callback("Error finding the user!", null);
          } else {
            if (result) {
              result.password = undefined;
              callback(null, result);
            } else  {
              console.log(result);
              callback("User does not exist!", null);
            }
          }
        });
      }
    });
  }
}

function getUserByOID(user_id, callback) {
  if (!user_id) {
    callback("ID is needed to find user", null);
  } else {
    MongoClient.connect(mongodbUrl, function (err, db) {
      if (err) {
        callback("We are currently facing some technical difficulties, please try again later!", null);
      } else {
        var dbo = db.db(config.mongoDBDatabase);
        dbo.collection("Users").findOne({ _id : ObjectID(user_id)}, function(err, result) {
          if (err) {
            callback("Error finding the user!", null);
          } else {
            if (result) {
              result.password = undefined;
              callback(null, result);
            } else  {
              console.log(result);
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
                console.log("TOKEN URL: /confirmPassword?token="+token.token);

                let confirmPwdTemplate = require('../views/confirm_password').TEMPLATE;
                confirmPwdTemplate = confirmPwdTemplate.replace("dummy", "#/confirmPassword?token="+token.token).replace("dummy", "#/confirmPassword?token="+token.token);
                var data = {
                  from: 'Hello World 2018 <noreply@helloworld.purduehackers.com>',
                  to: user.email,
                  subject: 'Hi '+user.firstname+', here\'s a link to reset your password',
                  html: confirmPwdTemplate,
                  text: 'Email confirmation link: http://helloworld.purduehackers.com/#/confirmPassword?token='+token.token
                };

                mailgun.messages().send(data, function (error, body) {
                  console.log(body);
                });

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

function checkCheckInStatus(user_email, callback) {
  //Email not provided
  if (!user_email) {
    callback("Error getting the user!", null);
  } else {
    MongoClient.connect(mongodbUrl, function (err, db) {
      //Connection error
      if (err) {
        callback("We are currently facing some technically difficulties, please try again later!", null);
      } else {
        var dbo = db.db(config.mongoDBDatabase);
        dbo.collection("Users").findOne({email : user_email}, function(err, result) {
          //User not found
          if (err) {
            callback("Error finding the user!", null);
          } else {
            if (result) {
              //User already checked in
              if (result.checkedin) {
                callback("User already checked in!", null);
              }
              else if (!result.verified) {
                callback("User not verified!", null);
              }
              //User not checked in
              else {
                //Update "check in" status
                dbo.collection("Users").update(
                  {email: user_email},
                  {
                    $set:
                    {checkedin: true}
                  }
                );
                callback("User successfully checked in!", null);
              }
            } else  {
              callback("User does not exist!", null);
            }
          }
        });
      }
    });
  }
}

function getCheckedInUsers(callback) {
  MongoClient.connect(mongodbUrl, function (err, db) {
    //Connection error
    if (err) {
      callback("We are currently facing some technically difficulties, please try again later!", null);
    } else {
      var dbo = db.db(config.mongoDBDatabase);
      dbo.collection("Users").find({'checkedin': true}).toArray(function(err, results) {
        if (err){
          callback("Error finding users!", null);
        } else {
          callback(null, results);
        }
      });
    }
  });
}

function createOrUpdateApplication(user_email, applicationData, callback){
  console.log("Email of user: " + user_email)
  console.log(applicationData)
  if (!user_email){
    callback("Invalid user!", null);
  } else{
  MongoClient.connect(mongodbUrl, function(err, db){
    if (err){
      callback("Error connecting", null);
    }
    else
    {
      var dbo = db.db(config.mongoDBDatabase);
      dbo.collection("Applications").findOne({'email': user_email}, function(err, application){
        console.log('ERROR', err, 'THE RESPONSE', application)
        if (err){
          console.log('an error occurred while looking up application', err);
          callback(err);
        } else if (application) {
          dbo.collection('Applications').updateOne({"email": user_email}, {$set: {
          "firstName": applicationData.firstName,
          "lastName": applicationData.lastName,
          "address": applicationData.address,
          "gender": applicationData.gender,
          "race": applicationData.race,
          "resume": applicationData.file,
          "uid": applicationData.uid,
          "class_year": applicationData.class_year,
          "grad_year": applicationData.grad_year,
          "major": applicationData.major,
          "referral": applicationData.referral,
          "hackathon_count": applicationData.hackathon_count,
          "dietary_restrictions": applicationData.dietary_restrictions,
          "shirt_size": applicationData.shirt_size,
          "website": applicationData.website,
          "longanswer_1": applicationData.longanswer_1,
          "longanswer_2": applicationData.longanswer_2,
          "created_at": applicationData.created_at,
          "updated_at": applicationData.updated_at
        }},(err, result) => {

            callback(null, {update: true, result});
          })
        } else {
          dbo.collection('Applications').insertOne(applicationData, (err, result) => {
            callback(null, {insert: true, result})
          })
        }
      });
    }
  });
  }
}


function retrieveUserApplication(user_email, callback){
  if (!user_email){
    callback("Invalid user!", null);
  }
  else{
    MongoClient.connect(mongodbUrl, function(err, db){
      if (err){
        callback("Error connecting to MongoDB", null)
      }
      else
      {
        var dbo = db.db(config.mongoDBDatabase);
        dbo.collection("Applications").findOne({"email": user_email}, function(err, application){
          if (err){
            console.log('An error occurred while finding application', err);
            callback(err);
          }
          else if (application){
            dbo.collection("Globals").findOne({}, function(err, Globals){
              if (err){
                console.log('An error occurred while retrieving the public status', err);
                callback(err, null);
              }
              else if (Globals){
                if (!Globals.applicationsPublic){
                  application.status = "pending";
                }

                console.log(application)
                callback(null, application);
              }
            });
          } else {
            callback("No application submitted yet.", null)
          }
        });
      }
    });
  }
}

function changeUserStatus(user_email, status, callback){
  if (!user_email){
    callback("Invalid user!", null);
  }
  else{
    MongoClient.connect(mongodbUrl, function(err, db){
      if (err){
        callback("Error connecting to MongoDB", null)
      }
      else
      {
        var dbo = db.db(config.mongoDBDatabase);
        dbo.collection("Applications").findOne({"email": user_email}, function(err,application){
          if (err){
            console.log('An error occurred while finding the application', err);
            callback(err);
          }
          else if (application){
            {
              dbo.collection('Applications').updateOne({"email": user_email}, {$set: {
              "status": status,
            }},(err, result) => {
                callback(null, {update: true, result});
              })
            }
          }
          else{
            callback("No application submitted yet.", null)
          }
        });
      }
    });
  }
}


function retrieveAllApplications(callback){
  MongoClient.connect(mongodbUrl, function(err,db){
    if (err){
      callback("Error connecting to MongoDB", null)
    }
    else{
      var dbo = db.db(config.mongoDBDatabase);
      dbo.collection("Applications").find().toArray(function(err, applications){
        if (err)
        {
          console.log('An error occurred getting the applications', err);
          callback(err);
        }
        else if (applications)
        {
          console.log(applications)
          callback(null, applications);
        }
      });
    }
  });
}

function retrieveApplicationByID(app_id, callback){
  console.log("inside retrieveApplicationByID");
  MongoClient.connect(mongodbUrl, function(err,db){
    if (err){
      console.log("error connecting");
      callback("Error connecting to MongoDB", null)
    }
    else{
      var dbo = db.db(config.mongoDBDatabase);
      dbo.collection("Applications").findOne({'_id': ObjectID(app_id)}, function(err, application){
        if (err) {
          console.log('An error occurred getting the application', err);
          callback(err, null);
        } else if (application) {
          console.log(application)
          callback(null, application);
        } else {
          console.log('An error occurred getting the application', err);
          callback(err, null);
        }
      });
    }
  });
}

function retrieveOpenApplications(callback){
MongoClient.connect(mongodbUrl, function(err, db){
  if (err)
  {
    callback("Error connecting to MongoDB", null)
  }
  else
  {
    var dbo = db.db(config.mongoDBDatabase);
    dbo.collection("Applications").find({"status" : "Pending"}).toArray(function(err,applications){
      if (err)
      {
        console.log('An error occurred getting the applications', err);
        callback(err);
      }
      else if (applications)
      {
          console.log(applications)
          callback(null, applications);
      }
    });
  }
});
}

function retrieveGlobals(callback){
  MongoClient.connect(mongodbUrl, function(err, db){
    if (err) {
      callback("Error connecting to MongoDB", null)
    } else {
      var dbo = db.db(config.mongoDBDatabase);
      dbo.collection("Globals").findOne({}, function(err, Globals){
        if (err) {
          console.log('An error occurred getting the globals', err);
          callback(err);
        } else if (Globals) {
            console.log(Globals)
            callback(null, Globals);
        }
      });
    }
  });
}

function setApplicationStatus(user_email, status, callback){
  MongoClient.connect(mongodbUrl, function(err, db){
    if (err)
    {
      callback("Error connecting to MongoDB", null)
    }
    else{
      var dbo = db.db(config.mongoDBDatabase);
      dbo.collection("Applications").findOne({"email": user_email}, function(err, application){
        if (err)
        {
          console.log('An error occurred while finding application', err);
          callback(err)
        }
        else if (application)
        {
          dbo.collection("Applications").update({"email": user_email}, {$set: {"status": status}}, function(err, res){
            if (err) {
              callback(err.message, null);
            } else {
              callback(null, res);
            }
          });
        }
      });
    }
  });
  }


function addAnnouncement(announcement, callback) {
  if (!announcement || !announcement.ancm) {
    callback("Error adding the announcement!", null);
  } else {
    MongoClient.connect(mongodbUrl, function (err, db) {
      if (err) {
        callback("We are currently facing some technically difficulties, please try again later!", null);
      } else {
        var dbo = db.db(config.mongoDBDatabase);
        if (err) {
          callback("Error adding the announcement! " + err.message, null);
        } else {
            dbo.collection("Announcements").insertOne(announcement, function(err, res) {
              if (err) {
                console.log("Error inserting the announcement: " + announcement);
                callback("Error inserting the announcement", null);
              } else {

                dbo.collection("Subscriptions").find().toArray(function(err, results) {
                  if (err){
                    callback("Error finding subscriptions!", null);
                  } else {
                    const allSubscriptions = results;
                    console.log('Total subscriptions', allSubscriptions.length);

                    const notificationPayload = {
                        "notification": {
                            "title": announcement.title,
                            "body": announcement.ancm,
                            "icon": "https://helloworld.purduehackers.com/assets/images/logo.png",
                            "vibrate": [100, 50, 100],
                            "data": {
                                "dateOfArrival": Date.now(),
                                "primaryKey": 1
                            },
                            "actions": [{
                                "action": "explore",
                                "title": "Go to the site"
                            }]
                        }
                    };

                    Promise.all(allSubscriptions.map(sub => webpush.sendNotification(
                        sub, JSON.stringify(notificationPayload) )))
                        .then(() => console.log("successfully sent notification"))
                        .catch(err => {
                            console.error("Error sending notification, reason: ", err);
                            //res.sendStatus(500);
                        });

                    callback(null, "Announcement added.");
                  }
                });

                // callback("Announcement added!", null);
              }
              db.close();
            });
        }
      }
    });
  }
}

function addSubscription(sub, callback) {
  if (!sub) {
    callback("Error adding the subscription!", null);
  } else {
    MongoClient.connect(mongodbUrl, function (err, db) {
      if (err) {
        callback("We are currently facing some technically difficulties, please try again later!", null);
      } else {
        var dbo = db.db(config.mongoDBDatabase);
        if (err) {
          callback("Error adding the subscription! " + err.message, null);
        } else {
            dbo.collection("Subscriptions").insertOne(sub, function(err, res) {
              if (err) {
                console.log("Error adding the subscription! " + sub);
                callback("Error adding the subscription!", null);
              } else {
                callback(null, "Subscription added!");
              }
              db.close();
            });
        }
      }
    });
  }
}

function getAnnouncements(callback) {
  MongoClient.connect(mongodbUrl, function (err, db) {
    //Connection error
    if (err) {
      callback("We are currently facing some technically difficulties, please try again later!", null);
    } else {
      var dbo = db.db(config.mongoDBDatabase);
      dbo.collection("Announcements").find().toArray(function(err, results) {
        if (err){
          callback("Error finding announcements!", null);
        } else {
          callback(null, results);
        }
      });
    }
  });
}

function getSubscriptions(callback) {
  MongoClient.connect(mongodbUrl, function (err, db) {
    //Connection error
    if (err) {
      callback("We are currently facing some technically difficulties, please try again later!", null);
    } else {
      var dbo = db.db(config.mongoDBDatabase);
      dbo.collection("Subscriptions").find().toArray(function(err, results) {
        if (err){
          callback("Error finding subscriptions!", null);
        } else {
          callback(null, results);
        }
      });
    }
  });
}
module.exports = {
  connectToMongo : connectToMongo,
  checkUserExists : checkUserExists,
  changeUserStatus : changeUserStatus,
  addUser : addUser,
  getUser: getUser,
  getUserByOID: getUserByOID,
  verifyUser: verifyUser,
  resetPassword: resetPassword,
  confirmPassword: confirmPassword,
  createOrUpdateApplication: createOrUpdateApplication,
  retrieveUserApplication : retrieveUserApplication,
  retrieveAllApplications: retrieveAllApplications,
  retrieveApplicationByID: retrieveApplicationByID,
  retrieveOpenApplications: retrieveOpenApplications,
  retrieveGlobals: retrieveGlobals,
  setApplicationStatus: setApplicationStatus,
  checkCheckInStatus: checkCheckInStatus,
  getCheckedInUsers: getCheckedInUsers,
  resendVerificationEmail: resendVerificationEmail,
  addAnnouncement: addAnnouncement,
  getAnnouncements: getAnnouncements,
  addSubscription:addSubscription,
  getSubscriptions: getSubscriptions,
}
