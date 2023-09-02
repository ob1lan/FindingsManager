const mongoose = require("mongoose");
const schema = mongoose.Schema;

const verificationTokenSchema = new schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 86400 }, // 24 hours
});

module.exports = mongoose.model("VerificationToken", verificationTokenSchema);
