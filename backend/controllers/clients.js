import ERRORS from "../config/errors.js";
import { pool } from "../index.js";

export const getFeedPageData = async (req , res) => {
  const userId = req.user.id;

  if(!userId){
    return res.status(400).json({
      error:true,
      message:ERRORS.NOT_AUTHENTICATED
    })
  }

  try {
    // 🔹 Get Ads
    const adsResult = await pool.query(`
      SELECT * FROM ads ORDER BY RANDOM()
    `);

    // 🔹 Get Offers with likes, comments + weighted random score
    const offersQuery = `
      SELECT 
        o.*,

        b.name AS business_name,
        b.logo AS business_logo,
        b.category AS business_category,

        COALESCE(likes_count.count, 0) AS likes_count,
        COALESCE(comments_count.count, 0) AS comments_count,
        (my_like.id IS NOT NULL) AS is_liked,

        (
          COALESCE(likes_count.count, 0) * 2 +
          COALESCE(comments_count.count, 0) * 1 +
          RANDOM() * 5
        ) AS score

      FROM offers o

      JOIN businesses b 
      ON o.business_id = b.id AND b.active = TRUE

      LEFT JOIN (
        SELECT offer_id, COUNT(*) AS count
        FROM likes
        GROUP BY offer_id
      ) likes_count ON o.offer_id = likes_count.offer_id

      LEFT JOIN (
        SELECT offer_id, COUNT(*) AS count
        FROM comments
        GROUP BY offer_id
      ) comments_count ON o.offer_id = comments_count.offer_id

      LEFT JOIN likes my_like
        ON my_like.offer_id = o.offer_id AND my_like.user_id = $1

      ORDER BY score DESC
    `;

    const offersResult = await pool.query(offersQuery , [userId]);

    // 🔹 Categories (unchanged)
    const categoriesResult = await pool.query(`
      SELECT * FROM categories WHERE parent_id IS NULL ORDER BY id DESC
    `);

    return res.status(200).json({
      ads: adsResult.rows,
      offers: offersResult.rows,
      categories: categoriesResult.rows
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({message:ERRORS.SERVER_ERROR})
  }
};

export const getSubCategoriesOfCategory = async (req, res) => {
  try {
    const { category_id } = req.params;

    const result = await pool.query(
      `SELECT * FROM categories WHERE parent_id = $1 ORDER BY id DESC`,
      [category_id]
    );

    res.json({
        error:false,
        subCategories:result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:ERRORS.SERVER_ERROR });
  }
};

export const getBusinessesOfCategory = async (req, res) => {
  try {
    console.log('it comes');
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        b.id,
        b.name,
        b.email,
        b.logo,
        b.description
      FROM businesses b
      WHERE b.active = TRUE AND EXISTS (
        SELECT 1
        FROM offers o
        WHERE o.business_id = b.id
          AND o.category = $1
      )
      ORDER BY
        b.created_at DESC
      `,
      [id]
    );

    res.status(200).json({
      error: false,
      businesses: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: ERRORS.SERVER_ERROR });
  }
};

export const getBusinessPageData = async (req , res) => {
  try {
    const { businessId } = req.params;

    /* 1️⃣ Business basic info */
    const businessResult = await pool.query(
      `
      SELECT id, name, logo, description
      FROM businesses
      WHERE id = $1
      `,
      [businessId]
    );

    if (!businessResult.rows.length) {
      return res.status(404).json({error:true, message: ERRORS.BUSINESS_NOT_FOUND });
    }

    const business = businessResult.rows[0];

    /* 2️⃣ Business locations */
    const locationsResult = await pool.query(
      `
      SELECT id, lat, lng
      FROM business_locations
      WHERE business_id = $1
      `,
      [businessId]
    );

    /* 3️⃣ Business offers */
    const offersResult = await pool.query(
      `
      SELECT
        o.*
      FROM offers o
      WHERE o.business_id = $1
      ORDER BY o.created_at DESC
      `,
      [businessId]
    );

    /* 4️⃣ Subcategories used in offers */
    const subCategoriesResult = await pool.query(
      `
      SELECT DISTINCT
        c.id,
        c.name,
        c.image,
        c.parent_id
      FROM categories c
      INNER JOIN offers o ON o.category = c.id
      WHERE o.business_id = $1
      `,
      [businessId]
    );

    return res.status(200).json({
      business,
      locations: locationsResult.rows,
      offers: offersResult.rows,
      subCategories: subCategoriesResult.rows
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({message:ERRORS.SERVER_ERROR})
  }
};

export const getUserPoints = async (req, res) => {
  const user_id = req.user.id;

    if(!user_id){
    return res.status(400).json({
      error:true,
      message:ERRORS.NOT_AUTHENTICATED
    })
  }

  try {
    const result = await pool.query(
      `
      SELECT COALESCE(SUM(points), 0) AS total_points
      FROM user_points
      WHERE user_id = $1
      `,
      [user_id]
    );

    res.status(200).json({
      total_points: Number(result.rows[0].total_points),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};