const Category = require("../../models").category;
const Song = require("../../models").songs;
const Playlist = require("../../models").playlist;
const Like = require("../../models").like;
exports.getAllCategory = async (req, res) => {
  const allCategory = await Category.findAll({});
  const token = req.cookies.token;
  return res.render("browse", { allCategory, userData: req?.user, token });
};

exports.getSongOfCategory = async (req, res) => {
  const categoryId = req.params.id;
  const token = req.cookies.token;
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
    userData: req?.user,
    token,
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
  res.render("library", { playlist, token, likeList, userData: req?.user });
};

exports.displayAllCategory = async (req, res) => {
  const allCategory = await Category.findAll();
  const message = req.flash("message");
  return res.render("admin-view-category", { allCategory, message });
  return res.json({ message: allCategory });
};

exports.renderAddCategoryPage = async (req, res) => {
  // return res.json({ message: "add-category" });
  const message = req.flash("message");
  return res.render("add-category", { message });
};

exports.addCategory = async (req, res) => {
  const userId = req.userId;
  const { name } = req.body;
  const category = await Category.create({ name });
  req.flash("message", "Category Created !");
  return res.redirect("/add-category");
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  await Category.destroy({ where: { id } });
  req.flash("message", "Category Deleted !");
  return res.redirect("/view-category");
};

exports.displayEditCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findOne({
    where: {
      id,
    },
  });
  return res.render("admin-edit-category", { category });
};

exports.updateCategory = async (req, res) => {
  const { name, id } = req.body;
  const category = Category.update(
    { name },
    {
      where: { id },
    }
  );
  req.flash("message", "Category Updated Successfully!");
  return res.redirect(`/view-category`);
};
