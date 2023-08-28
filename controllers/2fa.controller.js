const User = require("../database/models/user.model");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

exports.setup2FA = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.twoFA.isTFA) {
    return res.redirect("/users/profile");
  }

  const secret = speakeasy.generateSecret({ length: 20 });
  const dataURL = await QRCode.toDataURL(secret.otpauth_url);

  user.twoFA.secret = secret.base32;
  user.twoFA.dataURL = dataURL;
  user.twoFA.isTFA = 1;
  await user.save();

  res.redirect("/users/profile");
};

exports.verify2FA = async (req, res) => {
  const user = await User.findById(req.user.id);
  const verified = speakeasy.totp.verify({
    secret: user.twoFA.secret,
    encoding: "base32",
    token: req.body.token,
  });

  if (verified) {
    user.twoFA.isTFA = true;
    await user.save();
    res.redirect("/users/profile");
  } else {
    res.send("Invalid token. Please try again.");
  }
};

exports.generateQR = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ length: 20 });
    const dataURL = await QRCode.toDataURL(secret.otpauth_url);

    // Save the secret to the user's session or database for later verification
    req.session.twoFASecret = secret.base32;

    res.json({ dataURL });
  } catch (error) {
    res.status(500).json({ message: "Error generating QR code." });
  }
};
