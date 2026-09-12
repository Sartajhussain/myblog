import User from "../models/user.model.js";
import { sendVerificationMail } from "../utils/sendMail.js";

// ============ VERIFY EMAIL ============
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    if (!user.verifyOtp || user.verifyOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.verifyOtpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired, please resend",
      });
    }

    user.isVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! You can login now.",
    });
  } catch (error) {
    console.log("VERIFY EMAIL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

// ============ RESEND OTP ============
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.verifyOtp = otp;
    user.verifyOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendVerificationMail(email, otp, user.firstName);

    return res.status(200).json({
      success: true,
      message: "OTP resent to your email",
    });
  } catch (error) {
    console.log("RESEND OTP ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
    });
  }
};