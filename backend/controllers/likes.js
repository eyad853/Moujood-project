import ERRORS from "../config/errors.js";
import { pool } from "../index.js";

export const createLike = async (req, res) => {
  const user_id = req.user.id;
  const { offer_id } = req.params;

    if(!user_id){
    return res.status(400).json({
      error:true,
      message:ERRORS.NOT_AUTHENTICATED
    })
  }

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
    return res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

export const deleteLike = async (req, res) => {
  const user_id = req.user.id;
  const { offer_id } = req.params;

    if(!user_id){
    return res.status(400).json({
      error:true,
      message:ERRORS.NOT_AUTHENTICATED
    })
  }

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
      return res.status(404).json({error:true, message: ERRORS.NOT_LIKED_YET });
    }

    res.status(200).json({ message: "like_removed" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};
