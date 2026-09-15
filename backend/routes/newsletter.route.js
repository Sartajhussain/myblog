import express from "express";

import {
  subscribeNewsletter,
  getSubscriberCount,
} from "../controllers/newsletter.controller.js";

const router = express.Router();

router.post("/subscribe", subscribeNewsletter);

router.get("/count", getSubscriberCount);

export default router;