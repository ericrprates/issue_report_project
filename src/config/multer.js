const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "public", "uploads"));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        file.key = `${hash.toString("hex")}-${file.originalname}`;
        console.log(file.key);
        cb(null, file.key);
      });
    }
  })
};

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "public", "uploads"),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 15 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ];

    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type."));
  }
};
