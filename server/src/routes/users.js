import express from "express";

import {
  authUser,
  getUserProfile,
  logoutUser,
  registerUser,
  updateUserProfile,
  getMe,
  fetchUsers,
  deleteUser,
  updateUserByAdmin,
} from "../controllers/users.js";
import { authorizeRoles, protect } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .post(protect, authorizeRoles("admin"), registerUser)
  .get(protect, authorizeRoles("admin"), fetchUsers)
  .put(protect, authorizeRoles("admin"), updateUserByAdmin)
  .delete(protect, authorizeRoles("admin"), deleteUser);

router.post("/auth", authUser);

router.post("/logout", logoutUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get("/me", protect, getMe);

export default router;
