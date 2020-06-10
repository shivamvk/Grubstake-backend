const router = require("express").Router();
const authController = require("../controllers/auth-controller");
const passport = require("passport");

router.post(
  "/facebook",
  passport.authenticate("facebook-token"),
  authController.facebookAuth
);
router.post("/google", authController.googleAuth);
router.post("/email/signup", authController.emailSignup);
router.post("/email/login", authController.emailLogin);
router.get("/users", authController.getAllUsers);

module.exports = router;
