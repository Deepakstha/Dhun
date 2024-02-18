const router = require("express").Router();
const songController = require("../../controller/songs/songsController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const catchAsync = require("../../services/catchAsync");
const { audioUpload } = require("../../services/multer");

router.get("/upload-song", catchAsync(songController.displayUploadSongForm));

router.post(
  "/upload-song",
  isAuthenticated,
  audioUpload,
  catchAsync(songController.uploadSong)
);

router.get("/all-songs", catchAsync(songController.getAllSongs));
router.get("/one-song/:songId", catchAsync(songController.getSingleSong));
router.get(
  "/delete-song/:songId",
  isAuthenticated,
  catchAsync(songController.deleteSong)
);
router.get("/artist-song", catchAsync(songController.getSongsOfArtist));
router.get("/own-song", isAuthenticated, catchAsync(songController.getOwnSong));
router.post("/search", catchAsync(songController.searchSongs));

module.exports = router;
