const { customErrorHandler } = require("../../middleware/customErrorHandler");
const Songs = require("../../models").songs;
const Like = require("../../models").like;

exports.likeSongs = async (req, res, next) => {
  const userId = req.userId;
  const { songId } = req.params;
  if (!songId) {
    return next(customErrorHandler(400, "Missing required field"));
  }
  const song = await Songs.findOne({
    where: {
      id: songId,
    },
  });
  if (!song) return next(customErrorHandler(404, "No such Song exists!"));
  song.likes = song.likes + 1;
  song.save();
  const likesave = await Like.create({
    userId,
    songId,
  });
  if (!likesave) return next(customErrorHandler(400, "Cannot like the song"));
  return res.status(200).json({ message: "Liked the song successfully!" });
};

// display liked song of user
exports.getUserLikeList = async (req, res, next) => {
  const userId = req.userId;
  console.log(userId);
  const likeList = await Like.findAll({
    where: { userId },
    include: [
      {
        model: Songs,
        attributes: ["id", "audioPath", "title", "poster", "likes"],
      },
    ],
  });

  return res.render("likedsongs", { message: "success", likeList });
};
