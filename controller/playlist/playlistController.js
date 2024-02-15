const { customErrorHandler } = require("../../middleware/customErrorHandler");
const Playlist = require("../../models").playlist;
const Songs = require("../../models").songs;

exports.createPlayList = async (req, res, next) => {
  const userId = req.userId;
  const { name, songId } = req.body;
  try {
    if (!name || !songId)
      return next(customErrorHandler(400, "Name and Song Id are required"));

    const checkPlaylist = await Playlist.findOne({
      where: {
        name,
        userId,
      },
    });
    if (checkPlaylist) {
      return next(
        customErrorHandler(409, "This playlist already exists for this user")
      );
    }

    let playlist = await Playlist.create({ name, songId, userId });
    return res.status(201).json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    console.log(err);
    return next(customErrorHandler(err, res));
  }
};

// Get all playlist of the user
exports.getAllUserPlaylists = async (req, res, next) => {
  const userId = req.userId;
  const playlist = await Playlist.findAll({ where: { userId } });
  return res.status(200).json({
    success: true,
    count: playlist.length,
    data: playlist,
  });
};

// get one playlist song
exports.getPlaylistSong = async (req, res, next) => {
  const userId = req.userId;
  console.log(userId);
  const { name } = req.body;
  try {
    const playlist = await Playlist.findAll({
      where: { name, userId },
      include: [
        { model: Songs, attributes: ["id", "audioPath", "title", "likes"] },
      ],
    });
    if (!playlist) {
      return next(customErrorHandler(404, "No playlist found with that Id"));
    }
    return res.json({ playlist });
  } catch (e) {
    return next(e);
  }
};

// delete playlist
exports.deletePlaylist = async (req, res, next) => {
  const userId = req.userId;
  const { name } = req.body;
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
  return res.json({ message: "Playlist Deleted", deletedPlaylist });
};
