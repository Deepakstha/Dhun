const jwt = require("jsonwebtoken");
const user = require("../models").user;
const util = require("util");
const promisify = util.promisify;
const { customErrorHandler } = require("./customErrorHandler");
module.exports = async (req, res, next) => {
  // const token = req.cookies.token;
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer "))
    return next(customErrorHandler(406, "Not Authenticated, Please Login"));

  const token = authorization.split(" ")[1];

  if (!token)
    return next(customErrorHandler(406, "Not Authenticated, Please Login!!"));

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const loggedUser = await user.findByPk(decoded.id);

    if (!loggedUser) {
      res.status(502).json({
        message:
          "token is verifyed but user doesn't exist on our database. Please try again by loggin out.",
        status: 502,
      });
    }
    req.userId = loggedUser.id;
    next();
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      return next(customErrorHandler(502, "Token expired!!"));
    } else if (error.name === "JsonWebTokenError") {
      return next(customErrorHandler(502, "Invalid token!"));
    } else {
      next(error);
    }
  }
};
