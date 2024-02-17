const Category = require("../../models").category;
const Song = require("../../models").songs;
const Playlist = require("../../models").playlist;
const Like = require("../../models").like;
exports.getAllCategory = async (req, res) => {
  const allCategory = await Category.findAll({});
  return res.render("browse", { allCategory });
};

exports.getSongOfCategory = async (req, res) => {
  const categoryId = req.params.id;
  const category = await Category.findByPk(categoryId);
  const songsInThisCat = await Song.findAll({
    where: {
      categoryId: categoryId,
    },
  });
  //   return res.json({ songsInThisCat });
  return res.render("category-song", {
    songsInThisCat,
    categoryName: category.name,
  });
};

exports.getLibraryOfUser = async (req, res) => {
  const userId = req.userId;
  const token = req.cookies.token;
  const playlist = await Playlist.findAll({ where: { userId } });
  const likeList = await Like.findAll({
    where: { userId },
    include: [
      {
        model: Song,
        attributes: ["id", "audioPath", "title", "poster", "likes"],
      },
    ],
  });
  res.render("library", { playlist, token, likeList });
};
