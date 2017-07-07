process.chdir(path.join(process.cwd(), '..'));
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//global.passport = passport;
var session = require('express-session');
var mongoose = require('mongoose');                         //add for Mongo support
var models = require('./models/models.js');
//mongoose schemas
if(process.env.DEV_ENV){
	mongoose.connect('mongodb://localhost/MylocalDB', {useMongoClient: false}); 
} else {
	mongoose.connect('mongodb://wangyj1989:wang890514yi@ds032340.mlab.com:32340/myweb', {useMongoClient: false});
	//mongoose.connection.openUri('mongodb://wang2510:Guo28199@ds032340.mlab.com:32340/myweb'); 
}
            //connect to Mongo

//import the routers


var index = require(path.join(__dirname, 'routes/index'));
var api = require(path.join(__dirname, 'routes/api'));
var authenticate = require(path.join(__dirname, 'routes/authenticate'))(passport);

//var index = require('./routes/index');
//var api = require('./routes/api');
//var authenticate = require('./routes/authenticate')(passport);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(session({
  secret: 'keyboard cat'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//register routers to root paths
app.use('/', index);
app.use('/api', api);
app.use('/auth', authenticate);

//// Initialize Passport
var initPassport = require('./passport-init');
initPassport(passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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