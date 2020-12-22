const { errorApp } = require("../utils/error");

const User = require("../models/users.model");

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      requestTime: req.requestTime,
      data: { users },
    });
  } catch (error) {
    errorApp(res, 400, "Something went wrong. Please login again", error);
  }
};
