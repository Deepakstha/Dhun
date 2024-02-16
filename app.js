const express = require("express");
require("dotenv").config();

const app = express();
const cors = require("cors");
const session = require("express-session");
require("./config/dbConfig");

const cookieParser = require("cookie-parser");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//expression session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/uploads", express.static("uploads"));

//Routes
app.use("/", require("./routes/userRoutes/userRouter"));
// app.use("/api/songs", require("./routes/songsRoutes/songRouter"));
// app.use("/api/playlist", require("./routes/playlistRoutes/playlistRouter"));
// app.use("/api/like", require("./routes/likeRoutes/likeRouter"));

app.get("/", (req, res) => {
  res.render("index");
});

app.use("*", (req, res) => {
  return res.status(404).json({ message: "Route Not Found", status: 404 });
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
