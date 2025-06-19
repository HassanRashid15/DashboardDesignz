const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  generateToken,
  generateResetToken,
  sendPasswordResetEmail,
  sendEmailVerification,
  sendWelcomeEmail,
} = require("../utils/emailService");

// Signup route with email verification
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const name = `${firstName} ${lastName}`;
    const verificationToken = generateToken();

    const user = new User({
      firstName,
      lastName,
      name,
      email,
      password,
      isEmailVerified: false, // Require email verification
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 60 * 1000, // 60 seconds
    });
    await user.save();

    // Send verification email
    const emailResult = await sendEmailVerification(
      email,
      verificationToken,
      name
    );
    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
    }

    // Don't create JWT token until email is verified
    res.status(201).json({
      success: true,
      message:
        "Account created successfully. Please check your email to verify your account.",
      requiresVerification: true,
      email: user.email,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login route with email verification check
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({
        message: "Please verify your email address before logging in",
        requiresVerification: true,
        email: user.email,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Email verification route
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    const emailResult = await sendWelcomeEmail(user.email, user.name);
    if (!emailResult.success) {
      console.error("Failed to send welcome email:", emailResult.error);
    }

    // Create JWT token after successful verification
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
      message:
        "Email verified successfully! You can now log in to your account.",
      redirectUrl: "/dashboard",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Error verifying email" });
  }
});

// Email verification with code route
router.post("/verify-email-code", async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({
        message: "Email and verification code are required",
      });
    }

    const user = await User.findOne({
      email: email,
      emailVerificationToken: verificationCode,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification code",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    const emailResult = await sendWelcomeEmail(user.email, user.name);
    if (!emailResult.success) {
      console.error("Failed to send welcome email:", emailResult.error);
    }

    // Don't create JWT token - user needs to login separately
    res.json({
      success: true,
      message:
        "Email verified successfully! You can now log in to your account.",
      redirectUrl: "/login",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Error verifying email" });
  }
});

// Resend verification email
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const verificationToken = generateToken();
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 60 * 1000; // 60 seconds
    await user.save();

    const emailResult = await sendEmailVerification(
      email,
      verificationToken,
      user.name
    );
    if (!emailResult.success) {
      return res
        .status(500)
        .json({ message: "Failed to send verification email" });
    }

    res.json({ message: "Verification email sent successfully" });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Error sending verification email" });
  }
});

// Forgot password route
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        message:
          "If an account with that email exists, a password reset link has been sent",
      });
    }

    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with reset link
    const emailResult = await sendPasswordResetEmail(
      email,
      resetToken,
      user.name
    );
    if (!emailResult.success) {
      return res
        .status(500)
        .json({ message: "Failed to send password reset email" });
    }

    res.json({
      message:
        "If an account with that email exists, a password reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Error processing request" });
  }
});

// Reset password route
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
});

// Verify reset token (for frontend validation)
router.get("/verify-reset-token/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    res.json({ message: "Token is valid" });
  } catch (error) {
    console.error("Verify reset token error:", error);
    res.status(500).json({ message: "Error verifying token" });
  }
});

module.exports = router;
