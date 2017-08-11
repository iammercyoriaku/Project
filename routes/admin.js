var express = require('express');
var router = express.Router();
var adminController = require('../controller/adminController.js');

/* GET home page. */
router.get("/", adminController.loginPage);
router.get("/login", adminController.loginPage);




module.exports = router;
