const router = require("express").Router();
const playlistController = require("../../controller/playlist/playlistController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const catchAsync = require("../../services/catchAsync");
const { audio } = require("../../services/multer");

router.post(
  "/create-playlist",
  isAuthenticated,
  catchAsync(playlistController.createPlayList)
);
router.get(
  "/all-playlist",
  isAuthenticated,
  catchAsync(playlistController.getAllUserPlaylists)
);
router.get(
  "/display-playlist",
  isAuthenticated,
  catchAsync(playlistController.getPlaylistSong)
);
router.delete(
  "/delete-playlist",
  isAuthenticated,
  catchAsync(playlistController.deletePlaylist)
);

module.exports = router;
