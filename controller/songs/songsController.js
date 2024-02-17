const { customErrorHandler } = require("../../middleware/customErrorHandler");
const Songs = require("../../models").songs;
const User = require("../../models").user;
const Category = require("../../models").category;
const { Op, QueryTypes } = require("sequelize");
const { sequelize } = require("../../models");

exports.getOwnSong = async (req, res) => {
  const userId = req.userId;
  const songs = await Songs.findAll({
    where: {
      userId: userId,
    },
  });
  const message = req.flash("message");
  const token = req.cookies.token;
  console.log(songs);
  return res.render("artistyoursongs", { message, token, songs });
};

exports.displayUploadSongForm = async (req, res, next) => {
  const allCategory = await Category.findAll();
  return res.render("uploadSong", { allCategory });
};

exports.uploadSong = async (req, res, next) => {
  const userId = req.userId;
  const { title, category } = req.body;
  console.log(req.files);
  const song = req.files.song[0].filename;
  const poster = req.files.poster[0].filename;
  let songUrl = `uploads/songs/${song}`;
  let posterUrl = `uploads/poster/${poster}`;
  if (!title) {
    return next(customErrorHandler(404, "title is required"));
  }
  if (!song) {
    return next(customErrorHandler(501, "song file not found"));
  }

  const songs = await Songs.create({
    title,
    audioPath: songUrl,
    poster: posterUrl,
    categoryId: category,
    userId,
  });
  return res.redirect("/own-song");
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
  const { songId } = req.params;
  console.log(songId);
  try {
    const song = await Songs.findOne({
      where: { id: songId },
      include: { model: User },
    });
    if (!song) {
      return res.json({ message: "No songs" });
    }
    const message = req.flash("message");
    const token = req.cookies.token;
    return res.render("nowplaying", { song, message, token });
    // return res.status(200).json({ success: true, data: song });
  } catch (err) {
    return res.json({ message: err.message });
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
  const { query } = req.body;
  const search = await sequelize.query(
    "SELECT songs.id as songId, songs.title, songs.poster songPoster, users.fullName,users.avatar,songs.likes FROM songs INNER JOIN users ON songs.userId = users.id WHERE songs.title LIKE :query OR users.fullName LIKE :query",
    {
      replacements: {
        query: `%${query}%`,
      },
      type: QueryTypes.SELECT,
    }
  );
  return res.render("artistsearch", { search });
  return res.json({ search });
};
