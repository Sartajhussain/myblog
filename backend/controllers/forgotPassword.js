import User from "../models/user.model.js";
import { sendMail } from "../utils/sendMail.js";

// ==========================
// FORGOT PASSWORD (SEND OTP)
// ==========================
export const forgotPassword = async (req, res) => {
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

    // OTP generate
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 min expiry

    await user.save();

    // 🔥 SEND EMAIL
    await sendMail(user.email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (err) {
    console.log("FORGOT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================
// VERIFY OTP
// ==========================
export const verifyOTP = async (req, res) => {
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

    // check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // check expiry
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // clear OTP
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (err) {
    console.log("VERIFY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};