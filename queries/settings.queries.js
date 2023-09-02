const SMTPSettings = require("../database/models/settings.model");

exports.getSMTPSettings = async () => {
  return await SMTPSettings.findOne();
};

exports.saveSMTPSettings = async (settings) => {
  let existingSettings = await SMTPSettings.findOne();

  if (existingSettings) {
    // Update existing settings
    existingSettings.smtpHost = settings.smtpHost;
    existingSettings.smtpPort = settings.smtpPort;
    existingSettings.smtpUsername = settings.smtpUsername;
    existingSettings.smtpPassword = settings.smtpPassword;
    return await existingSettings.save();
  } else {
    // Create new settings
    const newSettings = new SMTPSettings(settings);
    return await newSettings.save();
  }
};
