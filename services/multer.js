const multer = require("multer");

const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "song") {
      cb(null, "uploads/songs/");
    }
    if (file.fieldname === "poster") {
      cb(null, "uploads/poster/");
    }
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split(".")[0];
    const fileExtension = file.originalname.split(".").pop();
    cb(null, filename + "-" + uniqueSuffix + "." + fileExtension);
  },
});

let audio = multer({ storage: audioStorage });
exports.audioUpload = audio.fields([{ name: "song" }, { name: "poster" }]);
