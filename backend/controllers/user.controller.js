import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { getDataUri } from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";



export const userRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;



    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "please fill all the details",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "please enter a valid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "password must be at least 6 characters",
      });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashpassword   
    });

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      user: newUser,
    });

  } catch (error) {
    console.log("error while registering user", error);
    return res.status(500).json({
      success: false,
      message: "failed to register user",
      error: error.message,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ 2. Check user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ 4. JWT secret check
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    // ✅ 5. Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔥 IMPORTANT: SAME CONFIG LOGIN + LOGOUT
    const cookieOptions = {
      httpOnly: true,
      secure: false, // ⚠️ local ke liye false, production me true
      sameSite: "lax", // ⚠️ agar frontend alag port pe hai to "none"
      maxAge: 24 * 60 * 60 * 1000,
    };

    // ✅ 6. Set cookie
    res.cookie("token", token, cookieOptions);

    // ✅ 7. Remove password from response
    user.password = undefined;

    // ✅ 8. Send clean user data
    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.firstName}`,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
        instagram: user.instagram,
        linkedin: user.linkedin,
        github: user.github,
        facebook: user.facebook,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};



export const logout = async (_, res) => {
  try {
    res.status(200)
      .cookie("token", "", {
        httpOnly: true,
        secure: false, // ⚠️ local me false, production me true
        sameSite: "lax", // ya "none" agar cross-origin hai
        expires: new Date(0),
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    console.log("Logout Error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


export const updateProfile = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const userId = req.user.id;

    const {
      firstName,
      lastName,
      email,
      bio,
      instagram,
      linkedin,
      github,
      facebook,
    } = req.body;

    let photoUrl;

    if (req.file) {
      const fileUrl = getDataUri(req.file);
      const cloudinaryresponse = await cloudinary.uploader.upload(fileUrl.content);
      photoUrl = cloudinaryresponse.secure_url;
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (instagram) user.instagram = instagram;
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;
    if (facebook) user.facebook = facebook;
    if (photoUrl) user.profilePic = photoUrl;

    await user.save();

    const { password, ...userData } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userData,
    });

  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password -__v");

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });

  } catch (error) {

    console.error("GET ALL USERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });

  }
};
