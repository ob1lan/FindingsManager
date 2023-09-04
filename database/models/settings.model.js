const mongoose = require("mongoose");
const schema = mongoose.Schema;

const smtpSettingsSchema = schema({
  smtpHost: { type: String, required: true },
  smtpPort: { type: Number, required: true },
  smtpUsername: { type: String, required: false },
  smtpPassword: { type: String, required: false },
  smtpSecure: { type: Boolean, required: true },
});

const SMTPSettings = mongoose.model("SMTPSettings", smtpSettingsSchema);

module.exports = SMTPSettings;
