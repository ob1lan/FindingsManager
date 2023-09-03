const nodemailer = require("nodemailer");
const smtpSettingsQuery = require("../queries/settings.queries");

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
    const { smtpHost, smtpPort, smtpUsername, smtpPassword, testEmail } =
      req.body;

    // Create a transporter using the SMTP settings
    let transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      tls: {
        rejectUnauthorized: false, // Don't fail on invalid certs (useful for local development)
      },
    });

    if (smtpUsername && smtpPassword) {
      transporter.auth = {
        user: smtpUsername,
        pass: smtpPassword,
      };
    }

    // Send a test email
    await transporter.sendMail({
      from: smtpUsername || "default@example.com",
      to: testEmail,
      subject: "Test Email from FindingsManager",
      text: "This is a test email to verify SMTP settings.",
    });

    req.flash("success_msg", "Test email sent successfully!");
    res.redirect("/admin/settings");
  } catch (error) {
    req.flash(
      "error_msg",
      "Failed to send test email. Please check SMTP settings."
    );
    res.redirect("/admin/settings");
  }
};
