// Index
var express = require('express');
const router = express.Router();
module.exports = router;

const userController = require("../controllers/controller.user");
const navController = require("../controllers/controller.nav.js")
const passportService = require("../services/service.passport.js");
const permissionService = require("../services/service.permission.js");

router.get("/users", navController.setNav("users", true), passportService.isAuth, permissionService.authPerm(["user_read"]),userController.users_get);
router.get("/user/edit", navController.setNav("users", true), passportService.isAuth, permissionService.authPerm(["user_read"]),userController.user_get);
router.post("/user/edit", navController.setNav("users", true), passportService.isAuth, permissionService.authPerm(["user_read", "user_update"]), userController.user_post);
router.get("/user/delete", navController.setNav("users", true), passportService.isAuth, permissionService.authPerm(["user_read", "user_delete"]), userController.user_delete);
router.get("/user/chgpwd", navController.setNav("users", true), passportService.isAuth, permissionService.authPerm(["user_read", "user_update"]), userController.user_chgpwd_get);
router.post("/user/chgpwd", navController.setNav("users", true), passportService.isAuth, permissionService.authPerm(["user_read", "user_update"]), userController.user_chgpwd_post);
router.get("/adduser", navController.setNav("users", true), passportService.isAuth, permissionService.authPerm(["user_create", "user_read", "user_update"]), userController.user_add_get);
router.post("/adduser", navController.setNav("users", true), passportService.isAuth, permissionService.authPerm(["user_create", "user_read", "user_update"]), userController.user_add_post);
