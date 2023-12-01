const mongoose = require("mongoose");
const schema = mongoose.Schema;

const smtpSettingsSchema = schema({
  smtpHost: { type: String, required: true, default: "127.0.0.1" },
  smtpPort: { type: Number, required: true, default: "1025" },
  smtpUsername: { type: String, required: false },
  smtpPassword: { type: String, required: false },
  smtpSecure: { type: Boolean, required: true, default: false },
});

const SLASettingsSchema = schema({
  info: { type: Number, required: true, default: 365 },
  low: { type: Number, required: true, default: 270 },
  medium: { type: Number, required: true, default: 90 },
  high: { type: Number, required: true, default: 14 },
  critical: { type: Number, required: true, default: 3 },
});

const SMTPSettings = mongoose.model("SMTPSettings", smtpSettingsSchema);
const SLASettings = mongoose.model("SLASettings", SLASettingsSchema);

module.exports = { SMTPSettings, SLASettings };