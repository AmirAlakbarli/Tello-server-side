const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    status: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 1,
      select: false,
    },

    name: {
      type: String,
      required: [true, "User name must be defined!"],
    },

    surname: {
      type: String,
      required: [true, "User surname must be defined!"],
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      requires: true,
      validate: [validator.isEmail, "Please enter a correct email"],
    },

    password: {
      type: String,
      required: [true, "Please enter a password!"],
      select: false,
    },

    number: String,

    photo: String,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    forgetPassword: String,
    resetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: 0 } });
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.checkPassword = async function (
  realPassword,
  cryptedPassword
) {
  return await bcrypt.compare(realPassword, cryptedPassword);
};

userSchema.methods.generatePassToken = async function () {
  const resetToken = crypto.randomBytes(48).toString("hex");
  this.forgetPassword = await bcrypt.hash(resetToken, 16);
  this.resetExpires = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
