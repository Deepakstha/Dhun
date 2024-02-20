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
router.post(
  "/add-song-to-playlist",
  isAuthenticated,
  catchAsync(playlistController.addSongInPlaylist)
);

// router.get(
//   "/all-playlist",
//   isAuthenticated,
//   catchAsync(playlistController.getAllUserPlaylists)
// );
router.get(
  "/display-playlist/:playlistId",
  isAuthenticated,
  catchAsync(playlistController.getPlaylistSong)
);
router.get(
  "/delete-playlist/:id",
  isAuthenticated,
  catchAsync(playlistController.deletePlaylist)
);

module.exports = router;
