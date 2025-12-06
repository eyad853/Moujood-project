import { pool } from "../index.js";

export const createLike = async (req, res) => {
  const io = req.app.get("io");
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

    // Emit to sockets
    io.emit("offer_like", {
        type: "like_added",
        offer_id,
        user_id,
    });

    res.status(201).json({ message: "like_added", like: newLike });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server_error" });
  }
};

export const deleteLike = async (req, res) => {
  const io = req.app.get("io");
  const user_id = req.user.id;
  const { offer_id } = req.body;

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

    // Emit socket event
    io.to(`offer_${offer_id}`).emit("offer_like", {
      type: "like_removed",
      offer_id,
      user_id,
    });

    res.status(200).json({ message: "like_removed" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server_error" });
  }
};
