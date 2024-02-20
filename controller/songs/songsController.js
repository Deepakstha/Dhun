const { customErrorHandler } = require("../../middleware/customErrorHandler");
const Songs = require("../../models").songs;
const User = require("../../models").user;
const Category = require("../../models").category;
const Subscription = require("../../models").subscription;
const { Op, QueryTypes } = require("sequelize");
const { sequelize } = require("../../models");

exports.getOwnSong = async (req, res) => {
  const userId = req.userId;
  const token = req.cookies.token;
  const songs = await Songs.findAll({
    where: {
      userId: userId,
    },
  });
  const message = req.flash("message");
  console.log(songs);
  return res.render("artistyoursongs", {
    message,
    token,
    songs,
    userData: req?.user,
  });
};

exports.displayUploadSongForm = async (req, res, next) => {
  const token = req.cookies.token;
  const allCategory = await Category.findAll();
  return res.render("uploadSong", { allCategory, token, userData: req?.user });
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

  const findsubscription = await Subscription.findOne({
    where: {
      userId: userId,
    },
  });
  if (!findsubscription) {
    req.flash("message", "You haven't subscribed yet!");
    return res.redirect("/subscribe-artist");
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
  const userId = req.userId;
  try {
    const song = await Songs.findOne({
      where: { id: songId },
      include: { model: User },
    });
    if (!song) {
      return res.json({ message: "No songs" });
    }

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (user?.role == "listener") {
      const userSubscription = await Subscription.findOne({
        where: { userId },
      });
      if (!userSubscription) {
        req.flash(
          "message",
          "You dont have subscription!! Please Take subscription of atleast 500"
        );
        return res.redirect("/subscription");
      }
    }

    const message = req.flash("message");
    const token = req.cookies.token;
    return res.render("nowplaying", {
      song,
      message,
      token,
      userData: req?.user,
    });
  } catch (err) {
    return res.json({ message: err.message });
  }
};

exports.deleteSong = async (req, res, next) => {
  const { songId } = req.params;
  const userId = req.userId;
  const song = await Songs.findOne({
    where: {
      id: songId,
    },
  });
  if (!song) {
    return res.json({ message: "song not found" });
  }
  if (song.userId != userId) {
    return res.json({ message: "You dont have permission to delete" });
  }
  const deleted = await Songs.destroy({ where: { id: songId } });
  req.flash("message", "Song Deleted");
  return res.redirect("/own-song");
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
  const token = req.cookies.token;
  const search = await sequelize.query(
    "SELECT songs.id as songId, songs.title, songs.poster songPoster, users.fullName,users.avatar,songs.likes FROM songs INNER JOIN users ON songs.userId = users.id WHERE songs.title LIKE :query OR users.fullName LIKE :query",
    {
      replacements: {
        query: `%${query}%`,
      },
      type: QueryTypes.SELECT,
    }
  );
  return res.render("artistsearch", { search, token, userData: req?.user });
  return res.json({ search });
};
