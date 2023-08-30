const multer = require("multer");

// Memory storage for CSV
const memoryStorage = multer.memoryStorage();

// Disk storage for avatars
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/avatars"); // Adjust the path if needed
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadCSV = multer({ storage: memoryStorage });
const uploadAvatar = multer({ storage: diskStorage });

module.exports = {
  uploadCSV,
  uploadAvatar,
};
