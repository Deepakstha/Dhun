const { customErrorHandler } = require("../../middleware/customErrorHandler");
const Playlist = require("../../models").playlist;
const Songs = require("../../models").songs;
const PlaylistSong = require("../../models").playlistSongs;

exports.createPlayList = async (req, res, next) => {
  const userId = req.userId;
  const { playlistName } = req.body;
  try {
    if (!playlistName) req.flash("message", "PlaylistName is required");

    const checkPlaylist = await Playlist.findOne({
      where: {
        name: playlistName,
        userId,
      },
    });
    if (checkPlaylist) {
      req.flash("message", "This playlist already exists for this user");
    }

    let playlist = await Playlist.create({
      name: playlistName,
      userId,
    });
    return res.redirect("/playlist");
  } catch (err) {
    console.log(err);
    return next(customErrorHandler(err, res));
  }
};

exports.addSongInPlaylist = async (req, res) => {
  const { playlistId, songId } = req.body;
  const playlistSong = await PlaylistSong.create({
    playlistId,
    songId,
  });
  return res.redirect("/playlist");
};

// Get all playlist of the user
exports.getAllUserPlaylists = async (req, res, next) => {
  const userId = req.userId;
  const token = req.cookies.token;
  const playlist = await Playlist.findAll({ where: { userId } });
  const songs = await Songs.findAll();

  res.render("createplaylist", { playlist, songs, userData: req?.user, token });
  // return res.status(200).json({
  //   success: true,
  //   count: playlist.length,
  //   data: playlist,
  // });
};

// get one playlist song
exports.getPlaylistSong = async (req, res, next) => {
  const userId = req.userId;
  const { playlistId } = req.params;
  const token = req.cookies.token;
  try {
    const playlist = await PlaylistSong.findAll({
      where: { playlistId },
      include: [
        { model: Songs, attributes: ["id", "audioPath", "title", "likes"] },
      ],
    });

    return res.render("playlistsongs", {
      playlist,
      userData: req?.user,
      token,
    });
  } catch (e) {
    return next(e);
  }
};

// delete playlist
exports.deletePlaylist = async (req, res, next) => {
  const userId = req.userId;
  const { name } = req.params;
  const playlist = await Playlist.findOne({
    where: { name, userId },
  });
  if (!playlist) {
    return next(customErrorHandler(404, "The playlist does not exist"));
  }
  // check if the playlist is in use by a user or an artist
  const deletedPlaylist = await Playlist.destroy({
    where: { name, userId },
  });
  return res.json({
    message: "Playlist Deleted",
    deletedPlaylist,
    userData: req?.user,
  });
};
