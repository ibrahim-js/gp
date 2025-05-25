import express from "express";

import { fetchDashboardStats } from "../controllers/stats.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/dashboard", protect, fetchDashboardStats);

export default router;
