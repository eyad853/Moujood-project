import { pool } from "../index.js"

export const getSettings = async (req, res) => {
  try {
    const { owner_type } = req.params;
    const owner_id = req.user.id; // from authentication middleware

    // Check if settings exist
    let result = await pool.query(
      `SELECT * FROM settings WHERE owner_type = $1 AND owner_id = $2`,
      [owner_type, owner_id]
    );

    // If no settings exist → create default settings
    if (result.rows.length === 0) {
      const insertResult = await pool.query(
        `INSERT INTO settings (owner_type, owner_id)
         VALUES ($1, $2)
         RETURNING *`,
        [owner_type, owner_id]
      );

      return res.json(insertResult.rows[0]);
    }

    // Return existing settings
    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const editSettings = async (req, res) => {
  try {
    const { owner_type } = req.params;
    const owner_id = req.user.id; // from authentication middleware

    const { language, notifications, sounds, vibrate } = req.body;

    // Ensure settings exist
    let existing = await pool.query(
      `SELECT * FROM settings WHERE owner_type = $1 AND owner_id = $2`,
      [owner_type, owner_id]
    );

    // Update settings
    const updateResult = await pool.query(
      `
      UPDATE settings
      SET 
        language = COALESCE($1, language),
        notifications = COALESCE($2, notifications),
        sounds = COALESCE($3, sounds),
        vibrate = COALESCE($4, vibrate)
      WHERE owner_type = $5 AND owner_id = $6
      RETURNING *
      `,
      [language, notifications, sounds, vibrate, owner_type, owner_id]
    );

    res.json(updateResult.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
