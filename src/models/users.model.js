const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "You need enter first name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "You need enter email"],
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "You need enter password"],
      minlength: 6,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "You need enter password confirm"],
      minlength: 6,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Please enter the same password",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // check password is modidied
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods = {
  // check password
  correctPassword: async function (candicatePassword, userPassword) {
    return bcrypt.compare(candicatePassword, userPassword);
  },
  // create password reset token
  createPasswordResetToken: async function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    console.log({ resetToken, passwordResetToken: this.passwordResetToken });

    return resetToken;
  },
};

module.exports = mongoose.model("User", userSchema);
