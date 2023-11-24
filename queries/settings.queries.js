const { SMTPSettings, SLASettings } = require("../database/models/settings.model");

exports.getSMTPSettings = async () => {
  return await SMTPSettings.findOne();
};

exports.getSLASettings = async () => {
  return await SLASettings.findOne();
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

exports.saveSLASettings = async (SLAsettings) => {
  let existingSLASettings = await SLASettings.findOne();

  if (existingSLASettings) {
    // Update existing settings
    existingSLASettings.info = SLAsettings.info;
    existingSLASettings.low = SLAsettings.low;
    existingSLASettings.medium = SLAsettings.medium;
    existingSLASettings.high = SLAsettings.high;
    existingSLASettings.critical = SLAsettings.critical;

    return await existingSLASettings.save();
  } else {
    // Create new settings
    const newSLASettings = new SLASettings(SLAsettings);
    return await newSLASettings.save();
  }
};