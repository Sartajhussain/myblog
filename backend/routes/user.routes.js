import express from "express";
import { getAllUsers, login, logout, updateProfile, userRegister } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUploads } from "../middleware/multer.js";


// 🔥 FIXED IMPORTS (file name + function name match)
import { forgotPassword } from "../controllers/forgotPassword.js";
import { verifyOtp } from "../controllers/verifyOtp.js";

const router = express.Router();

// AUTH ROUTES
router.post("/register", userRegister);
router.post("/login", login);
router.post("/logout", logout);
router.get("/all-users", getAllUsers);

// PROFILE
router.put(
  "/profile/update",
  isAuthenticated,
  singleUploads,
  updateProfile
);

// 🔥 FORGOT PASSWORD FLOW
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);

export default router;