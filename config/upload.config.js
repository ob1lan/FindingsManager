const multer = require("multer");

// Memory storage for CSV
const memoryStorage = multer.memoryStorage();

// Disk storage for avatars
const diskStorageAvatar = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/avatars"); // Adjust the path if needed
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Disk storage for findings attachments
const diskStorageAttachment = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/files/attachments"); // Adjust the path if needed
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadCSV = multer({ storage: memoryStorage });
const uploadAvatar = multer({ storage: diskStorageAvatar });
const uploadAttachment = multer({
  storage: diskStorageAttachment,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit of 5MB
  },
});

module.exports = {
  uploadCSV,
  uploadAvatar,
  uploadAttachment,
};
