import User from "../models/user.model.js";

export const verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp != otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    res.json({
      success: true,
      message: "OTP verified"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying OTP"
    });
  }
};