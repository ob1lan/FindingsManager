const User = require("../database/models/user.model");
const authLog = require("../database/models/authLog.model");

exports.createUser = async (user) => {
  try {
    const hashedPassword = await User.hashPassword(user.password);
    const newUser = new User({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      bio: user.bio,
      function: user.function,
      phone: user.phone,
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

exports.findLastFiveLogsByEmail = (email) => {
  return authLog.find({ attemptedEmail: email })
    .sort({ timestamp: -1 })
    .limit(5)
    .exec();
};

exports.findUserByResetToken = async (token) => {
  return await User.findOne({ "passwordResetToken": token });
};
