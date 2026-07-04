import nodemailer from "nodemailer";

export const sendMail = async (email, otp) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials are not configured");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    });

    console.log("📧 Email sent successfully");
  } catch (error) {
    console.log("EMAIL ERROR:", error.message);
    throw error;
  }
};