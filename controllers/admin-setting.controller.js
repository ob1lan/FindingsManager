// const nodemailer = require("nodemailer");
const smtpSettingsQuery = require("../queries/settings.queries");
const sendEmail = require('../utils/emailSender');


exports.viewSettings = async (req, res, next) => {
  try {
    const smtpSettings = (await smtpSettingsQuery.getSMTPSettings()) || {};
    res.render("admin/settings", {
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
      user: req.user,
      smtpSettings: smtpSettings,
    });
  } catch (error) {
    next(error);
  }
};

exports.saveSettings = async (req, res, next) => {
  try {
    const settings = {
      smtpHost: req.body.smtpHost,
      smtpPort: req.body.smtpPort,
      smtpUsername: req.body.smtpUsername,
      smtpPassword: req.body.smtpPassword,
    };

    await smtpSettingsQuery.saveSMTPSettings(settings);

    res.redirect("/admin/settings");
  } catch (error) {
    next(error);
  }
};

exports.sendTestEmail = async (req, res, next) => {
  try {
    const { testEmail } = req.body;

    // Fetch the SMTP settings using the getSMTPSettings function
    const smtpSettings = await smtpSettingsQuery.getSMTPSettings();

    // Prepare the email options
    const mailOptions = {
      from: smtpSettings.smtpUsername || "default@example.com",
      to: testEmail,
      subject: "Test Email from FindingsManager",
      text: "This is a test email to verify SMTP settings."
    };

    // Send the email using the centralized sendEmail function
    const emailSent = await sendEmail(smtpSettings, mailOptions);

    if (emailSent) {
      req.flash("success_msg", "Test email sent successfully!");
    } else {
      req.flash("error_msg", "Failed to send test email. Please check SMTP settings.");
    }  

    res.redirect("/admin/settings");
  } catch (error) {
    req.flash("error_msg", "Failed to send test email. Please check SMTP settings.");
    res.redirect("/admin/settings");
  }
};