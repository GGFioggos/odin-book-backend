require('dotenv').config();
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');

const User = require('../models/User');

// PATH /AUTH

router.post('/log-in', authController.log_in);

router.post('/sign-up', authController.sign_up);

module.exports = router;
