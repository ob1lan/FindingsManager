const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema({
  attemptedEmail: {
    type: String,
    required: false,
  },
  attemptedAction: {
    type: String,
    enum: ["login", "logout", "password-change", "password-reset", "2FAenabled", "2FAdisabled", "2FAlogin"],
    required: false,
  },
  userAgent: {
    type: String,
    required: true,
  },
  clientIP: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["success", "failed", "requested"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const LoginLog = mongoose.model("LoginLog", loginLogSchema);

module.exports = LoginLog;
