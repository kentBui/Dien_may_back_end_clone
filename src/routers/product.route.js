const express = require("express");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");

const { requireSignin, restrictTo } = require("../controllers/auth.controller");
const {
  getAllProduct,
  addProduct,
  getProductsBySlug,
} = require("../controllers/product.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "upload"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", getAllProduct);

router.get("/:slug", getProductsBySlug);

router.post(
  "/create",
  requireSignin,
  restrictTo("admin"),
  upload.array("productPicture"),
  addProduct
);

module.exports = router;
