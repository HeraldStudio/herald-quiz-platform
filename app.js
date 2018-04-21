const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');        // POST data parser
const logger = require('morgan');
const session = require('express-session');       // express session
// config file
const config = require('config-lite')(__dirname); // config parser
// flash middleware
const flash = require('connect-flash');           // flush

// router
var router = require('./routes/router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
  name: config.session.key,        // session-id name
  secret: config.session.secret,   // secret-hash
  resave: true,                    // force to fresh session id
  saveUninitialized: false,        // force to create session id, even if user not logged in
  cookie: {
    maxAge: config.session.maxAge
  }
}));

// flash middleware
app.use(flash());

// app template variables
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.info = req.flash('info').toString();
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

// post body parser
app.use(bodyParser.urlencoded({extended: false}));

// router
router(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
