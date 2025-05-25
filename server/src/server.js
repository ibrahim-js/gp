import express from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import fs from "fs";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

import { notFound, errorHandler } from "./middlewares/error.js";
import db from "./db.js";

import usersRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";
import logsRoutes from "./routes/logs.js";
import statsRoutes from "./routes/stats.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = ["http://192.168.90.178:5173", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// UPLOAD LOGIC
const projetsDir = path.join(__dirname, "files", "projets");
const projets2Dir = path.join(__dirname, "files", "projets2");
if (!fs.existsSync(projetsDir)) fs.mkdirSync(projetsDir, { recursive: true });
if (!fs.existsSync(projets2Dir)) fs.mkdirSync(projets2Dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectType = req.query.projectType;

    if (projectType === "projets2") {
      cb(null, projets2Dir);
    } else {
      cb(null, projetsDir);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.array("files", 10), async (req, res) => {
  const { projectId, userId, projectType } = req.body;

  if (!projectId || !userId) {
    return res
      .status(400)
      .json({ message: "Identifiant de projet ou utilisateur manquant" });
  }

  try {
    const insertPromises = req.files.map((file) => {
      const extension = path
        .extname(file.originalname)
        .replace(".", "")
        .toLowerCase();

      const query = `
        INSERT INTO ${projectType}_files (name, extension_type, created_by_id, project_id)
        VALUES ($1, $2, $3, $4);
      `;
      const values = [file.originalname, extension, userId, projectId];
      return db.query(query, values);
    });

    await Promise.all(insertPromises);

    const fetchFilesQuery = await db.query(
      `
      SELECT 
        pf.*,
        CONCAT(u.fname, ' ', u.lname) AS fullname
      FROM 
        ${projectType}_files pf
      LEFT JOIN 
        users u ON pf.created_by_id = u.id
      WHERE 
        pf.project_id = $1
      `,
      [projectId]
    );

    res.status(200).json({
      message: "Fichiers téléversés et enregistrés avec succès",
      files: fetchFilesQuery.rows,
    });
  } catch (err) {
    res.status(500).json({
      message:
        "Erreur lors de l'enregistrement des fichiers dans la base de données",
    });
  }
});

app.get("/download/:projectType/:fileName", (req, res) => {
  const { fileName, projectType } = req.params;

  const filePath = path.join(__dirname, "files", projectType, fileName); // Adjust "projets" as needed

  if (fs.existsSync(filePath)) {
    res.download(filePath, fileName); // triggers download in browser
  } else {
    res.status(404).json({ message: "Fichier introuvable" });
  }
});

// END OF UPLOAD LOGIC

app.use("/files", express.static(path.join(__dirname, "files")));

app.use("/users", usersRoutes);
app.use("/projects", projectRoutes);
app.use("/logs", logsRoutes);
app.use("/stats", statsRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
