const router = require("express").Router();
const likeController = require("../../controller/likes/likesController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const catchAsync = require("../../services/catchAsync");

router.post(
  "/like/:songId",
  isAuthenticated,
  catchAsync(likeController.likeSongs)
);
router.get(
  "/liked-list",
  isAuthenticated,
  catchAsync(likeController.getUserLikeList)
);

module.exports = router;
