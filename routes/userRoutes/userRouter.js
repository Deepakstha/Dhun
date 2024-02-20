const router = require("express").Router();
const userController = require("../../controller/user/userController");
const catchAsync = require("../../services/catchAsync");
const isAuthenticated = require("../../middleware/isAuthenticated");
const { givePermissionTo } = require("../../middleware/givePermissionTo");

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
router.get(
  "/listener",
  isAuthenticated,
  catchAsync(userController.displayListenerIndexPage)
);
router.get(
  "/artist",
  isAuthenticated,
  catchAsync(userController.displayArtistIndexPage)
);

router.get("/artist/:id", catchAsync(userController.artistProfile));
router.get(
  "/admin",
  isAuthenticated,
  givePermissionTo(["admin"]),
  catchAsync(userController.displayAdminDashboard)
);
router.get(
  "/total-users",
  isAuthenticated,
  givePermissionTo(["admin"]),
  catchAsync(userController.displayTotalUsers)
);

router.get(
  "/total-artist",
  isAuthenticated,
  givePermissionTo(["admin"]),
  catchAsync(userController.displayTotalArtist)
);

router.get(
  "/total-listener",
  isAuthenticated,
  givePermissionTo(["admin"]),
  catchAsync(userController.displayTotalListener)
);
module.exports = router;
