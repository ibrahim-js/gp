import jwt from "jsonwebtoken";

import db from "../db.js";

export async function protect(req, res, next) {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { rows } = await db.query(
        "SELECT id, fname, lname, email, role, poste_ormvag, created_at, updated_at FROM users WHERE id = $1",
        [decoded.userId]
      );

      req.user = rows[0];

      next();
    } catch (error) {
      res.status(401);

      throw new Error("Accès refusé. Token invalide.");
    }
  } else {
    res.status(401);

    throw new Error("Accès refusé. Aucun token fourni.");
  }
}

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Non autorisé. Utilisateur non authentifié." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Accès interdit. Rôle insuffisant." });
    }

    next();
  };
}
