import express from "express";
import { generateBlogContent } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate-blog", generateBlogContent);

export default router;