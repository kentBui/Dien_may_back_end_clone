const express = require("express");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const {
  getAllCategories,
  addCategory,
} = require("../controllers/category.controller");
const { requireSignin, restrictTo } = require("../controllers/auth.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "upload")); // create path for folder upload
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname); // create filename
  },
});

const upload = multer({ storage });

router.get("/", getAllCategories);

router.post(
  "/create",
  requireSignin,
  restrictTo("admin"),
  upload.single("categoryImage"),
  addCategory
);

module.exports = router;
