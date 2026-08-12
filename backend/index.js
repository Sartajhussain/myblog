import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./database/db.js";

import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import commentRoutes from "./routes/comment.route.js";
import contactRoutes from "./routes/contactRoutes.js";
import aiRoute from "./routes/ai.route.js";

import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import fs from "fs";

// PATH CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ENVIRONMENT VARIABLES
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

console.log(
  "Gemini API:",
  process.env.GEMINI_API_KEY ? "Configured" : "Missing"
);

// APP
const app = express();

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

// FRONTEND PATH
const distPath = path.resolve(__dirname, "../frontend/dist");
const indexPath = path.join(distPath, "index.html");

console.log("=================================");
console.log("DIST PATH:", distPath);
console.log("INDEX EXISTS:", fs.existsSync(indexPath));
console.log("=================================");

// TRUST PROXY
app.set("trust proxy", 1);

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://blog-application-774e.onrender.com",
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (origin.includes("localhost") || origin.includes("127.0.0.1")) return true;
  if (
    origin.endsWith(".onrender.com") ||
    origin.endsWith(".vercel.app") ||
    origin.endsWith(".netlify.app")
  ) {
    return true;
  }
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked CORS origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// BODY MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// UPLOADS
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// REQUEST LOGGER
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

// CONTACT RATE LIMITER
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many requests, try again later",
  },
});

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

// API ROUTES
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/contact", contactLimiter, contactRoutes);

// AI ROUTE
app.use("/api/v1/ai", aiRoute);

// FRONTEND STATIC FILES
const isProduction = NODE_ENV === "production";

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// SPA FALLBACK
app.get(/.*/, (req, res) => {
  if (isProduction && fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  return res.status(404).json({
    success: false,
    message: "Frontend not built or not found",
  });
});

// DATABASE + SERVER
const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌍 Mode: ${NODE_ENV}`);
      console.log(
        "Gemini API:",
        process.env.GEMINI_API_KEY ? "Configured" : "Missing"
      );
    });
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
    process.exit(1);
  }
};

startServer();