import { pool } from "../index.js";

export const createLike = async (req, res) => {
  const user_id = req.user.id;
  const { offer_id } = req.params;

  try {
    // Create like (unique constraint prevents duplicates)
    const result = await pool.query(
        `
        INSERT INTO likes (offer_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (offer_id, user_id) DO NOTHING
        RETURNING *;
        `,
        [offer_id, user_id]
    );

    // If no row inserted -> user already liked
    if (result.rowCount === 0) {
      return res.status(200).json({ message: "already_liked" });
    }

    const newLike = result.rows[0];

    res.status(201).json({ message: "like_added", like: newLike });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server_error" });
  }
};

export const deleteLike = async (req, res) => {
  const user_id = req.user.id;
  const { offer_id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM likes
      WHERE offer_id = $1 AND user_id = $2
      RETURNING *;
      `,
      [offer_id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "not_liked_yet" });
    }

    res.status(200).json({ message: "like_removed" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server_error" });
  }
};
