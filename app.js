require('dotenv').config();
var cors = require('cors');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// DB SETUP
//require('./utils/mongoConfig');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var postRouter = require('./routes/post');

var app = express();

app.use(cookieParser());
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/post', postRouter);

module.exports = app;
