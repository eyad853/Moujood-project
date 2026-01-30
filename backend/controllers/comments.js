import { pool } from "../index.js";

export const createComment = async (req, res) => {
  const user_id = req.user.id;
  const { offer_id } = req.params;
  const {content} = req.body

  try {
    const result = await pool.query(
      `
      INSERT INTO comments (offer_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [offer_id, user_id, content]
    );

    const commentResult = await pool.query(`
       SELECT 
        c.*,
        u.name AS "userName"
        FROM comments c
        LEFT JOIN users u
        ON c.user_id = u.id
        WHERE c.id = $1 ` , [result.rows[0].id]
      )

    const newComment = commentResult.rows[0];

    res.status(201).json({
      message: "comment_added",
      comment: newComment,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server_error" });
  }
};


export const updateComment = async (req, res) => {
  const user_id = req.user.id;
  const {content } = req.body;
  const {comment_id} = req.params

  try {
    // Fetch the comment to verify ownership
    const check = await pool.query(
      `SELECT * FROM comments WHERE id = $1`,
      [comment_id]
    );

    if (check.rowCount === 0) {
      return res.status(404).json({ message: "comment_not_found" });
    }

    if (check.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: "unauthorized" });
    }

    const offer_id = check.rows[0].offer_id;

    // Update comment
    const result = await pool.query(
      `UPDATE comments SET content = $1 WHERE id = $2 RETURNING *`,
      [content, comment_id]
    );

    const updatedComment = result.rows[0];

    res.status(200).json({
      message: "comment_updated",
      comment: updatedComment
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server_error" });
  }
};

export const deleteComment = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params; // comment id

  try {
    // Ensure user owns the comment
    const check = await pool.query(
      `SELECT * FROM comments WHERE id = $1`,
      [id]
    );

    if (check.rowCount === 0) {
      return res.status(404).json({ message: "comment_not_found" });
    }

    if (check.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: "unauthorized" });
    }

    const offer_id = check.rows[0].offer_id;

    await pool.query(
      `DELETE FROM comments WHERE id = $1`,
      [id]
    );

    res.status(200).json({ message: "comment_removed" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server_error" });
  }
};

export const getOfferComments = async(req , res)=>{
  const {id} = req.params

  try{

      const result = await pool.query(`
        SELECT 
        c.*,
        u.name AS "userName"
        FROM comments c
        LEFT JOIN users u
        ON c.user_id = u.id
        WHERE offer_id = $1 
        ORDER BY created_at DESC
        ` , [id])
      const comments = result.rows
      return res.status(200).json(comments)

  }catch(error){
    console.log(error);
    res.status(500).json({ message: "server_error" });
  }
}
