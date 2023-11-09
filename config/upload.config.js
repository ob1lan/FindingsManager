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

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadCSV = multer({ storage: memoryStorage });
const uploadAvatar = multer({ storage: diskStorageAvatar });
const uploadAttachment = multer({
  storage: diskStorageAttachment,
});

module.exports = {
  uploadCSV,
  uploadAvatar,
  uploadAttachment,
};
