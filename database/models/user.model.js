const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = schema({
  username: { type: String, required: true, unique: true, maxlength: 8 },
  local: {
    email: { type: String, required: true, unique: true, maxlength: 254 },
    password: { type: String, required: true },
  },
  avatar: { type: String, default: "/images/default-profile.svg" },
  firstname: { type: String, default: "", maxlength: 50 },
  lastname: { type: String, default: "", maxlength: 50 },
  function: { type: String, default: "", maxlength: 50 },
  phone: { type: String, default: "" },
  bio: { type: String, default: "" },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: { type: Boolean, default: false },
  twoFASecret: { type: String, default: null },
  twoFAEnabled: { type: Boolean, default: false },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hash(password, 12);
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.local.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
