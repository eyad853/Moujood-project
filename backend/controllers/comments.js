import ERRORS from "../config/errors.js";
import { pool } from "../index.js";

export const createComment = async (req, res) => {
  const {id:user_id , accountType} = req.user;
  const { offer_id } = req.params;
  const {content , parent_id} = req.body

    if(!user_id){
    return res.status(400).json({
      error:true,
      message:ERRORS.NOT_AUTHENTICATED
    })
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO comments (offer_id, user_id, content , parent_id , accountType)
      VALUES ($1, $2, $3 , $4 , $5)
      RETURNING *;
      `,
      [offer_id, user_id, content , parent_id , accountType]
    );

    const commentResult = await pool.query(
      `
      SELECT 
        c.*,
    
        CASE 
          WHEN $1 = 'user' THEN u.name
          WHEN $1 = 'business' THEN b.name
        END AS "userName"
    
      FROM comments c
    
      LEFT JOIN users u 
        ON c."accountType" = 'user' AND c.user_id = u.id
    
      LEFT JOIN businesses b 
        ON c."accountType" = 'business' AND c.user_id = b.id
    
      WHERE c.id = $2
      `,
      [accountType , result.rows[0].id]
    );

    const newComment = commentResult.rows[0];

    res.status(201).json({
      message: "comment_added",
      comment: newComment,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};


export const updateComment = async (req, res) => {
  const user_id = req.user?.id;
  const {content } = req.body;
  const {comment_id} = req.params

    if(!user_id){
    return res.status(400).json({
      error:true,
      message:ERRORS.NOT_AUTHENTICATED
    })
  }

  try {
    // Fetch the comment to verify ownership
    const check = await pool.query(
      `SELECT * FROM comments WHERE id = $1`,
      [comment_id]
    );

    if (check.rowCount === 0) {
      return res.status(404).json({error:true, message: ERRORS.COMMENT_NOT_FOUND });
    }

    if (check.rows[0].user_id !== user_id) {
      return res.status(403).json({error:true, message: ERRORS.UNAUTHORIZED });
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
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

export const deleteComment = async (req, res) => {
  const {id:user_id , accountType} = req.user;
  const { id } = req.params; // comment id

    if(!user_id){
    return res.status(400).json({
      error:true,
      message:ERRORS.NOT_AUTHENTICATED
    })
  }

  try {
    // Ensure user owns the comment
    const check = await pool.query(
      `SELECT * FROM comments WHERE id = $1`,
      [id]
    );

    if (check.rowCount === 0) {
      return res.status(404).json({error:true, message: ERRORS.COMMENT_NOT_FOUND });
    }

    if (check.rows[0].user_id !== user_id) {
      return res.status(403).json({error:true, message: ERRORS.UNAUTHORIZED });
    }

    const offer_id = check.rows[0].offer_id;

    await pool.query(
      `DELETE FROM comments WHERE id = $1 AND accountType= $2`,
      [user_id , accountType]
    );

    res.status(200).json({ message: "comment_removed" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: ERRORS.SERVER_ERROR});
  }
};

export const getOfferComments = async(req , res)=>{
  const {id} = req.params

  try{
    const result = await pool.query(
      `
      SELECT 
        c.*,
        COALESCE(u.name, b.name) AS "userName"

      FROM comments c

      LEFT JOIN users u 
        ON c."accountType" = 'user' AND c.user_id = u.id

      LEFT JOIN businesses b 
        ON c."accountType" = 'business' AND c.user_id = b.id

      WHERE c.offer_id = $1

      ORDER BY c.created_at DESC
      `,
      [id]
    );
      const comments = result.rows
      return res.status(200).json(comments)
  }catch(error){
    console.log(error);
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
}
