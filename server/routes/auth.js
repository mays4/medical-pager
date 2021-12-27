const express = require('express');

const { signup, login } = require('../controllers/auth.js');

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
console.log("+++++++++")
  // console.log("s", signup)

module.exports = router;