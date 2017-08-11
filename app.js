var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var handleBars = require('express-handlebars');
var passport = require('passport');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var moment = require('moment');
var Promise = global.Promise || require('promise');
var dotenv = require('dotenv');


var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express();

dotenv.load({ silent: true });

var DateFormats = {
    short: "DD MMMM - YYYY",
    long: "dddd DD.MM.YYYY HH:mm"
};

var hbs = handleBars.create({
    defaultLayout: 'main',
    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    partialsDir: [
        // 'shared/templates/',
        'views/partials/'
    ],
    helpers: {
        formatDate: function(datetime, format) {
            if (moment) {
                // can use other formats like 'lll' too
                format = DateFormats[format] || format;
                return moment(datetime).format(format);
            } else {
                return datetime;
            }
        },
        eachProperty: function(context, options) {
            var ret = "";
            for (var prop in context) {
                ret = ret + options.fn({ property: prop, value: context[prop] });
            }
            return ret;
        }
    }
});
// hbs.loadPartials(function(err, partials) {
//     // console.log(partials);
//     // => { 'foo.bar': [Function],
//     // =>    title: [Function] }
// });


// view engine setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', (path.join(__dirname + '/views')));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, '/public')));
app.set("port", process.env.PORT || 7777);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressValidator());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());


// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  console.log(err);
  res.json(err);
});


app.listen(app.get("port"), function() {
    console.log("server open at port " + app.get("port"));
});

module.exports = app;
