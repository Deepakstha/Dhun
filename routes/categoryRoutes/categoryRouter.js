const router = require("express").Router();
const catchAsync = require("../../services/catchAsync");
const categoryController = require("../../controller/category/categoryController");
const isAuthenticated = require("../../middleware/isAuthenticated");

router.get("/browse", catchAsync(categoryController.getAllCategory));
router.get("/browse/:id", catchAsync(categoryController.getSongOfCategory));
router.get(
  "/library",
  isAuthenticated,
  catchAsync(categoryController.getLibraryOfUser)
);

module.exports = router;
