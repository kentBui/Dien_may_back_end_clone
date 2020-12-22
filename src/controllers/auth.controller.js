const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const util = require("util");

const User = require("../models/users.model");
const { errorApp } = require("../utils/error");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports.signup = async (req, res) => {
  try {
    console.log(req.body);
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    newUser.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    errorApp(res, 400, "You need create again", error);
  }
};

module.exports.signin = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password)
      return res.status(400).json({
        status: "error",
        message: "You need enter email or password",
      });

    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (!user)
      return res.status(400).json({
        status: "error",
        message: "Incorrect email",
      });

    const correct = await user.correctPassword(
      req.body.password,
      user.password
    );

    if (!correct)
      return res.status(400).json({
        status: "error",
        message: "Incorrect password",
      });

    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (error) {
    errorApp(res, 400, "You need sign in again", error);
  }
};

module.exports.requireSignin = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    )
      return res.status(400).json({
        status: "error",
        message: "Authorization is required",
      });

    // get token from headers
    const token = req.headers.authorization.split(" ")[1];

    // decode token to get id
    const decoded = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    // find user by id
    const currentUser = await User.findById(decoded.id);

    if (!currentUser)
      return res.status(400).json({
        status: "error",
        message: "The user does not exists",
      });

    req.user = currentUser;

    next();
  } catch (error) {
    errorApp(res, 400, "Something went wrong, please login again", error);
  }
};

module.exports.restrictTo = (...roles) => {
  // console.log(roles);
  return (req, res, next) => {
    // console.log(req.user.role);
    if (!roles.includes(req.user.role))
      return res.status(400).json({
        status: "error",
        message: "You do not have permission to perform this action",
      });

    next();
  };
};
