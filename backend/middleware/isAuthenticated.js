import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // 🔒 Token check
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    // 🔐 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIX: ensure consistent user id
    req.user = {
      id: decoded.id || decoded._id
    };

    // 🧪 Debug (temporary)
    console.log("Authenticated User:", req.user);

    next();

  } catch (error) {
    console.error("❌ Authentication Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};