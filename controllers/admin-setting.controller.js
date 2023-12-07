const sanitize = require("mongo-sanitize");
const settingsQuery = require("../queries/settings.queries");
const sendEmail = require("../utils/emailSender");

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
      smtpHost: sanitize(String(req.body.smtpHost)),
      smtpPort: sanitize(String(req.body.smtpPort)),
      smtpUsername: sanitize(String(req.body.smtpUsername)),
      smtpPassword: sanitize(String(req.body.smtpPassword)),
      smtpSecure: req.body.smtpSecure === "on",
    };

    const SLAsettings = {
      info: sanitize(String(req.body.slaInfo)),
      low: sanitize(String(req.body.slaLow)),
      medium: sanitize(String(req.body.slaMedium)),
      high: sanitize(String(req.body.slaHigh)),
      critical: sanitize(String(req.body.slaCritical)),
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
      to: sanitize(String(testEmail)),
      subject: "Test Email from FindingsManager",
      text: "This is a test email to verify SMTP settings.",
    };

    // Send the email using the centralized sendEmail function
    const emailSent = await sendEmail(smtpSettings, mailOptions);

    if (emailSent) {
      req.flash("success_msg", "Test email sent successfully!");
    } else {
      req.flash(
        "error_msg",
        "Failed to send test email. Please check SMTP settings."
      );
    }

    res.redirect("/admin/settings");
  } catch (error) {
    req.flash(
      "error_msg",
      "Failed to send test email. Please check SMTP settings."
    );
    res.redirect("/admin/settings");
  }
};
