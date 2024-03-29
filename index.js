require('dotenv').config();
var cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
// var passport = require('passport');

// DB SETUP

var userRouter = require('./routes/user');
var postRouter = require('./routes/post');
var authRouter = require('./routes/auth');

var app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.authenticate('session'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/auth', authRouter);

module.exports = app;
