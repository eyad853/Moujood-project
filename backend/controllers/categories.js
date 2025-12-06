import { pool } from "../index.js";

// CREATE a new category with full image URL
export const createCategory = async (req, res) => {
  try {
    let { name, parent_id } = req.body;
    parent_id = parent_id === "" ? null : Number(parent_id);
    const image = req.file? `${process.env.backendURL}/${req.file.path.replace(/\\/g, '/')}`: null;

    if (!image) return res.status(400).json({ message: "Image is required" });

    const insert = await pool.query(
      `INSERT INTO categories (name, image, parent_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, image, parent_id]
    );

    const result = await pool.query(`
      SELECT 
        c.*,

        CASE 
          WHEN c.parent_id IS NULL THEN (
              SELECT COUNT(*) 
              FROM businesses b 
              WHERE b.category = c.id
          )
          ELSE 0
        END AS category_usage,

        CASE 
          WHEN c.parent_id IS NOT NULL THEN (
              SELECT COUNT(DISTINCT o.business_id) 
              FROM offers o 
              WHERE o.category = c.id
          )
          ELSE 0
        END AS subcategory_usage

      FROM categories c
      WHERE c.id = ${insert.rows[0].id}
      `)


    res.status(201).json({ message: "Category created", category: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create category" });
  }
};

// EDIT an existing category with full image URL
export const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent_id } = req.body;
    const newImage = req.file? `${process.env.backendURL}/${req.file.path.replace(/\\/g, '/')}`: null;


    // Fetch existing category to keep old image if no new image uploaded
    const existingRes = await pool.query(`SELECT * FROM categories WHERE id = $1`, [id]);
    if (!existingRes.rows.length) return res.status(404).json({ message: "Category not found" });

    const updatedImage = newImage || existingRes.rows[0].image;

    const result = await pool.query(
      `UPDATE categories
       SET name = $1, image = $2, parent_id = $3
       WHERE id = $4 RETURNING *`,
      [name, updatedImage, parent_id || null, id]
    );

    res.json({ message: "Category updated", category: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update category" });
  }
};


// DELETE a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`DELETE FROM categories WHERE id = $1 RETURNING *`, [id]);

    if (!result.rows.length) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted", category: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

// GET all top-level categories (parent_id IS NULL)
export const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM categories WHERE parent_id IS NULL ORDER BY id DESC`);
    res.json({
        error:false,
        categories:result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

export const getAllSubCategories = async (req, res) => {
  const categoryId=req.user.category
  try {
    const result = await pool.query(
      `SELECT * FROM categories WHERE parent_id = $1 ORDER BY id DESC`,[categoryId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch subcategories" });
  }
};