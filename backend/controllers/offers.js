import { pool } from "../index.js";

export const addOffer = async (req, res) => {
  try {
    const business_id = req.user.id;

    const { title, description, offer_price_before, offer_price_after } = req.body;

    const image = req.file ? req.file.path : null; // multer image
        if (!image) {
            return res.status(400).json({
                error: true,
                message: 'Offer image is required'
            });
        }
    const imagepath = `${process.env.backendURL}${image}`

    const result = await pool.query(
      `INSERT INTO offers 
       (business_id, title, description, image, offer_price_before, offer_price_after)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [business_id, title, description, imagepath, offer_price_before, offer_price_after]
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
    const offer_id = req.params.id;

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
    const image = req.file ? `${process.env.backendURL}${req.file.path}` : oldOffer.image;

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
    const result = await pool.query(`SELECT * FROM offers ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



