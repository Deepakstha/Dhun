const jwt = require("jsonwebtoken");
const user = require("../models").user;
const util = require("util");
const promisify = util.promisify;
const { customErrorHandler } = require("./customErrorHandler");
module.exports = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.flash("message", "Not Authenticated, Please Login!!");
    return res.redirect("/");
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const loggedUser = await user.findByPk(decoded.id);

    if (!loggedUser) {
      req.flash(
        "message",
        "token is verifyed but user doesn't exist on our database. Please try again by loggin out."
      );
      return res.redirect("/");
    }
    req.userId = loggedUser.id;
    req.user = loggedUser;
    next();
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      req.flash("message", "Token expired!!");
      return res.redirect("/");
    } else if (error.name === "JsonWebTokenError") {
      req.flash("message", "Invalid Token !!");
      return res.redirect("/");
    } else {
      next(error);
    }
  }
};
