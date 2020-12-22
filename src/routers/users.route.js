const express = require("express");
const {
  signup,
  signin,
  requireSignin,
  restrictTo,
} = require("../controllers/auth.controller");
const { getAllUsers } = require("../controllers/users.controller");

const router = express.Router();

router.get("/", requireSignin, restrictTo("admin", "user"), getAllUsers);

router.post("/signup", signup);

router.post("/signin", signin);

module.exports = router;
