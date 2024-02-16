const bcrypt = require("bcrypt");
const db = require("../../models");
const jwt = require("jsonwebtoken");
const customErrorHandler = require("../../middleware/customErrorHandler");
const User = db.user;

exports.displaySignUpFormForListener = async (req, res, next) => {
  res.render("listenersignup");
};
exports.displaySignupFormForArtist = async (req, res, next) => {
  res.render("artistsignup");
};

exports.displayLoginForm = async (req, res, next) => {
  const message = req.flash("message");
  res.render("login", { message });
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
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "5d" }
  );
  res.cookie("token", token, { httpOnly: true });
  return res.redirect("/");
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};
