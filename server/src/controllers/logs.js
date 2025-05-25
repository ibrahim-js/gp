import db from "../db.js";

export async function fetchLogs(req, res) {
  try {
    const { page = 1, limit = 2, searchQuery = "" } = req.query;
    const offset = (page - 1) * limit;
    const searchValue = `%${searchQuery}%`;

    const query = `
      SELECT
        logs.id,
        CONCAT(u.fname, ' ', u.lname) AS user,
        logs.action,
        logs.translated_action,
        logs.entity_type,
        logs.entity_id,
        CASE
          WHEN logs.entity_type = 'user' THEN CONCAT(u2.fname, ' ', u2.lname)
          WHEN logs.entity_type = 'project' THEN p.index
          WHEN logs.entity_type = 'project2' THEN p2.index
          ELSE NULL
        END AS entity_ref,
        logs.message,
        logs.created_at
      FROM logs
      JOIN users u ON u.id = logs.user_id
      LEFT JOIN users u2 ON u2.id = logs.entity_id AND logs.entity_type = 'user'
      LEFT JOIN projets p ON p.id = logs.entity_id AND logs.entity_type = 'project'
      LEFT JOIN projets2 p2 ON p2.id = logs.entity_id AND logs.entity_type = 'project2'
      WHERE
        LOWER(CONCAT(u.fname, ' ', u.lname)) LIKE LOWER($1) OR
        LOWER(logs.translated_action) LIKE LOWER($2) OR
        LOWER(p.index) LIKE LOWER($3) OR
        LOWER(p2.index) LIKE LOWER($4) OR
        LOWER(logs.message) LIKE LOWER($5)
      ORDER BY logs.created_at DESC
      LIMIT $6 OFFSET $7;
    `;

    const countQuery = `
      SELECT COUNT(*) AS total_count
      FROM logs
      JOIN users u ON u.id = logs.user_id
      LEFT JOIN users u2 ON u2.id = logs.entity_id AND logs.entity_type = 'user'
      LEFT JOIN projets p ON p.id = logs.entity_id AND logs.entity_type = 'project'
      LEFT JOIN projets2 p2 ON p2.id = logs.entity_id AND logs.entity_type = 'project2'
      WHERE
        LOWER(CONCAT(u.fname, ' ', u.lname)) LIKE LOWER($1) OR
        LOWER(logs.translated_action) LIKE LOWER($2) OR
        LOWER(p.index) LIKE LOWER($3) OR
        LOWER(p2.index) LIKE LOWER($4) OR
        LOWER(logs.message) LIKE LOWER($5);
    `;

    const values = [
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      searchValue,
      limit,
      offset,
    ];

    const [result, countResult] = await Promise.all([
      db.query(query, values),
      db.query(countQuery, values.slice(0, 5)),
    ]);

    const total = parseInt(countResult.rows[0].total_count, 10);

    res.json({
      logs: result.rows,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
}

export async function insertLog(req, res) {
  try {
    const { action, translated_action, entity_type, entity_id, message } =
      req.body;

    if (
      !action ||
      !translated_action ||
      !entity_type ||
      !entity_id ||
      !message
    ) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    const query = `
      INSERT INTO logs (
        user_id,
        action,
        translated_action,
        entity_type,
        entity_id,
        message,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW());
    `;

    const values = [
      req.user.id,
      action,
      translated_action,
      entity_type,
      entity_id,
      message,
    ];

    await db.query(query, values);

    res.status(201).json({ message: "Journal inséré avec succès." });
  } catch (err) {
    res.status(500).json({
      message: "Une erreur est survenue lors de l'insertion du journal.",
    });
  }
}
