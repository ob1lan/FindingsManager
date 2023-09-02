const {
  getAllUsers,
  createUser,
  findUserPerId,
  searchUsersPerUsername,
  updateUserDetails,
  deleteUser,
} = require("../queries/users.queries");

const {
  getProjects,
  createProject,
  findProjectPerId,
  deleteProject,
  updateProject,
} = require("../queries/projects.queries");

const smtpSettingsQuery = require("../queries/settings.queries");
const nodemailer = require("nodemailer");

exports.viewUsers = async (req, res, next) => {
  try {
    // Fetch all users
    const users = await getAllUsers();
    res.render("admin/users-list", {
      users,
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  // Logic to create a new user
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body; // This contains the form data from the modal

    await updateUserDetails(userId, updatedData);

    // If you're using AJAX to submit the form, you might send a JSON response instead of a redirect.
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    // Here, you'll delete the finding using its ID
    await deleteUser(req.params.id);
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};

exports.viewProjects = async (req, res, next) => {
  try {
    const projects = await getProjects();
    res.render("admin/projects-list", {
      projects,
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const body = req.body;
    await createProject({ ...body, createdBy: req.user.username });
    res.redirect("/admin/projects");
  } catch (e) {
    const errors = Object.keys(e.errors).map((key) => e.errors[key].message);
    res.status(400).render("admin/projects-list", {
      errors,
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
    });
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const updatedData = req.body; // This contains the form data from the modal

    await updateProject(projectId, updatedData);

    // If you're using AJAX to submit the form, you might send a JSON response instead of a redirect.
    res.redirect("/admin/projects");
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    // Here, you'll delete the finding using its ID
    await deleteProject(req.params.id);
    res.redirect("/admin/projects");
  } catch (error) {
    next(error);
  }
};

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
