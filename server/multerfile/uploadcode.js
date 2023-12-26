const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const imageUpload = multer({ storage: storage }).fields([
  { name: "image", maxCount: 1 },
  { name: "anotherImage", maxCount: 1 },
]);

module.exports = { imageUpload };
