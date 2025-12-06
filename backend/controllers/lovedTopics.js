import { pool } from "../index.js";

export const addUserCategory = async (req, res) => {
  try {
    const user_id = req.user.id; // from session
    const { category_id } = req.body;

    if (!category_id) {
      return res.status(400).json({ message: "category_id is required" });
    }

    await pool.query(
      `
      INSERT INTO user_categories (user_id, category_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, category_id) DO NOTHING
      `,
      [user_id, category_id]
    );

    res.json({ message: "Category added successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserCategories = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { categories } = req.body; // array of IDs

    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: "categories must be an array" });
    }

    // Remove all old categories
    await pool.query(`DELETE FROM user_categories WHERE user_id = $1`, [user_id]);

    // Insert new categories
    if (categories.length > 0) {
      const values = categories.map(cat => `(${user_id}, ${cat})`).join(",");
      await pool.query(`
        INSERT INTO user_categories (user_id, category_id)
        VALUES ${values}
      `);
    }

    res.json({ message: "Categories updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserCategories = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT category_id FROM user_categories WHERE user_id = $1`,
      [user_id]
    );

    const ids = result.rows.map(r => r.category_id);

    res.json(ids);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};