const router = require("express").Router();
const songController = require("../../controller/songs/songsController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const catchAsync = require("../../services/catchAsync");
const { audio } = require("../../services/multer");

router.post(
  "/upload-song",
  isAuthenticated,
  audio.single("song"),
  catchAsync(songController.uploadSong)
);

router.get("/all-songs", catchAsync(songController.getAllSongs));
router.get("/one-song", catchAsync(songController.getSingleSong));
router.delete(
  "/delete-song",
  isAuthenticated,
  catchAsync(songController.deleteSong)
);
router.get("/artist-song", catchAsync(songController.getSongsOfArtist));

module.exports = router;
