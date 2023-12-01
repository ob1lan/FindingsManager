// const nodemailer = require("nodemailer");
const settingsQuery = require("../queries/settings.queries");
const sendEmail = require('../utils/emailSender');


exports.viewSettings = async (req, res, next) => {
  try {
    const smtpSettings = (await settingsQuery.getSMTPSettings()) || {};
    const SLASettings = (await settingsQuery.getSLASettings()) || {};
    res.render("admin/settings", {
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
      user: req.user,
      smtpSettings: smtpSettings,
      SLASettings: SLASettings,
    });
  } catch (error) {
    next(error);
  }
};

exports.saveSettings = async (req, res, next) => {
  try {
    const SMTPsettings = {
      smtpHost: req.body.smtpHost,
      smtpPort: req.body.smtpPort,
      smtpUsername: req.body.smtpUsername,
      smtpPassword: req.body.smtpPassword,
      smtpSecure: req.body.smtpSecure === "on",
    };

    const SLAsettings = {
      info: req.body.slaInfo,
      low: req.body.slaLow,
      medium: req.body.slaMedium,
      high: req.body.slaHigh,
      critical: req.body.slaCritical,
    };

    await settingsQuery.saveSMTPSettings(SMTPsettings);
    await settingsQuery.saveSLASettings(SLAsettings);

    res.redirect("/admin/settings");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.sendTestEmail = async (req, res, next) => {
  try {
    const { testEmail } = req.body;

    // Fetch the SMTP settings using the getSMTPSettings function
    const smtpSettings = await settingsQuery.getSMTPSettings();

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