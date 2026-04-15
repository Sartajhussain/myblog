import User from "../models/user.model.js";

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

    // 🔥 OTP generate
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 min

    await user.save();

    console.log("OTP:", otp); // 🔥 testing ke liye

    res.status(200).json({
      success: true,
      message: "OTP sent to email (check console)",
    });

  } catch (err) {
    console.log("FORGOT ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


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

    // 🔥 OTP match check
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // 🔥 Expiry check
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // 🔥 clear OTP
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (err) {
    console.log("VERIFY OTP ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};