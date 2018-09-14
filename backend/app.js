var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongo = require('./utils/mongoDBCalls');

var routes = require('./routes/index');
var user = require('./routes/user');
var exec = require('./routes/exec');
var applications = require('./routes/applications');

const config = require('./config/config');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const token = require('./utils/token');

require('./config/passport');

var app = express(cors());

app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.options('*', cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/resumes',(function(req, res, next) {
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.send(200);
    return;
  } else {
    next();
  }
}));

app.use('/resumes', passport.authenticate(['jwt'], { session: false }), function(req, res, next) {
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
  next();
});
app.use('/resumes', express.static(path.join(__dirname, 'uploads')));

//app.use('/', routes);
app.use('/user', user);
app.use('/exec', exec);
app.use('/applications', applications);

app.post('/subscribe', function(req, res, next) {
  const sub = req.body;
  console.log('Received Subscription on the server: ', sub);
  mongo.addSubscription(sub, function(error, result) {
    if(error) {
      res.status(401).json({message:error});
    } else {
      res.status(200).json({message: "Subscription added!"});
    }
  });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
