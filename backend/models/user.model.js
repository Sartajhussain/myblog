import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,       // ✅ duplicate email rokne ke liye
      lowercase: true,    // ✅ always lowercase
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    bio: {
      type: String,
    },
    profilePic: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
      default: "Web Developer",
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    github: {
      type: String,
    },
    facebook: {
      type: String,
    },

    // ============ EMAIL VERIFICATION ============
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyOtp: {
      type: String,
    },
    verifyOtpExpires: {
      type: Date,
    },

    // ============ FORGOT PASSWORD ============
    resetOtp: {
      type: String,
    },
    resetOtpExpires: {
      type: Date,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userschema);