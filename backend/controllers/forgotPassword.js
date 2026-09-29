import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { sendMail } from "../utils/sendMail.js";


// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // =================================================
    // FIND USER
    // =================================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =================================================
    // GENERATE OTP
    // =================================================

    const otp = Math.floor(
      100000 +
        Math.random() * 900000
    ).toString();

    // =================================================
    // SAVE OTP
    // =================================================

    user.resetOtp = otp;

    user.resetOtpExpires =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    // =================================================
    // SEND EMAIL
    // =================================================

    try {
      console.log(
        `📧 Sending password reset OTP to ${normalizedEmail}`
      );

      await sendMail(
        normalizedEmail,
        otp
      );

      console.log(
        `✅ Password reset OTP sent to ${normalizedEmail}`
      );

    } catch (emailError) {
      console.error(
        "❌ PASSWORD RESET EMAIL ERROR:",
        emailError.message
      );

      // OTP cleanup
      user.resetOtp = undefined;
      user.resetOtpExpires = undefined;

      await user.save();

      return res.status(500).json({
        success: false,
        message:
          "Failed to send OTP. Please try again.",
      });
    }

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    console.error(
      "❌ FORGOT PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// =====================================================
// VERIFY PASSWORD RESET OTP
// =====================================================

export const verifyOTP = async (
  req,
  res
) => {
  try {
    const {
      email,
      otp,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message:
          "Email and OTP required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // =================================================
    // FIND USER
    // =================================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =================================================
    // CHECK OTP
    // =================================================

    if (
      !user.resetOtp ||
      user.resetOtp !== otp
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // =================================================
    // CHECK EXPIRY
    // =================================================

    if (
      !user.resetOtpExpires ||
      user.resetOtpExpires < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // =================================================
    // CLEAR OTP
    // =================================================

    user.resetOtp = undefined;

    user.resetOtpExpires = undefined;

    await user.save();

    // =================================================
    // CREATE RESET TOKEN
    // =================================================

    const resetToken = jwt.sign(
      {
        id: user._id,
        purpose: "password-reset",
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "10m",
      }
    );

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({
      success: true,
      message:
        "OTP verified successfully",
      resetToken,
    });

  } catch (error) {
    console.error(
      "❌ VERIFY OTP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword = async (
  req,
  res
) => {
  try {
    const {
      resetToken,
      newPassword,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (
      !resetToken ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Token and new password required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // =================================================
    // VERIFY TOKEN
    // =================================================

    let decoded;

    try {
      decoded = jwt.verify(
        resetToken,
        process.env.JWT_SECRET
      );

    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired reset token",
      });
    }

    // =================================================
    // CHECK TOKEN PURPOSE
    // =================================================

    if (
      decoded.purpose !==
      "password-reset"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid reset token",
      });
    }

    // =================================================
    // FIND USER
    // =================================================

    const user = await User.findById(
      decoded.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =================================================
    // HASH NEW PASSWORD
    // =================================================

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password = hashedPassword;

    await user.save();

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully! Please login.",
    });

  } catch (error) {
    console.error(
      "❌ RESET PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};