const { customErrorHandler } = require("../../middleware/customErrorHandler");
const Songs = require("../../models").songs;
const User = require("../../models").user;
const { Op, QueryTypes } = require("sequelize");

exports.uploadSong = async (req, res, next) => {
  const userId = req.userId;
  const { title } = req.body;
  const song = req.file.filename;
  let songUrl = `uploads/songs/${song}`;
  console.log(userId);
  console.log(songUrl);
  if (!title) {
    return next(customErrorHandler(404, "title is required"));
  }
  if (!song) {
    return next(customErrorHandler(501, "song file not found"));
  }

  const songs = await Songs.create({
    title,
    audioPath: songUrl,
    userId,
  });
  return res.status(201).json({ message: "success", data: songs });
};

//Display all songs
exports.getAllSongs = async (req, res, next) => {
  try {
    const songs = await Songs.findAll();
    return res.status(200).json({ success: true, data: songs });
  } catch (error) {
    return next(customErrorHandler(500, error.message));
  }
};

//Get a single Song by ID
exports.getSingleSong = async (req, res, next) => {
  const { songId } = req.body;
  try {
    const song = await Songs.findOne({ where: { id: songId } });
    if (!song) {
      return next(customErrorHandler(404, "No song with that ID exists."));
    }
    return res.status(200).json({ success: true, data: song });
  } catch (err) {
    return next(customErrorHandler(500, err.message));
  }
};

exports.deleteSong = async (req, res, next) => {
  const { songId } = req.body;
  const userId = req.userId;
  const song = await Songs.findOne({
    where: {
      id: songId,
    },
  });
  if (!song) {
    return next(customErrorHandler(404, "song not found"));
  }
  if (song.userId != userId) {
    return next(
      customErrorHandler(403, "You don't have permission to delete this song")
    );
  }
  const deleted = await Songs.destroy({ where: { id: songId } });
  return res.json({ message: "Song deleted" });
};

exports.getSongsOfArtist = async (req, res, next) => {
  const { artistId } = req.body;
  const songs = await Songs.findAll({
    where: {
      userId: artistId,
    },
  });
  return res.json({ songs });
};

//Search song
exports.searchSongs = async (req, res, next) => {
  const { songTitle, artistName } = req.body;
  const search = await sequelize.query(
    "SELECT * FROM songs INNER JOIN users ON songs.userId = users.id WHERE songs.title LIKE :songTitle OR users.fullName LIKE :artistName",
    {
      replacements: {
        songTitle: `%${songTitle}%`,
        artistName: `%${artistName}%`,
      },
      type: QueryTypes.SELECT,
    }
  );
  return res.json({ search });
};
