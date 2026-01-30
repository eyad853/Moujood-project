import { pool } from "../index.js";

export const getBusinessOffersForScan = async (req, res) => {
  try {
    const { businessId } = req.params;

    const result = await pool.query(
      `
      SELECT 
        o.*
      FROM offers o
      WHERE business_id = $1
      ORDER BY created_at DESC
      `,
      [businessId]
    );

    res.json({
      offers: result.rows
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addScanAndPoints = async (req, res) => {
  const client = await pool.connect();

  try {
    const user_id = req.user.id;
    const { business_id, offer_ids } = req.body;

    if (
      !business_id ||
      !Array.isArray(offer_ids) ||
      offer_ids.length === 0
    ) {
      return res.status(400).json({
        message: 'business_id and offer_ids array are required'
      });
    }

    const POINTS_PER_OFFER = 10;
    const totalPoints = offer_ids.length * POINTS_PER_OFFER;

    await client.query('BEGIN');

    // 1️⃣ Insert scans (one row per offer)
    for (const offer_id of offer_ids) {
      await client.query(
        `
        INSERT INTO scans (user_id, business_id, offer_id)
        VALUES ($1, $2, $3)
        `,
        [user_id, business_id, offer_id]
      );
    }

    // 2️⃣ Insert ONE points row (aggregated)
    await client.query(
      `
      INSERT INTO user_points (user_id, business_id, points)
      VALUES ($1, $2, $3)
      `,
      [user_id, business_id, totalPoints]
    );

    await client.query('COMMIT');

    res.json({
      error: false,
    });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};
