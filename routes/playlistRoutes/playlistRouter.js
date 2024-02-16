const router = require("express").Router();
const playlistController = require("../../controller/playlist/playlistController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const catchAsync = require("../../services/catchAsync");
const { audio } = require("../../services/multer");

router.get(
  "/playlist",
  isAuthenticated,
  catchAsync(playlistController.getAllUserPlaylists)
);

router.post(
  "/create-playlist",
  isAuthenticated,
  catchAsync(playlistController.createPlayList)
);

// router.get(
//   "/all-playlist",
//   isAuthenticated,
//   catchAsync(playlistController.getAllUserPlaylists)
// );
router.get(
  "/display-playlist/:name",
  isAuthenticated,
  catchAsync(playlistController.getPlaylistSong)
);
router.delete(
  "/delete-playlist/:name",
  isAuthenticated,
  catchAsync(playlistController.deletePlaylist)
);

module.exports = router;
