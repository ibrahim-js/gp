import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import db from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function addProject(req, res) {
  const {
    index,
    epi,
    ar,
    et,
    nbr_boite,
    name_project,
    etude,
    date,
    secteur,
    ti,
    name_document,
    nbr_document_a3,
    nbr_document_a4,
    nbr_plan,
    type_document_a3,
    type_document_a4,
    type_document_a0,
    nbr_copy,
    nbr_exemplaire,
    nbr_folder,
    salle,
  } = req.body;

  const query = `
    INSERT INTO projets (
      index, epi, ar, et, nbr_boite, name_project, etude, date, secteur, ti,
      name_document, nbr_document_a3, nbr_document_a4, nbr_plan,
      type_document_a3, type_document_a4, type_document_a0,
      nbr_copy, nbr_exemplaire, nbr_folder, salle, created_by_id
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17,
      $18, $19, $20, $21, $22
    )
    RETURNING *;
  `;

  const values = [
    index,
    epi,
    ar,
    et,
    nbr_boite,
    name_project,
    etude,
    date,
    secteur,
    ti,
    name_document,
    nbr_document_a3,
    nbr_document_a4,
    nbr_plan,
    type_document_a3,
    type_document_a4,
    type_document_a0,
    nbr_copy,
    nbr_exemplaire,
    nbr_folder,
    salle,
    req.user.id,
  ];

  try {
    const result = await db.query(query, values);
    res
      .status(201)
      .json({ message: "Projet ajouté avec succès", project: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du projet." });
  }
}

export async function addProject2(req, res) {
  const {
    name,
    type,
    year,
    secteur,
    mappe,
    producer,
    scale,
    sheet,
    salle,
    tranche,
    index,
    nature,
  } = req.body;

  const query = `
    INSERT INTO projets2 (
      name, type, year, secteur, mappe, producer, scale,
      sheet, salle, tranche, index, nature, created_by_id
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13
    )
    RETURNING *;
  `;

  const values = [
    name,
    type,
    year,
    secteur,
    mappe,
    producer,
    scale,
    sheet,
    salle,
    tranche,
    index,
    nature,
    req.user.id,
  ];

  try {
    const result = await db.query(query, values);
    res.status(201).json({
      message: "Projet ajouté avec succès",
      project: result.rows[0],
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).json({ message: "Erreur lors de l'ajout du projet." });
  }
}

export async function fetchProjects(req, res) {
  const { page = 1, limit = 10, filters = {} } = req.body;
  const offset = (page - 1) * limit;

  let whereClauses = [
    `(status IS NULL OR status NOT IN ('pending', 'rejected'))`,
  ];
  let values = [];
  let i = 1;

  for (const [key, val] of Object.entries(filters)) {
    if (val && val.trim() !== "") {
      whereClauses.push(`LOWER("${key}") LIKE LOWER($${i})`);
      values.push(`%${val}%`);
      i++;
    }
  }

  const whereSQL =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const query = `
    SELECT * FROM projets
    ${whereSQL}
    ORDER BY id DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  const countQuery = `
    SELECT COUNT(*) FROM projets
    ${whereSQL};
  `;

  try {
    const [result, countResult] = await Promise.all([
      db.query(query, values),
      db.query(countQuery, values),
    ]);

    const total = parseInt(countResult.rows[0].count);
    const hasNextPage = offset + limit < total;

    res.json({ projets: result.rows, hasNextPage, total });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des projets" });
  }
}

export async function fetchProjects2(req, res) {
  const { page = 1, limit = 10, filters = {} } = req.body;
  const offset = (page - 1) * limit;

  let whereClauses = [
    `(status IS NULL OR status NOT IN ('pending', 'rejected'))`,
  ];
  let values = [];
  let i = 1;

  for (const [key, val] of Object.entries(filters)) {
    if (val && val.trim() !== "") {
      whereClauses.push(`LOWER("${key}") LIKE LOWER($${i})`);
      values.push(`%${val}%`);
      i++;
    }
  }

  const whereSQL =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const query = `
    SELECT * FROM projets2
    ${whereSQL}
    ORDER BY id DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  const countQuery = `
    SELECT COUNT(*) FROM projets2
    ${whereSQL};
  `;

  try {
    const [result, countResult] = await Promise.all([
      db.query(query, values),
      db.query(countQuery, values),
    ]);

    const total = parseInt(countResult.rows[0].count);
    const hasNextPage = offset + limit < total;

    res.json({ projets: result.rows, hasNextPage, total });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des projets" });
  }
}

export async function fetchProject(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(`SELECT * FROM projets WHERE "id" = $1`, [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    const project = result.rows[0];

    res.json({
      ...project,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function fetchProjectFiles(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      SELECT 
        pf.*,
        CONCAT(u.fname, ' ', u.lname) AS fullname
      FROM 
        projets_files pf
      LEFT JOIN 
        users u ON pf.created_by_id = u.id
      WHERE 
        pf.project_id = $1
      `,
      [id]
    );

    const basePath = path.resolve(__dirname, "..", "files", "projets");

    const filesWithExistence = result.rows.map((file) => {
      const safeName = path.basename(String(file.name || "").trim());

      if (!safeName) {
        return { ...file, exists: false };
      }

      const filePath = path.join(basePath, safeName);
      const exists = fs.existsSync(filePath);

      return { ...file, exists };
    });

    res.status(200).json(filesWithExistence);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function fetchProject2(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(`SELECT * FROM projets2 WHERE "id" = $1`, [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    const project = result.rows[0];

    res.json({
      ...project,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function fetchProject2Files(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      SELECT 
        pf.*,
        CONCAT(u.fname, ' ', u.lname) AS fullname
      FROM 
        projets2_files pf
      LEFT JOIN 
        users u ON pf.created_by_id = u.id
      WHERE 
        pf.project_id = $1
      `,
      [id]
    );

    const basePath = path.resolve(__dirname, "..", "files", "projets2");

    const filesWithExistence = result.rows.map((file) => {
      const safeName = path.basename(String(file.name || "").trim());

      if (!safeName) {
        return { ...file, exists: false };
      }

      const filePath = path.join(basePath, safeName);
      const exists = fs.existsSync(filePath);

      return { ...file, exists };
    });

    res.status(200).json(filesWithExistence);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteProjectFile(req, res) {
  const { id } = req.params;

  try {
    const fileResult = await db.query(
      "SELECT name FROM projets_files WHERE id = $1",
      [id]
    );
    if (fileResult.rows.length === 0) {
      return res.status(404).json({ message: "Fichier non trouvé" });
    }

    const filePath = path.join(
      __dirname,
      "../files/projets",
      fileResult.rows[0].name
    );

    await db.query("DELETE FROM projets_files WHERE id = $1", [id]);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Erreur suppression fichier physique:");
      }
    });

    res.status(200).json({ message: "Fichier supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
}

export async function deleteProject2File(req, res) {
  const { id } = req.params;

  try {
    const fileResult = await db.query(
      "SELECT name FROM projets2_files WHERE id = $1",
      [id]
    );
    if (fileResult.rows.length === 0) {
      return res.status(404).json({ message: "Fichier non trouvé" });
    }

    const filePath = path.join(
      __dirname,
      "../files/projets2",
      fileResult.rows[0].name
    );

    await db.query("DELETE FROM projets2_files WHERE id = $1", [id]);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Erreur suppression fichier physique:");
      }
    });

    res.status(200).json({ message: "Fichier supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
}

export async function updateProject(req, res) {
  const { id } = req.params;
  const {
    ar,
    date,
    epi,
    et,
    etude,
    index,
    name_document,
    name_project,
    nbr_boite,
    nbr_copy,
    nbr_document_a3,
    nbr_document_a4,
    nbr_exemplaire,
    nbr_folder,
    nbr_plan,
    salle,
    secteur,
    ti,
    type_document_a0,
    type_document_a3,
    type_document_a4,
  } = req.body;

  try {
    const query = `
      UPDATE projets
      SET ar = $1,
          date = $2,
          epi = $3,
          et = $4,
          etude = $5,
          index = $6,
          name_document = $7,
          name_project = $8,
          nbr_boite = $9,
          nbr_copy = $10,
          nbr_document_a3 = $11,
          nbr_document_a4 = $12,
          nbr_exemplaire = $13,
          nbr_folder = $14,
          nbr_plan = $15,
          salle = $16,
          secteur = $17,
          ti = $18,
          type_document_a0 = $19,
          type_document_a3 = $20,
          type_document_a4 = $21
      WHERE id = $22
      RETURNING *;
    `;

    const values = [
      ar,
      date,
      epi,
      et,
      etude,
      index,
      name_document,
      name_project,
      nbr_boite,
      nbr_copy,
      nbr_document_a3,
      nbr_document_a4,
      nbr_exemplaire,
      nbr_folder,
      nbr_plan,
      salle,
      secteur,
      ti,
      type_document_a0,
      type_document_a3,
      type_document_a4,
      id,
    ];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Projet non trouvé." });
    }

    res.status(200).json({
      message: "Projet mis à jour avec succès.",
      project: result.rows[0],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur du serveur lors de la mise à jour." });
  }
}

export async function updateProject2(req, res) {
  const { id } = req.params;
  const {
    index,
    mappe,
    name,
    nature,
    producer,
    salle,
    scale,
    secteur,
    sheet,
    tranche,
    type,
    year,
  } = req.body;

  try {
    const query = `
      UPDATE projets2
      SET index = $1,
          mappe = $2,
          name = $3,
          nature = $4,
          producer = $5,
          salle = $6,
          scale = $7,
          secteur = $8,
          sheet = $9,
          tranche = $10,
          type = $11,
          year = $12
      WHERE id = $13
      RETURNING *;
    `;

    const values = [
      index,
      mappe,
      name,
      nature,
      producer,
      salle,
      scale,
      secteur,
      sheet,
      tranche,
      type,
      year,
      id,
    ];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Projet non trouvé." });
    }

    res.status(200).json({
      message: "Projet mis à jour avec succès.",
      project: result.rows[0],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur du serveur lors de la mise à jour." });
  }
}

export async function deleteProject(req, res) {
  const { id } = req.params;

  try {
    const check = await db.query("SELECT * FROM projets WHERE id = $1", [id]);

    if (check.rowCount === 0) {
      return res.status(404).json({ message: "Projet introuvable." });
    }

    const fileResult = await db.query(
      "SELECT name FROM projets_files WHERE project_id = $1",
      [id]
    );

    for (const file of fileResult.rows) {
      const filePath = path.join(__dirname, "../files/projets", file.name);
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn(`⚠️ Impossible de supprimer le fichier: ${file.name}`);
      }
    }

    await db.query("DELETE FROM projets_files WHERE project_id = $1", [id]);

    await db.query("DELETE FROM projets WHERE id = $1", [id]);

    res.status(200).json({ message: "Projet supprimé avec succès." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du projet." });
  }
}

export async function deleteProject2(req, res) {
  const { id } = req.params;

  try {
    const check = await db.query("SELECT * FROM projets2 WHERE id = $1", [id]);

    if (check.rowCount === 0) {
      return res.status(404).json({ message: "Projet introuvable." });
    }

    const fileResult = await db.query(
      "SELECT name FROM projets2_files WHERE project_id = $1",
      [id]
    );

    for (const file of fileResult.rows) {
      const filePath = path.join(__dirname, "../files/projets2", file.name);
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn(`⚠️ Impossible de supprimer le fichier: ${file.name}`);
      }
    }

    await db.query("DELETE FROM projets2_files WHERE project_id = $1", [id]);

    await db.query("DELETE FROM projets2 WHERE id = $1", [id]);

    res.status(200).json({ message: "Projet supprimé avec succès." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du projet." });
  }
}

export async function fetchPendingProjects(req, res) {
  const query = `
    SELECT
      p.id,
      p.index,
      p.name_project AS name,
      p.created_at,
      CONCAT(u.fname, ' ', u.lname) AS fullname,
      'projets' AS type
    FROM projets p
    LEFT JOIN users u ON p.created_by_id = u.id
    WHERE p.status = 'pending'

    UNION ALL

    SELECT
      p2.id,
      p2.index,
      p2.name,
      p2.created_at,
      CONCAT(u.fname, ' ', u.lname) AS fullname,
      'projets2' AS type
    FROM projets2 p2
    LEFT JOIN users u ON p2.created_by_id = u.id
    WHERE p2.status = 'pending'
    ORDER BY created_at DESC
  `;

  try {
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
}

export async function countPendingProjects(req, res) {
  const query = `
    SELECT COUNT(*) AS total_pending
    FROM (
      SELECT 1
      FROM projets
      WHERE status = 'pending'

      UNION ALL

      SELECT 1
      FROM projets2
      WHERE status = 'pending'
    ) AS all_pending_projects;
  `;

  try {
    const result = await db.query(query);
    res
      .status(200)
      .json({ total_pending: parseInt(result.rows[0].total_pending, 10) });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors du comptage des projets en attente." });
  }
}

export async function approveProject(req, res) {
  const { id, type } = req.body;

  if (!id || !type) {
    return res.status(400).json({ message: "ID et type requis." });
  }

  const validTypes = ["projets", "projets2"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Type invalide." });
  }

  const table = type === "projets" ? "projets" : "projets2";

  try {
    const result = await db.query(
      `UPDATE ${table} SET status = 'approved' WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Projet introuvable." });
    }

    const query = `
      SELECT
        p.id,
        p.index,
        p.name_project AS name,
        p.created_at,
        CONCAT(u.fname, ' ', u.lname) AS fullname,
        'projets' AS type
      FROM projets p
      LEFT JOIN users u ON p.created_by_id = u.id
      WHERE p.status = 'pending'

      UNION ALL

      SELECT
        p2.id,
        p2.index,
        p2.name,
        p2.created_at,
        CONCAT(u.fname, ' ', u.lname) AS fullname,
        'projets2' AS type
      FROM projets2 p2
      LEFT JOIN users u ON p2.created_by_id = u.id
      WHERE p2.status = 'pending'
      ORDER BY created_at DESC
    `;

    const pendingProjects = await db.query(query);

    res.status(200).json({
      message: "Projet approuvé avec succès.",
      projects: pendingProjects.rows,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur serveur lors de l'approbation du projet." });
  }
}

export async function rejectProject(req, res) {
  const { id, type, motif } = req.body;

  if (!id || !type) {
    return res.status(400).json({ message: "ID, type requis." });
  }

  const validTypes = ["projets", "projets2"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Type invalide." });
  }

  const table = type === "projets" ? "projets" : "projets2";

  try {
    const result = await db.query(
      `UPDATE ${table} SET status = 'rejected', motif = $1 WHERE id = $2`,
      [motif, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Projet introuvable." });
    }

    const query = `
      SELECT
        p.id,
        p.index,
        p.name_project AS name,
        p.created_at,
        CONCAT(u.fname, ' ', u.lname) AS fullname,
        'projets' AS type
      FROM projets p
      LEFT JOIN users u ON p.created_by_id = u.id
      WHERE p.status = 'pending'

      UNION ALL

      SELECT
        p2.id,
        p2.index,
        p2.name,
        p2.created_at,
        CONCAT(u.fname, ' ', u.lname) AS fullname,
        'projets2' AS type
      FROM projets2 p2
      LEFT JOIN users u ON p2.created_by_id = u.id
      WHERE p2.status = 'pending'
      ORDER BY created_at DESC
    `;

    const pendingProjects = await db.query(query);

    res.status(200).json({
      message: "Projet rejeté avec succès.",
      projects: pendingProjects.rows,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur serveur lors du rejet du projet." });
  }
}

export async function fetchRejectedProjects(req, res) {
  const query = `
    SELECT
      p.id,
      p.index,
      p.name_project AS name,
      p.created_at,
      CONCAT(u.fname, ' ', u.lname) AS fullname,
      p.motif,
      'projets' AS type
    FROM projets p
    LEFT JOIN users u ON p.created_by_id = u.id
    WHERE p.status = 'rejected'

    UNION ALL

    SELECT
      p2.id,
      p2.index,
      p2.name,
      p2.created_at,
      CONCAT(u.fname, ' ', u.lname) AS fullname,
      p2.motif,
      'projets2' AS type
    FROM projets2 p2
    LEFT JOIN users u ON p2.created_by_id = u.id
    WHERE p2.status = 'rejected'
    ORDER BY created_at DESC
  `;

  try {
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des projets rejetés." });
  }
}
