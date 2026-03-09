import { pool } from "../index.js";
import ERRORS from "../config/errors.js";

// CREATE a new category with full image URL
export const createCategory = async (req, res) => {
  try {
    let { name, parent_id } = req.body;
    parent_id = parent_id === "" ? null : Number(parent_id);
    const image = req.file? `${process.env.backendURL}/${req.file.path.replace(/\\/g, '/')}`: null;

    if (!image) return res.status(400).json({ error:true,message: ERRORS.IMAGE_IS_REQUIRED });

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
      const category= result.rows[0]


    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
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
    if (!existingRes.rows.length) return res.status(404).json({ error:true , message: ERRORS.CATEGORY_NOT_FOUND });

    const updatedImage = newImage || existingRes.rows[0].image;

    const result = await pool.query(
      `UPDATE categories
       SET name = $1, image = $2, parent_id = $3
       WHERE id = $4 RETURNING *`,
      [name, updatedImage, parent_id || null, id]
    );

    const editedCategory = result.rows[0]

    res.json({ message: "Category updated", category: editedCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

// DELETE a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`DELETE FROM categories WHERE id = $1 RETURNING *`, [id]);

    if (!result.rows.length) return res.status(404).json({error:true ,  message: ERRORS.CATEGORY_NOT_FOUND });

    res.json({ message: "Category deleted", category: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
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
    res.status(500).json({ message: ERRORS.SERVER_ERROR });
  }
};

export const getSubCategories = async (req, res) => {
  const { category } = req.user;

    if(!category){
    return res.status(400).json({
      error:true,
      message:ERRORS.NOT_AUTHENTICATED
    })
  }

  try {
    const query = `
      WITH RECURSIVE sub_categories AS (
        SELECT *
        FROM categories
        WHERE parent_id = $1

        UNION ALL

        SELECT c.*
        FROM categories c
        INNER JOIN sub_categories sc
          ON c.parent_id = sc.id
      )
      SELECT * FROM sub_categories;
    `;

    const { rows } = await pool.query(query, [category]);

    return res.status(200).json({
      error: false,
      data: rows
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: ERRORS.SERVER_ERROR});
  }
};