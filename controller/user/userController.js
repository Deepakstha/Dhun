const bcrypt = require("bcrypt");
const db = require("../../models");
const jwt = require("jsonwebtoken");
const customErrorHandler = require("../../middleware/customErrorHandler");
const User = db.user;
const Song = db.songs;
const Like = db.like;

exports.displaySignUpFormForListener = async (req, res, next) => {
  return res.render("listenersignup");
};
exports.displaySignupFormForArtist = async (req, res, next) => {
  res.render("artistsignup");
};

exports.displayLoginForm = async (req, res, next) => {
  const message = req.flash("message");
  res.render("login", { message });
};

exports.displayListenerIndexPage = async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });
  if (user.role != "listener") return res.redirect("/");

  const allSongs = await Song.findAll({});

  const message = req.flash("message");
  const token = req.cookies.token;
  return res.render("listenerindex", { message, token, allSongs });
};
exports.displayArtistIndexPage = async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });
  if (user.role != "artist") return res.redirect("/");
  const allSongs = await Song.findAll({});

  const message = req.flash("message");
  const token = req.cookies.token;
  return res.render("artistindex", { message, token, allSongs });
};

// Signup Controller
exports.signup = async (req, res, next) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName) {
    req.flash("message", "fullname is required");
    res.redirect("/listenersignup");
  }
  if (!email) {
    req.flash("message", "Email is required");
    return res.redirect("/listenersignup");
  }
  if (!password) {
    req.flash("message", "password is required");
    return res.redirect("/listenersignup");
  }

  try {
    const userEmailExist = await User.findOne({ where: { email } });
    if (userEmailExist)
      return res
        .status(400)
        .json({ message: "User with Email Already register!!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });
    req.flash("message", "User Registered");
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (!user) {
    req.flash("message", "Invalid Email or Password");
    return res.redirect("/login");
  }
  const validPassord = bcrypt.compareSync(password, user.password);
  if (!validPassord) {
    req.flash("message", "Invalid Email or Password");
    return res.redirect("/login");
  }
  // create token
  let token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "5d" }
  );
  res.cookie("token", token, { httpOnly: true });
  if (user.role === "admin") {
    res.redirect("/admin");
  }
  return res.redirect("/");
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

exports.artistProfile = async (req, res) => {
  const artistId = req.params.id;
  const token = req.cookies.token;
  const user = await User.findOne({
    where: {
      id: artistId,
    },
  });
  if (user.role != "artist") {
    return res.json({ message: "Not artist" });
  }
  const songs = await Song.findAll({
    where: {
      userId: artistId,
    },
  });
  const len = songs.length;
  return res.render("artistprofile", {
    user,
    totalSongs: len,
    token,
    userData: req?.user,
  });
};

exports.displayAdminDashboard = async (req, res) => {
  const totalUsers = await User.findAndCountAll();
  const artists = await User.findAndCountAll({ where: { role: "artist" } });
  const listener = await User.findAndCountAll({ where: { role: "listener" } });
  // return res.json(users);
  return res.render("admin-index", { totalUsers, artists, listener });
};

exports.displayTotalUsers = async (req, res) => {
  const totalUsers = await User.findAndCountAll();
  // return res.json({ totalUsers });
  return res.render("admin-view-totausers", { totalUsers });
};

exports.displayTotalArtist = async (req, res) => {
  const artists = await User.findAndCountAll({ where: { role: "artist" } });
  return res.render("admin-view-total-artist", { artists });
};

exports.displayTotalListener = async (req, res) => {
  const listener = await User.findAndCountAll({ where: { role: "listener" } });
  return res.render("admin-view-total-listener", { listener });
};
