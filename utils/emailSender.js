const nodemailer = require('nodemailer');

const sendEmail = async (smtpSettings, mailOptions) => {
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
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = sendEmail;
