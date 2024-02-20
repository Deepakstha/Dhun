const router = require("express").Router();
const catchAsync = require("../../services/catchAsync");
const categoryController = require("../../controller/category/categoryController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const { givePermissionTo } = require("../../middleware/givePermissionTo");

router.get("/browse", catchAsync(categoryController.getAllCategory));
router.get("/browse/:id", catchAsync(categoryController.getSongOfCategory));
router.get(
  "/library",
  isAuthenticated,
  catchAsync(categoryController.getLibraryOfUser)
);

router.get(
  "/view-category",
  isAuthenticated,
  givePermissionTo("admin"),
  catchAsync(categoryController.displayAllCategory)
);

router.get(
  "/add-category",
  isAuthenticated,
  givePermissionTo(["admin"]),
  catchAsync(categoryController.renderAddCategoryPage)
);
router.post(
  "/add-category",
  isAuthenticated,
  givePermissionTo(["admin"]),
  catchAsync(categoryController.addCategory)
);

router.get(
  "/delete-category/:id",
  isAuthenticated,
  givePermissionTo(["admin"]),
  catchAsync(categoryController.deleteCategory)
);

router.get(
  "/edit-category/:id",
  isAuthenticated,
  givePermissionTo(["admin"]),
  catchAsync(categoryController.displayEditCategory)
);

router.post(
  "/update-category",
  isAuthenticated,
  givePermissionTo(["admin"]),
  catchAsync(categoryController.updateCategory)
);

module.exports = router;
