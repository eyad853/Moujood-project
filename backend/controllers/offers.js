import { pool } from "../index.js";

export const addOffer = async (req, res) => {
  try {
    const business_id = req.user.id;

    const { title, description, offer_price_before,category ,  offer_price_after } = req.body;

    const image = req.file? `${process.env.backendURL}/${req.file.path.replace(/\\/g, '/')}`: null;
        if (!image) {
            return res.status(400).json({
                error: true,
                message: 'Offer image is required'
            });
        }

    const result = await pool.query(
      `INSERT INTO offers 
       (business_id, title, description, image, offer_price_before, offer_price_after , category)
       VALUES ($1, $2, $3, $4, $5, $6 , $7)
       RETURNING *`,
      [business_id, title, description, image, offer_price_before, offer_price_after , category]
    );

    const newOffer = result.rows[0]

    const io =req.app.get('io')
    io.emit('newOffer', newOffer)

    res.status(201).json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const editOffer = async (req, res) => {
  try {
    const business_id = req.user.id;
    const {offer_id} = req.params;

    // 1) Get existing offer (to keep old values)
    const existing = await pool.query(
      `SELECT * FROM offers WHERE offer_id = $1 AND business_id = $2`,
      [offer_id, business_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const oldOffer = existing.rows[0];

    // 2) Extract only sent fields
    const { title, description, offer_price_before, offer_price_after } = req.body;

    // 3) Image (if sent, use new one. If not, keep old)
    const image =req.file? `${process.env.backendURL}/${req.file.path.replace(/\\/g, '/')}`: null

    // 4) Update only provided fields using COALESCE
    const result = await pool.query(
      `UPDATE offers
       SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         image = COALESCE($3, image),
         offer_price_before = COALESCE($4, offer_price_before),
         offer_price_after = COALESCE($5, offer_price_after)
       WHERE offer_id = $6 AND business_id = $7
       RETURNING *`,
      [
        title || null,
        description || null,
        image || null,
        offer_price_before || null,
        offer_price_after || null,
        offer_id,
        business_id
      ]
    );

    const edittedOffer = result.rows[0]

    const io =req.app.get('io')
    io.emit('offerEdited' , edittedOffer)

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const business_id = req.user.id;
    const { offer_id } = req.params;

    const result = await pool.query(
      `DELETE FROM offers 
       WHERE offer_id = $1 AND business_id = $2
       RETURNING *`,
      [offer_id, business_id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Offer not found" });

    const io =req.app.get('io')
    io.emit('offerDeleted' , offer_id)

    res.json({ message: "Offer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getOffers = async (req, res) => {
  try {
    const query = `
      SELECT 
        o.*,
        COALESCE(s.scan_count, 0) AS scan_count,
        COALESCE(l.like_count, 0) AS like_count,
        COALESCE(c.comment_count, 0) AS comment_count,
        (
          COALESCE(s.scan_count, 0) * 5 +
          COALESCE(l.like_count, 0) * 2 +
          COALESCE(c.comment_count, 0) * 3 +
          (RANDOM() * 3)
        ) AS score
      FROM offers o
      LEFT JOIN (
          SELECT offer_id, COUNT(*) AS scan_count
          FROM scans
          GROUP BY offer_id
      ) s ON o.offer_id = s.offer_id
      LEFT JOIN (
          SELECT offer_id, COUNT(*) AS like_count
          FROM likes
          GROUP BY offer_id
      ) l ON o.offer_id = l.offer_id
      LEFT JOIN (
          SELECT offer_id, COUNT(*) AS comment_count
          FROM comments
          GROUP BY offer_id
      ) c ON o.offer_id = c.offer_id
      ORDER BY score DESC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
