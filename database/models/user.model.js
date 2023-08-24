const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = schema({
  username: { type: String, required: true, unique: true },
  local: {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  avatar: { type: String, default: "/images/default-profile.svg" },
  firstname: { type: String, default: "" }, // Added firstname
  lastname: { type: String, default: "" }, // Added lastname
  function: { type: String, default: "" }, // Added function
  bio: { type: String, default: "" }, // Added bio
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hash(password, 12);
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.local.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
