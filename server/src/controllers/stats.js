import db from "../db.js";

export async function fetchDashboardStats(req, res) {
  try {
    const query = `
        SELECT
          (SELECT COUNT(*) FROM projets) AS total_projets,
          (SELECT COUNT(*) FROM projets2) AS total_projets2,
          (
            SELECT COUNT(*)
            FROM projets_files
            WHERE LOWER(extension_type) LIKE '%.pdf'
          ) +
          (
            SELECT COUNT(*)
            FROM projets2_files
            WHERE LOWER(extension_type) LIKE '%.pdf'
          ) AS total_pdfs,
          (
            SELECT COUNT(*)
            FROM projets_files
            WHERE LOWER(extension_type) LIKE '%.tif'
          ) +
          (
            SELECT COUNT(*)
            FROM projets2_files
            WHERE LOWER(extension_type) LIKE '%.tif'
          ) AS total_images,
          (
            SELECT COUNT(*)
            FROM projets_files
            WHERE LOWER(extension_type) LIKE '%.points'
          ) +
          (
            SELECT COUNT(*)
            FROM projets2_files
            WHERE LOWER(extension_type) LIKE '%.points'
          ) AS total_autocad,
          (SELECT COUNT(*) FROM users) AS total_users;
      `;

    const result = await db.query(query);

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Échec de la récupération des statistiques du tableau de bord",
    });
  }
}
