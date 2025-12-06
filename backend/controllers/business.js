import { pool } from "../index.js";

export const getProfileData = async (req, res) => {
  try {
    const business_id = req.user.id;

    const result = await pool.query(
        `SELECT id,name,email,category,logo,description,
        addresses,locations,number,qr_code,created_at
        );
        FROM businesses
        WHERE id = $1`,
        [business_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Business not found" });
    }
    const profile = result.rows[0]

    res.status(200).json({
        error:false,
        profile
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editProfileData = async (req, res) => {
  try {
    const business_id = req.user.id;

    // 1) Get existing data
    const existing = await pool.query(
      `SELECT * FROM businesses WHERE id = $1`,
      [business_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Business not found" });
    }

    const old = existing.rows[0];

    // 2) Extract fields from body
    const {
        name,
        email,
        category,
        description,
        addresses,
        locations,
        number
    } = req.body;

    // 3) Handle logo (Multer)
    const logo = req.file ? req.file : old.logo;

    // 4) Update using COALESCE
    const result = await pool.query(
      `UPDATE businesses
       SET
         name = COALESCE($1, name),
         email = COALESCE($2, email),
         category = COALESCE($3, category),
         logo = COALESCE($4, logo),
         description = COALESCE($5, description),
         addresses = COALESCE($6, addresses),
         locations = COALESCE($7, locations),
         number = COALESCE($8, number)
       WHERE id = $9
       RETURNING id, name, email, category, logo, description, addresses, locations, number, qr_code, created_at`,
      [
        name || null,
        email || null,
        category || null,
        logo || null,
        description || null,
        addresses || null,
        locations || null,
        number || null,
        business_id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBusinessDashboardData = async (req, res) => {
  try {
    const business_id = req.user.id;

    // Total scans
    const scansResult = await pool.query(
      `SELECT COUNT(*) AS total_scans
       FROM scans
       WHERE business_id = $1`,
      [business_id]
    );

    // Total sales (sum of amounts for this business' offers)
    const salesResult = await pool.query(
        `SELECT COALESCE(SUM(s.amount), 0) AS total_sales
        FROM sales s
        JOIN offers o 
        ON o.offer_id = s.offer_id
        WHERE o.business_id = $1`,
      [business_id]
    );

    // Total offers the business created
    const offersResult = await pool.query(
      `SELECT COUNT(*) AS total_offers
       FROM offers
       WHERE business_id = $1`,
      [business_id]
    );

    

    // Total likes on all offers of this business
    const likesResult = await pool.query(
      `SELECT COUNT(*) AS total_likes
       FROM likes l
       JOIN offers o ON o.offer_id = l.offer_id
       WHERE o.business_id = $1`,
      [business_id]
    );

    // Latest 4 offers
    const latestOffersResult = await pool.query(
        `SELECT offer_id, title,category ,  image, offer_price_before, offer_price_after, created_at
        FROM offers
        WHERE business_id = $1
        ORDER BY created_at DESC
        LIMIT 4`,
      [business_id]
    );

    const offers = latestOffersResult.rows

    // 2️⃣ Extract the category IDs used by these offers
    const categoryIds = [...new Set(offers.map(o => o.category))];  
    console.log(categoryIds);
    // This removes duplicates

    // 3️⃣ Get ONLY these categories
    const categoriesResult = await pool.query(
      `
      SELECT *
      FROM categories
      WHERE id = ANY($1)
      `,
      [categoryIds] // pass the array directly
    );

    const categories = categoriesResult.rows;

    // ================================
    // RESPONSE
    // ================================

    res.json({
      error:false,
      total_scans: parseInt(scansResult.rows[0].total_scans),
      total_sales: parseFloat(salesResult.rows[0].total_sales),
      total_offers: parseInt(offersResult.rows[0].total_offers),
      total_likes: parseInt(likesResult.rows[0].total_likes),
      latest_offers: offers,
      categories 
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBusinessOffers = async (req, res) => {
  try {
    const business_id = req.user.id;

    // 1️⃣ Get all offers for this business
    const offersResult = await pool.query(
      `
      SELECT 
      o.*,
      COUNT(s.id) AS scans
      FROM offers o
      LEFT JOIN scans s ON s.offer_id = o.offer_id
      WHERE o.business_id = $1
      GROUP BY o.offer_id
      ORDER BY o.created_at DESC
      `,
      [business_id]
    );

    const offers = offersResult.rows;

    // If no offers → return empty categories
    if (offers.length === 0) {
      return res.json({
        offers,
        categories: []
      });
    }

    // 2️⃣ Extract the category IDs used by these offers
    const categoryIds = [...new Set(offers.map(o => o.category))];  
    // This removes duplicates

    // 3️⃣ Get ONLY these categories
    const categoriesResult = await pool.query(
      `
      SELECT *
      FROM categories
      WHERE id = ANY($1)
      `,
      [categoryIds] // pass the array directly
    );

    const categories = categoriesResult.rows;

    // 4️⃣ Return both separately
    res.json({
      offers,
      categories,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
