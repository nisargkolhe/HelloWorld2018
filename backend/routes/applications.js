var express = require('express');
var cors = require('cors');
require('../config/passport');
var mongo = require('../utils/mongoDBCalls');
var router = express.Router();
const passport = require('passport');

router.get('/status', passport.authenticate(['jwt'], { session: false }), function(req, res, next) {
  mongo.retrieveGlobals(function(error, result) {
    if(error) {
      res.status(401).json({message:error});
    } else {
      res.json({status: result.applicationStatus});
    }
	});
});

router.get('/:id', passport.authenticate(['jwt'], { session: false }), function(req,res){
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

  mongo.retrieveApplicationByID(req.params.id, (err, response) => {
      if (err){
        res.status(401).json({message:err});
      }
      else if (response){
        res.send(response);
      }
      else{
        res.status(401).json({message:'An error has occurred'});
      }
  });
});

module.exports = router;
