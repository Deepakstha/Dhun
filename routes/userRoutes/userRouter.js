const router = require("express").Router();
const userController = require("../../controller/user/userController");
const catchAsync = require("../../services/catchAsync");

router.get("/signup", catchAsync(userController.displaySignUpForm));
router.post("/signup", catchAsync(userController.signup));
router.get("/login", catchAsync(userController.displayLoginForm));
router.post("/login", catchAsync(userController.login));

module.exports = router;
