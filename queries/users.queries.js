const User = require("../database/models/user.model");

exports.createUser = async (user) => {
  try {
    const hashedPassword = await User.hashPassword(user.password);
    const newUser = new User({
      username: user.username,
      local: {
        email: user.email,
        password: hashedPassword,
      },
    });
    return newUser.save();
  } catch (e) {
    throw e;
  }
};

exports.getAllUsers = () => {
  return User.find().exec();
};


exports.findUserPerEmail = (email) => {
  return User.findOne({ "local.email": email }).exec();
};

exports.findUserPerId = (id) => {
  return User.findById(id).exec();
};

exports.findUserPerUsername = (username) => {
  return User.findOne({ username }).exec();
};

exports.searchUsersPerUsername = (search) => {
  const regExp = `^${search}`;
  const reg = new RegExp(regExp);
  return User.find({ username: { $regex: reg } })
    .limit(10)
    .exec();
};

exports.updateUserDetails = async (userId, details) => {
  return await User.findByIdAndUpdate(userId, details, { new: true });
};

exports.deleteUser = async (id) => {
  try {
    return await User.findByIdAndDelete(id).exec();
  } catch (e) {
    throw e;
  }
};