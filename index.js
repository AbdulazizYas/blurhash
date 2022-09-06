const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const { encode } = require("blurhash");
const fs = require("fs");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "D:\\Projects\\NodeProjects\\interview\\uploads");
  },
  filename: function (req, file, cb) {
    cb(null, "full.jpg");
  },
});
const upload = multer({ storage: storage });

// const upload = multer({ dest: "./uploads" });

app.post("/cloudimage", upload.single("image"), (req, res) => {
  const file = req.file;

  sharp("D:\\Projects\\NodeProjects\\interview\\uploads\\" + file.filename)
    .resize(128, 128)
    .toFile("./uploads/small.jpg", (err) => {
      console.log(err);
    });
  sharp("D:\\Projects\\NodeProjects\\interview\\uploads\\" + file.filename)
    .resize(256, 256)
    .toFile("./uploads/medium.jpg", (err) => {
      console.log(err);
    });
  sharp("D:\\Projects\\NodeProjects\\interview\\uploads\\" + file.filename)
    .resize(512, 512)
    .toFile("./uploads/high.jpg", (err) => {
      console.log(err);
    });

  const encodeImageToBlurhash = (path) =>
    new Promise((resolve, reject) => {
      sharp(path)
        .raw()
        .ensureAlpha()
        .resize(32, 32, { fit: "inside" })
        .toBuffer((err, buffer, { width, height }) => {
          if (err) return reject(err);
          resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
        });
    });

  encodeImageToBlurhash("./uploads/full.jpg").then((hash) => {
    res.json({
      full: "./uploads/full.jpg",
      high: "./uploads/high.jpg",
      medium: "./uploads/medium.jpg",
      small: "./uploads/small.jpg",
      blurhash: hash,
    });
  });
});

app.get("/", (req, res) => {
  res.send("bruh");
});

app.listen(3000);
