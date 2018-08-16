var express = require('express');
var cors = require('cors');
require('../config/passport');
var mongo = require('../utils/mongoDBCalls');
var router = express.Router();
const passport = require('passport');

router.get('/status', passport.authenticate(['jwt'], { session: false }), function(req, res, next) {
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

  mongo.retrieveGlobals(function(error, result) {
    if(error) {
      res.status(401).json({message:error});
    } else {
      res.json({status: result.applicationStatus});
    }
	});
});

module.exports = router;
