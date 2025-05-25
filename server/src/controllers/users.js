import bcrypt from "bcryptjs";

import db from "../db.js";
import { generateToken } from "../utils/generate-token.js";

export async function authUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);

    throw new Error("Tous les champs sont obligatoires.");
  }

  const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

  if (user?.rows[0]) {
    const matchPasswords = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (matchPasswords) {
      const { id, fname, lname, email } = user.rows[0];

      generateToken(res, id);

      res.status(201).json({ id, fname, lname, email });
    } else {
      res.status(401);

      throw new Error("Email ou mot de passe invalide.");
    }
  } else {
    res.status(401);

    throw new Error("Email ou mot de passe invalide.");
  }
}

export async function registerUser(req, res) {
  const {
    fname,
    lname,
    email,
    password,
    poste_ormvag,
    role = "user",
  } = req.body;

  if (!fname || !lname || !email || !password) {
    res.status(400);

    throw new Error("Tous les champs sont obligatoires.");
  }

  try {
    const existingUser = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      res.status(409);

      throw new Error("Cet email est déjà utilisé.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      `INSERT INTO users (fname, lname, email, poste_ormvag, password, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, fname, lname, email, poste_ormvag, role, created_at, last_connection`,
      [fname, lname, email, poste_ormvag, hashedPassword, role]
    );

    const user = result.rows[0];

    res
      .status(201)
      .json({ message: "Utilisateur enregistré avec succès.", user });
  } catch (error) {
    res.status(500);

    throw new Error(error.message);
  }
}

export async function fetchUsers(req, res) {
  try {
    const results = await db.query(
      "SELECT id, fname, lname, email, poste_ormvag, role, created_at, last_connection FROM users"
    );

    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500);

    throw new Error(error.message);
  }
}

export function logoutUser(req, res) {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Utilisateur déconnecté." });
}

export function getUserProfile(req, res) {
  res.status(200).json(req.user);
}

export async function updateUserProfile(req, res) {
  const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [
    req.user.id,
  ]);

  const user = rows[0];

  if (!user) {
    res.status(404);

    throw new Error("Utilisateur non trouvé.");
  }

  if ("new" in req.body) {
    const { current: currentPassword, new: newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Les champs mot de passe actuel et nouveau mot de passe sont obligatoires.",
      });
    }

    try {
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Mot de passe actuel incorrect." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      const result = await db.query(
        "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, role, fname, lname, poste_ormvag",
        [hashedNewPassword, user.id]
      );

      res.status(200).json({
        message: "Mot de passe mis à jour avec succès.",
        user: result.rows[0],
      });
    } catch (error) {
      res.status(500);

      throw new Error("Erreur serveur. Veuillez réessayer plus tard.");
    }
  } else {
    const fname = req.body.fname || user.fname;
    const lname = req.body.lname || user.lname;
    const email = req.body.email || user.email;
    const poste_ormvag = req.body.poste_ormvag || user.poste_ormvag;

    try {
      const result = await db.query(
        "UPDATE users SET fname = $1, lname = $2, email = $3, poste_ormvag = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, role, fname, lname, poste_ormvag",
        [fname, lname, email, poste_ormvag, req.user.id]
      );

      res.status(200).json({
        message: "Utilisateur mis à jour avec succès.",
        user: result.rows[0],
      });
    } catch (error) {
      res.status(400);

      throw new Error("Échec de la mise à jour de l'utilisateur.");
    }
  }

  // if (user) {
  //   const fname = req.body.fname || user.fname;
  //   const lname = req.body.lname || user.lname;
  //   let password = user.password;

  //   if (req.body.password) {
  //     const salt = await bcrypt.genSalt(10);
  //     password = await bcrypt.hash(req.body.password, salt);
  //   }
  // } else {
  //   res.status(404);

  //   throw new Error("Utilisateur non trouvé.");
  // }
}

export function getMe(req, res) {
  const { id, fname, lname, email, poste_ormvag, role } = req.user;

  res.status(200).json({ id, fname, lname, email, poste_ormvag, role });
}

export async function deleteUser(req, res) {
  const { id } = req.body;

  if (!id) {
    res.status(400);
    throw new Error("ID utilisateur requis.");
  }

  try {
    const existingUser = await db.query(
      "SELECT id, fname, lname FROM users WHERE id = $1",
      [id]
    );

    if (existingUser.rows.length === 0) {
      res.status(404);
      throw new Error("Utilisateur introuvable.");
    }

    await db.query("DELETE FROM users WHERE id = $1", [id]);

    res.status(200).json({
      message: `L'utilisateur ${existingUser.rows[0].fname} ${existingUser.rows[0].lname} a été supprimé avec succès.`,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
}

export async function updateUserByAdmin(req, res) {
  const {
    id,
    role,
    fname,
    lname,
    email,
    poste_ormvag,
    password = "",
  } = req.body;

  if (!id || !role || !fname || !lname || !email || !poste_ormvag) {
    res.status(400);
    throw new Error("Tous les champs requis sauf le mot de passe.");
  }

  try {
    const existingUser = await db.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);

    if (existingUser.rows.length === 0) {
      res.status(404);
      throw new Error("Utilisateur introuvable.");
    }

    let hashedPassword = existingUser.rows[0].password;

    if (password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const result = await db.query(
      `UPDATE users
       SET role = $1,
           fname = $2,
           lname = $3,
           email = $4,
           password = $5,
           poste_ormvag = $6
       WHERE id = $7
       RETURNING id, fname, lname, email, poste_ormvag, role, created_at, last_connection`,
      [role, fname, lname, email, hashedPassword, poste_ormvag, id]
    );

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès.",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
}
