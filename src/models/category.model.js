const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You need give category name"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    categoryImage: String,
    parentId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
