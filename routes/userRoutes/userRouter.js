const router = require("express").Router();
const userController = require("../../controller/user/userController");
const catchAsync = require("../../services/catchAsync");

router.post("/signup", catchAsync(userController.signup));
router.get(
  "/listener-signup",
  catchAsync(userController.displaySignUpFormForListener)
);
router.get(
  "/artist-signup",
  catchAsync(userController.displaySignupFormForArtist)
);
router.post("/login", catchAsync(userController.login));
router.get("/login", catchAsync(userController.displayLoginForm));
router.get("/logout", catchAsync(userController.logout));
module.exports = router;
