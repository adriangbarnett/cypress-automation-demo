var express = require('express');
const router = express.Router();
module.exports = router;
passportService = require("../services/service.passport.js");
apiController = require("../controllers/controller.api.js");

// AUTH CHECK
router.get("*", passportService.isApiKeyValid);
router.post("*", passportService.isApiKeyValid);
router.patch("*", passportService.isApiKeyValid);
router.delete("*", passportService.isApiKeyValid);

// USERS
router.post("/user", apiController.createUser_post);
router.patch("/user", apiController.updateUser_patch);
router.get("/user", apiController.getUser_get);
router.get("/users", apiController.getUsers_get);
router.delete("/user",apiController.deleteUser_delete);
router.delete("/users", apiController.deleteUsers_delete);
