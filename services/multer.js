const multer = require("multer");

const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/songs/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split(".")[0];
    const fileExtension = file.originalname.split(".").pop();
    cb(null, filename + "-" + uniqueSuffix + "." + fileExtension);
  },
});

exports.audio = multer({ storage: audioStorage });
