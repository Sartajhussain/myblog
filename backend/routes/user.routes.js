import express from "express";
import {
  getAllUsers,
  login,
  logout,
  updateProfile,
  userRegister,
  getCurrentUser,
} from "../controllers/user.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUploads } from "../middleware/multer.js";

// ✅ resetPassword bhi import karo
import {
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/forgotPassword.js";

import {
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/emailVerification.js";

const router = express.Router();

// AUTH
router.post("/register", userRegister);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", isAuthenticated, getCurrentUser);
router.get("/all-users", getAllUsers);

// PROFILE
router.put("/profile/update", isAuthenticated, singleUploads, updateProfile);

// EMAIL VERIFICATION
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);   // ✅ NAYA ROUTE

export default router;