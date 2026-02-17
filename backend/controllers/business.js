import { pool } from "../index.js";

export const getBusinessDashboardData = async (req, res) => {
  try {
    const business_id = req.user.id;

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
      total_offers: parseInt(offersResult.rows[0].total_offers),
      total_likes: parseInt(likesResult.rows[0].total_likes),
      latest_offers: offers,
      categories :categories || []
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
      o.*
      FROM offers o
      WHERE o.business_id = $1
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
