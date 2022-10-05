// Index
var express = require('express');
const router = express.Router();
module.exports = router;

const indexController = require("../controllers/controller.index");
const adminController = require("../controllers/controller.admin");
const navController = require("../controllers/controller.nav.js")
const userController  = require("../controllers/controller.user.js");

const passportService = require("../services/service.passport.js");


// not auth
router.get("/", navController.setNav("home", false), passportService.isNotAuth, indexController.index_get);
router.get("/login", navController.setNav("login", false), passportService.isNotAuth, indexController.login_get);
router.get("/about", navController.setNav("about", false), passportService.isNotAuth, indexController.about_get);
router.get("/error", navController.setNav("error", false), indexController.error_get);

// user
router.get("/signup", navController.setNav("register", false), passportService.isNotAuth, userController.signup_get);
router.post("/signup", navController.setNav("register", false), passportService.isNotAuth, userController.signup_post);
router.get("/resetpwd", navController.setNav("login", false), passportService.isNotAuth, userController.resetpwd_get);
router.post("/resetpwd", navController.setNav("login", false), passportService.isNotAuth, userController.resetpwd_post);
router.get("/setpwd", navController.setNav("login", false), passportService.isNotAuth, userController.setpwd_get);
router.post("/setpwd", navController.setNav("login", false), passportService.isNotAuth, userController.setpwd_post);

// auth
router.get("/dashboard", navController.setNav("dashboard", true), passportService.isAuth, adminController.dashboard_get);
router.get("/profile", navController.setNav("profile", true), passportService.isAuth, userController.profile_get);
router.post("/profile", navController.setNav("profile", true), passportService.isAuth, userController.profile_post);
router.get("/profile/chgpwd", navController.setNav("profile", true), passportService.isAuth, userController.profile_chgpwd_get);
router.post("/profile/chgpwd", navController.setNav("profile", true), passportService.isAuth, userController.profile_chgpwd_post);

// LOGOUT (using: _method)
router.delete('/logout', indexController.logout)
router.get('/logout', indexController.logout)


