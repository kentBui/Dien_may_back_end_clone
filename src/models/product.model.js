const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You need to add product name"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "You need enter slug"],
    },
    price: {
      type: Number,
      required: [true, "You need add product price"],
    },
    quantity: {
      type: Number,
      required: [true, "You need add product quantity"],
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    productPicture: [
      {
        img: String,
      },
    ],
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        review: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updateAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
