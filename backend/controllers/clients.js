import { pool } from "../index.js";

export const getFeedPageData = async () => {
  try {
    // Get offers with likes count and comments count
    const offersQuery = `
        SELECT o.*, COALESCE(likes_count.count, 0) AS likes_count, COALESCE(comments_count.count, 0) AS comments_count FROM offers o
        LEFT JOIN (
        SELECT offer_id, COUNT(*) AS count
        FROM likes
        GROUP BY offer_id
        ) likes_count 
        ON o.offer_id = likes_count.offer_id
        LEFT JOIN (
        SELECT offer_id, COUNT(*) AS count
        FROM comments
        GROUP BY offer_id
        ) comments_count 
        ON o.offer_id = comments_count.offer_id
        ORDER BY o.created_at DESC;
    `;
    const offersResult = await pool.query(offersQuery);

    // Get all categories
    const categoriesResult = await pool.query(`SELECT * FROM categories ORDER BY id DESC`);

    return {
        offers: offersResult.rows,
        categories: categoriesResult.rows
    };
  } catch (err) {
    console.error(err);
    throw err;
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
    res.status(500).json({ error: 'Server error' });
  }
};


export const getBusinessesOfCategoryData = async (category) => {
  try {
    const {category}= req.params

    const result = await pool.query(
        `
        SELECT
        b.*,
        COALESCE(s.scan_count, 0) AS scan_count
        FROM businesses b
        LEFT JOIN (
        SELECT business_id, COUNT(*) AS scan_count
        FROM scans
        GROUP BY business_id
        ) s ON b.id = s.business_id
        WHERE b.category = $1
        ORDER BY scan_count DESC
        `,
        [category]
    );

    res.status(200).json({
        error:false,
        businesses:result.rows
    })

  } catch (err) {
    console.error(err);
    throw err;
  }
};


export const getBusinessPageData = async (businessId) => {
  try {
    const {businessId} = req.params
    // Get business info
    const businessResult = await pool.query(
      `SELECT * FROM businesses WHERE id = $1`,
      [businessId]
    );
    const business = businessResult.rows[0];

    // Get business offers
    const offersResult = await pool.query(
      `SELECT * FROM offers WHERE business_id = $1 ORDER BY created_at DESC`,
      [businessId]
    );

    return {
      business,
      offers: offersResult.rows
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};


export const getProfileData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user info + stats
    const result = await pool.query(
      `
      SELECT u.id,u.name,u.email,u.gender,u.governorate,u.user_type,u.created_at,
        (SELECT COUNT(*) FROM scans WHERE user_id = u.id) AS points,
        FROM users u
        WHERE u.id = $1
      `,
      [userId]
    );

    const user = result.rows[0];

    return res.status(200).json({
      error: false,
      user,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: true, message: "Server error" });
  }
};
