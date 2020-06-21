const router = require("express").Router();
const authController = require("../controllers/auth-controller");
const passport = require("passport");
const { check } = require("express-validator");

router.post(
  "/facebook",
  passport.authenticate("facebook-token"),
  authController.facebookAuth
);
router.post(
  "/google",
  [check("idToken").notEmpty()],
  authController.googleAuth
);
router.post(
  "/email/signup",
  [
    check("name").notEmpty(),
    check("email").isEmail(),
    check("phone").isLength({ min: 10, max: 10 }),
    check("image").notEmpty(),
    check("password").isLength({ min: 6 }),
  ],
  authController.emailSignup
);
router.post(
  "/email/login",
  [
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  authController.emailLogin
);
router.get("/users", authController.getAllUsers);

module.exports = router;
