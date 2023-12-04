const nodemailer = require('nodemailer');
const smtpSettingsQuery = require("../queries/settings.queries");


const sendEmail = async (to, subject, text, html) => {
  const smtpSettings = await smtpSettingsQuery.getSMTPSettings();
  console.log("SMTP:", smtpSettings)
  if (smtpSettings.smtpHost && smtpSettings.smtpPort) {
    let transporter = nodemailer.createTransport({
      host: smtpSettings.smtpHost,
      port: smtpSettings.smtpPort,
      secure: smtpSettings.smtpSecure,
      auth:
        smtpSettings.smtpUsername && smtpSettings.smtpPassword
          ? {
              user: smtpSettings.smtpUsername,
              pass: smtpSettings.smtpPassword,
            }
          : null,
    });

    try {
      await transporter.sendMail({
        from: smtpSettings.smtpUsername || "noreply@findingsmanager.com",
        to,
        subject,
        text,
        html,
      });
      return true;
    } catch (error) {
      console.error("Email sending failed:", error);
      return false;
    }
  } else {
    console.error("SMTP settings not configured");
    return false;
  }
};

module.exports = sendEmail;