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
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        bio: {
            type: String,
        },
        profilePic: {
            type: String,
            default: "", // ✅ empty rakho — frontend pehle se onError pe local fallback image dikha deta hai
        },
        occupation: {
            type: String,
            default: "Web Developer"
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
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
        },
        otpExpires: {
            type: Date,
        },
        isOnline: {
            type: Boolean,
            default: false
        },
    },

    { timestamps: true }
)
export default mongoose.model("User", userschema)