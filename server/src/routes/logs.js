import express from "express";

import { fetchLogs, insertLog } from "../controllers/logs.js";
import { authorizeRoles, protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), fetchLogs);
router.post("/", protect, insertLog);

export default router;
