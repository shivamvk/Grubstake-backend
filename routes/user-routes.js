const router = require("express").Router();
const userController = require("../controllers/user-controller");
const checkAuth = require("../middleware/checkAuth");

router.use(checkAuth);

router.get("/createdEvents", userController.getCreatedEventsByUserId);

router.get("/profile", userController.getUserProfile);

module.exports = router;