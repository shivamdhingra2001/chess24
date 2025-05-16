const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

 const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      // ✅ Check if user exists
      if (!user) {
        // For security, don't reveal whether the user exists or not
        return res.status(200).json({ message: "If the email exists, a reset link has been sent." });
      }
      
      // Generate token
      const token = crypto.randomBytes(32).toString("hex");
  
      user.resetToken = token;
      user.resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
      await user.save();
      const frontendBaseUrl = process.env.FRONTEND_URL;
     
       const resetLink = `${frontendBaseUrl}/reset-password/${token}`;
  
      const message = `Click the link to reset your password: ${resetLink}`;
  
      await sendEmail(user.email, "Password Reset Request", message);
  
      res.status(200).json({ message: "Reset link sent to email" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
   const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      // Hash the new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
  
      await user.save();
  
      res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  module.exports = { forgotPassword, resetPassword };