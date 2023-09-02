const mongoose = require("mongoose");
const schema = mongoose.Schema;

const smtpSettingsSchema = schema({
  smtpHost: { type: String, required: true },
  smtpPort: { type: Number, required: true },
  smtpUsername: { type: String, required: false },
  smtpPassword: { type: String, required: false },
  // Add any other settings you want to save
});

const SMTPSettings = mongoose.model("SMTPSettings", smtpSettingsSchema);

module.exports = SMTPSettings;
