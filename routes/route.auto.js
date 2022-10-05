var express = require('express');
const router = express.Router();
module.exports = router;


const indexController = require("../controllers/controller.index");
const adminController = require("../controllers/controller.admin");
const navController = require("../controllers/controller.nav.js")
const passportService = require("../services/service.passport.js");


// automation
router.get("/", navController.setNav("error", false), auto_get);



function  auto_get(req, res) {
    return res.render("./automation/autoix");
}