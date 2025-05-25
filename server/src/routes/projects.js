import express from "express";

import {
  addProject,
  addProject2,
  fetchProjects,
  fetchProject,
  fetchProjects2,
  fetchProjectFiles,
  fetchProject2,
  fetchProject2Files,
  deleteProjectFile,
  deleteProject2File,
  updateProject,
  updateProject2,
  deleteProject,
  deleteProject2,
  fetchPendingProjects,
  countPendingProjects,
  approveProject,
  rejectProject,
  fetchRejectedProjects,
} from "../controllers/projects.js";
import { authorizeRoles, protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/pending", protect, authorizeRoles("admin"), fetchPendingProjects);
router.get("/rejected", protect, fetchRejectedProjects);
router.get(
  "/pending/count",
  protect,
  authorizeRoles("admin"),
  countPendingProjects
);
router.post("/approve", protect, authorizeRoles("admin"), approveProject);
router.post("/reject", protect, authorizeRoles("admin"), rejectProject);

router.post(
  "/e-archive-53-2023/add",
  protect,
  authorizeRoles("admin", "editor"),
  addProject
);
router.post(
  "/e-archive-18-2022/add",
  protect,
  authorizeRoles("admin", "editor"),
  addProject2
);

router.delete(
  "/e-archive-53-2023/:id",
  protect,
  authorizeRoles("admin"),
  deleteProject
);
router.delete(
  "/e-archive-18-2022/:id",
  protect,
  authorizeRoles("admin"),
  deleteProject2
);

router.post("/e-archive-53-2023", protect, fetchProjects);
router.post("/e-archive-18-2022", protect, fetchProjects2);

router.get("/e-archive-53-2023/:id", protect, fetchProject);
router.get("/e-archive-53-2023/:id/files", protect, fetchProjectFiles);

router.get("/e-archive-18-2022/:id", protect, fetchProject2);
router.get("/e-archive-18-2022/:id/files", protect, fetchProject2Files);

router.delete(
  "/e-archive-53-2023/files/:id",
  protect,
  authorizeRoles("admin", "editor"),
  deleteProjectFile
);
router.delete(
  "/e-archive-18-2022/files/:id",
  protect,
  authorizeRoles("admin", "editor"),
  deleteProject2File
);

router.put(
  "/e-archive-53-2023/:id",
  protect,
  authorizeRoles("admin", "editor"),
  updateProject
);
router.put(
  "/e-archive-18-2022/:id",
  protect,
  authorizeRoles("admin", "editor"),
  updateProject2
);

export default router;
