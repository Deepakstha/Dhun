const bcrypt = require("bcrypt");
const db = require("../../models");
const jwt = require("jsonwebtoken");
const customErrorHandler = require("../../middleware/customErrorHandler");
const User = db.user;

exports.displaySignUpForm = async (req, res, next) => {
  res.render("login");
};

exports.displayLoginForm = async (req, res, next) => {
  res.render("login");
};

// Signup Controller
exports.signup = async (req, res, next) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName)
    return res.status(400).json({ message: "fullname is required" });
  if (!email) return res.status(400).json({ message: "email is required!!" });
  if (!password)
    return res.status(400).json({ message: "enter strong password!" });

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
    return res.json({ message: "User created", user });
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
    return res.json({ message: "Invalid Email or Password" });
  }
  const validPassord = bcrypt.compareSync(password, user.password);
  if (!validPassord) {
    return res.json({ message: "Invalid Email or Password" });
  }
  // create token
  let token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "5d" }
  );
  return res.json({ token });
};
