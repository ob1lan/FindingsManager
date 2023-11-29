const nodemailer = require('nodemailer');
const smtpSettingsQuery = require("../queries/settings.queries");


const sendEmail = async (to, subject, text) => {
  const smtpSettings = await smtpSettingsQuery.getSMTPSettings();
  let transporter = nodemailer.createTransport({
    host: smtpSettings.smtpHost,
    port: smtpSettings.smtpPort,
    secure: smtpSettings.smtpSecure,
  });

  if (smtpSettings.smtpUsername && smtpSettings.smtpPassword) {
    transporter.auth = {
      user: smtpUsername,
      pass: smtpPassword,
    };
  }
  try {
    await transporter.sendMail({
      from: smtpSettings.smtpUsername || "noreply@findingsmanager.com",
      to,
      subject,
      text,
    });
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

module.exports = sendEmail;
