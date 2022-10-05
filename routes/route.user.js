// Index
var express = require('express');
const router = express.Router();
module.exports = router;

const userController = require("../controllers/controller.user");
const navController = require("../controllers/controller.nav.js")
const passportService = require("../services/service.passport.js");
const permissionService = require("../services/service.permission.js");




